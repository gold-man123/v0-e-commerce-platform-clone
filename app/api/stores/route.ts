import { createServerClient } from "@/lib/supabase/server"
import { withAuth, withValidation } from "@/lib/api/auth-middleware"
import { storeSchema } from "@/lib/security/validation"
import { measurePerformance } from "@/lib/utils/performance"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/stores - Get all stores
export async function GET(request: NextRequest) {
  return measurePerformance("GET /api/stores", async () => {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "20"), 100)
    const verified = searchParams.get("verified")

    try {
      const supabase = createServerClient()
      let query = supabase
        .from("stores")
        .select(`
          *,
          profiles!stores_owner_id_fkey (
            first_name,
            last_name,
            email
          )
        `)
        .range((page - 1) * limit, page * limit - 1)

      if (verified === "true") {
        query = query.eq("is_verified", true)
      }

      const { data: stores, error, count } = await query

      if (error) throw error

      const result = {
        stores: stores || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      }

      return NextResponse.json(result)
    } catch (error) {
      console.error("Error fetching stores:", error)
      return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 })
    }
  })
}

// POST /api/stores - Create store (authenticated users only)
export const POST = withAuth(
  withValidation(async (req: NextRequest, data: any) => {
    return measurePerformance("POST /api/stores", async () => {
      try {
        const supabase = createServerClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        // Check if user already has a store
        const { data: existingStore } = await supabase.from("stores").select("id").eq("owner_id", user!.id).single()

        if (existingStore) {
          return NextResponse.json({ error: "User already has a store" }, { status: 400 })
        }

        const { data: store, error } = await supabase
          .from("stores")
          .insert({
            ...data,
            owner_id: user!.id,
            status: "pending",
            is_verified: false,
          })
          .select()
          .single()

        if (error) throw error

        // Update user profile to seller role
        await supabase
          .from("profiles")
          .update({
            role: "seller",
            store_id: store.id,
          })
          .eq("id", user!.id)

        return NextResponse.json(store, { status: 201 })
      } catch (error) {
        console.error("Error creating store:", error)
        return NextResponse.json({ error: "Failed to create store" }, { status: 500 })
      }
    })
  }, storeSchema),
)
