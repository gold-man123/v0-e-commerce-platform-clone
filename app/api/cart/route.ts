import { createServerClient } from "@/lib/supabase/server"
import { withAuth } from "@/lib/api/auth-middleware"
import { measurePerformance } from "@/lib/utils/performance"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/cart - Get user's cart
export const GET = withAuth(
  async (req: NextRequest, user: any) => {
    return measurePerformance("GET /api/cart", async () => {
      try {
        const supabase = createServerClient()

        const { data: cartItems, error } = await supabase
          .from("cart_items")
          .select(`
          *,
          products (
            id,
            name_ar,
            name_en,
            price,
            image_url,
            stock_quantity,
            stores (
              name_ar,
              name_en
            )
          )
        `)
          .eq("user_id", user.id)

        if (error) throw error

        return NextResponse.json({ items: cartItems || [] })
      } catch (error) {
        console.error("Error fetching cart:", error)
        return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
      }
    })
  },
  ["customer"],
)

// POST /api/cart - Add item to cart
export const POST = withAuth(
  async (req: NextRequest, user: any) => {
    return measurePerformance("POST /api/cart", async () => {
      try {
        const { product_id, quantity = 1 } = await req.json()

        if (!product_id || quantity < 1) {
          return NextResponse.json({ error: "Invalid product or quantity" }, { status: 400 })
        }

        const supabase = createServerClient()

        // Check if product exists and has stock
        const { data: product, error: productError } = await supabase
          .from("products")
          .select("stock_quantity, is_active")
          .eq("id", product_id)
          .single()

        if (productError || !product) {
          return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }

        if (!product.is_active) {
          return NextResponse.json({ error: "Product is not available" }, { status: 400 })
        }

        if (product.stock_quantity < quantity) {
          return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
        }

        // Check if item already in cart
        const { data: existingItem } = await supabase
          .from("cart_items")
          .select("id, quantity")
          .eq("user_id", user.id)
          .eq("product_id", product_id)
          .single()

        if (existingItem) {
          // Update quantity
          const newQuantity = existingItem.quantity + quantity

          if (newQuantity > product.stock_quantity) {
            return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
          }

          const { data: updatedItem, error } = await supabase
            .from("cart_items")
            .update({ quantity: newQuantity })
            .eq("id", existingItem.id)
            .select()
            .single()

          if (error) throw error
          return NextResponse.json(updatedItem)
        } else {
          // Add new item
          const { data: newItem, error } = await supabase
            .from("cart_items")
            .insert({
              user_id: user.id,
              product_id,
              quantity,
            })
            .select()
            .single()

          if (error) throw error
          return NextResponse.json(newItem, { status: 201 })
        }
      } catch (error) {
        console.error("Error adding to cart:", error)
        return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
      }
    })
  },
  ["customer"],
)
