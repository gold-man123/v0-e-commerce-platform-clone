import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function withAuth(
  handler: (req: NextRequest, user: any) => Promise<NextResponse>,
  allowedRoles?: string[],
) {
  return async (req: NextRequest) => {
    try {
      const supabase = createServerClient()
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // Check user role if specified
      if (allowedRoles && allowedRoles.length > 0) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

        if (!profile || !allowedRoles.includes(profile.role)) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }
      }

      return handler(req, user)
    } catch (error) {
      console.error("Auth middleware error:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }
}

export function withValidation<T>(handler: (req: NextRequest, data: T) => Promise<NextResponse>, schema: any) {
  return async (req: NextRequest) => {
    try {
      const body = await req.json()
      const validation = schema.safeParse(body)

      if (!validation.success) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: validation.error.errors,
          },
          { status: 400 },
        )
      }

      return handler(req, validation.data)
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }
  }
}
