import { createServerClient } from "@/lib/supabase/server"
import { withAuth, withValidation } from "@/lib/api/auth-middleware"
import { reviewSchema } from "@/lib/security/validation"
import { measurePerformance } from "@/lib/utils/performance"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/reviews - Get reviews for a product
export async function GET(request: NextRequest) {
  return measurePerformance("GET /api/reviews", async () => {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("product_id")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "10"), 50)

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    try {
      const supabase = createServerClient()
      const {
        data: reviews,
        error,
        count,
      } = await supabase
        .from("reviews")
        .select(`
          *,
          user:profiles (
            first_name,
            last_name
          )
        `)
        .eq("product_id", productId)
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (error) throw error

      const result = {
        reviews: reviews || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      }

      return NextResponse.json(result)
    } catch (error) {
      console.error("Error fetching reviews:", error)
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }
  })
}

// POST /api/reviews - Create review (authenticated users only)
export const POST = withAuth(
  withValidation(async (req: NextRequest, data: any) => {
    return measurePerformance("POST /api/reviews", async () => {
      try {
        const supabase = createServerClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        // Check if user has purchased this product
        const { data: orderItem } = await supabase
          .from("order_items")
          .select(`
            id,
            order:orders!inner (
              user_id,
              status
            )
          `)
          .eq("product_id", data.product_id)
          .eq("order.user_id", user!.id)
          .eq("order.status", "delivered")
          .single()

        if (!orderItem) {
          return NextResponse.json({ error: "You can only review products you have purchased" }, { status: 400 })
        }

        // Check if user already reviewed this product
        const { data: existingReview } = await supabase
          .from("reviews")
          .select("id")
          .eq("product_id", data.product_id)
          .eq("user_id", user!.id)
          .single()

        if (existingReview) {
          return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 })
        }

        const { data: review, error } = await supabase
          .from("reviews")
          .insert({
            ...data,
            user_id: user!.id,
          })
          .select()
          .single()

        if (error) throw error

        return NextResponse.json(review, { status: 201 })
      } catch (error) {
        console.error("Error creating review:", error)
        return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
      }
    })
  }, reviewSchema),
)
