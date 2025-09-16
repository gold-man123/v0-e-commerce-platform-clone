import { createServerClient } from "@/lib/supabase/server"
import { withAuth } from "@/lib/api/auth-middleware"
import { measurePerformance } from "@/lib/utils/performance"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/users - Get all users (admin only)
export const GET = withAuth(
  async (req: NextRequest, user: any) => {
    return measurePerformance("GET /api/users", async () => {
      const { searchParams } = new URL(req.url)
      const page = Number.parseInt(searchParams.get("page") || "1")
      const limit = Math.min(Number.parseInt(searchParams.get("limit") || "20"), 100)
      const role = searchParams.get("role")
      const search = searchParams.get("search")

      try {
        const supabase = createServerClient()
        let query = supabase
          .from("profiles")
          .select(`
          *,
          store:stores (
            id,
            name_ar,
            name_en,
            is_verified
          )
        `)
          .range((page - 1) * limit, page * limit - 1)

        if (role) {
          query = query.eq("role", role)
        }

        if (search) {
          query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`)
        }

        const { data: users, error, count } = await query

        if (error) throw error

        const result = {
          users: users || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
          },
        }

        return NextResponse.json(result)
      } catch (error) {
        console.error("Error fetching users:", error)
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
      }
    })
  },
  ["admin"],
)
