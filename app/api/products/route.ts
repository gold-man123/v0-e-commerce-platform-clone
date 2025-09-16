import { createServerClient } from "@/lib/supabase/server"
import { withAuth, withValidation } from "@/lib/api/auth-middleware"
import { productSchema } from "@/lib/security/validation"
import { cache, CACHE_KEYS } from "@/lib/utils/cache"
import { measurePerformance } from "@/lib/utils/performance"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/products - Get products with caching
export async function GET(request: NextRequest) {
  return measurePerformance("GET /api/products", async () => {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const store = searchParams.get("store")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "20"), 100) // Max 100 items

    const cacheKey = `products_${category || "all"}_${store || "all"}_${search || "all"}_${page}_${limit}`

    // Check cache first
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    try {
      const supabase = createServerClient()
      let query = supabase
        .from("products")
        .select(`
          *,
          stores (
            id,
            name_ar,
            name_en,
            logo_url
          ),
          categories (
            id,
            name_ar,
            name_en
          )
        `)
        .eq("is_active", true)
        .range((page - 1) * limit, page * limit - 1)

      if (category) {
        query = query.eq("category_id", category)
      }

      if (store) {
        query = query.eq("store_id", store)
      }

      if (search) {
        query = query.or(`name_ar.ilike.%${search}%,name_en.ilike.%${search}%,description_ar.ilike.%${search}%`)
      }

      const { data: products, error, count } = await query

      if (error) throw error

      const result = {
        products: products || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      }

      // Cache for 5 minutes
      cache.set(cacheKey, result, 5 * 60 * 1000)

      return NextResponse.json(result)
    } catch (error) {
      console.error("Error fetching products:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }
  })
}

// POST /api/products - Create product (sellers only)
export const POST = withAuth(
  withValidation(async (req: NextRequest, data: any) => {
    return measurePerformance("POST /api/products", async () => {
      try {
        const supabase = createServerClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        // Get user's store
        const { data: profile } = await supabase.from("profiles").select("store_id").eq("id", user!.id).single()

        if (!profile?.store_id) {
          return NextResponse.json({ error: "Store not found" }, { status: 400 })
        }

        const { data: product, error } = await supabase
          .from("products")
          .insert({
            ...data,
            store_id: profile.store_id,
            created_by: user!.id,
          })
          .select()
          .single()

        if (error) throw error

        // Clear related caches
        cache.delete(CACHE_KEYS.STORE_PRODUCTS(profile.store_id))
        cache.delete(CACHE_KEYS.FEATURED_PRODUCTS)

        return NextResponse.json(product, { status: 201 })
      } catch (error) {
        console.error("Error creating product:", error)
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
      }
    })
  }, productSchema),
  ["seller"],
)
