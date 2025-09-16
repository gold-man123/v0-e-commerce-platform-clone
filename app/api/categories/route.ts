import { createServerClient } from "@/lib/supabase/server"
import { withAuth, withValidation } from "@/lib/api/auth-middleware"
import { categorySchema } from "@/lib/security/validation"
import { cache, CACHE_KEYS } from "@/lib/utils/cache"
import { measurePerformance } from "@/lib/utils/performance"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  return measurePerformance("GET /api/categories", async () => {
    const cacheKey = CACHE_KEYS.CATEGORIES
    const cachedData = cache.get(cacheKey)

    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    try {
      const supabase = createServerClient()
      const { data: categories, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })

      if (error) throw error

      // Cache for 30 minutes
      cache.set(cacheKey, categories, 30 * 60 * 1000)

      return NextResponse.json(categories)
    } catch (error) {
      console.error("Error fetching categories:", error)
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }
  })
}

// POST /api/categories - Create category (admin only)
export const POST = withAuth(
  withValidation(async (req: NextRequest, data: any) => {
    return measurePerformance("POST /api/categories", async () => {
      try {
        const supabase = createServerClient()
        const { data: category, error } = await supabase.from("categories").insert(data).select().single()

        if (error) throw error

        // Clear cache
        cache.delete(CACHE_KEYS.CATEGORIES)

        return NextResponse.json(category, { status: 201 })
      } catch (error) {
        console.error("Error creating category:", error)
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
      }
    })
  }, categorySchema),
  ["admin"],
)
