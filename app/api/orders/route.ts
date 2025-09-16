import { createServerClient } from "@/lib/supabase/server"
import { withAuth, withValidation } from "@/lib/api/auth-middleware"
import { orderSchema } from "@/lib/security/validation"
import { measurePerformance } from "@/lib/utils/performance"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/orders - Get user's orders
export const GET = withAuth(async (req: NextRequest, user: any) => {
  return measurePerformance("GET /api/orders", async () => {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "20"), 100)
    const status = searchParams.get("status")

    try {
      const supabase = createServerClient()
      let query = supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            product:products (
              name_ar,
              name_en,
              images,
              store:stores (
                name_ar,
                name_en
              )
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (status) {
        query = query.eq("status", status)
      }

      const { data: orders, error, count } = await query

      if (error) throw error

      const result = {
        orders: orders || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      }

      return NextResponse.json(result)
    } catch (error) {
      console.error("Error fetching orders:", error)
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }
  })
})

// POST /api/orders - Create new order
export const POST = withAuth(
  withValidation(async (req: NextRequest, data: any) => {
    return measurePerformance("POST /api/orders", async () => {
      try {
        const supabase = createServerClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        // Calculate total amount and validate products
        let totalAmount = 0
        const validatedItems = []

        for (const item of data.items) {
          const { data: product } = await supabase
            .from("products")
            .select("id, price, stock_quantity, store_id")
            .eq("id", item.product_id)
            .eq("is_active", true)
            .single()

          if (!product) {
            return NextResponse.json({ error: `Product ${item.product_id} not found or inactive` }, { status: 400 })
          }

          if (product.stock_quantity < item.quantity) {
            return NextResponse.json({ error: `Insufficient stock for product ${item.product_id}` }, { status: 400 })
          }

          totalAmount += product.price * item.quantity
          validatedItems.push({
            ...item,
            price: product.price,
            store_id: product.store_id,
          })
        }

        // Create order
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: user!.id,
            total_amount: totalAmount,
            status: "pending",
            payment_method: data.payment_method,
            shipping_address: data.shipping_address,
            notes: data.notes,
          })
          .select()
          .single()

        if (orderError) throw orderError

        // Create order items grouped by store
        const storeOrders = new Map()

        for (const item of validatedItems) {
          if (!storeOrders.has(item.store_id)) {
            storeOrders.set(item.store_id, [])
          }
          storeOrders.get(item.store_id).push(item)
        }

        // Create store-specific orders
        for (const [storeId, items] of storeOrders) {
          const storeTotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

          const { data: storeOrder, error: storeOrderError } = await supabase
            .from("store_orders")
            .insert({
              order_id: order.id,
              store_id: storeId,
              total_amount: storeTotal,
              status: "pending",
            })
            .select()
            .single()

          if (storeOrderError) throw storeOrderError

          // Create order items
          const orderItems = items.map((item: any) => ({
            order_id: order.id,
            store_order_id: storeOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          }))

          const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

          if (itemsError) throw itemsError

          // Update product stock
          for (const item of items) {
            await supabase.rpc("decrement_stock", {
              product_id: item.product_id,
              quantity: item.quantity,
            })
          }
        }

        // Clear user's cart
        await supabase.from("cart_items").delete().eq("user_id", user!.id)

        return NextResponse.json(order, { status: 201 })
      } catch (error) {
        console.error("Error creating order:", error)
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
      }
    })
  }, orderSchema),
)
