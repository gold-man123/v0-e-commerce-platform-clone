import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AuthGuard } from "@/components/auth/auth-guard"
import { SellerDashboard } from "@/components/seller/seller-dashboard"

export default async function SellerPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "seller") {
    redirect("/unauthorized")
  }

  return (
    <AuthGuard requiredRole="seller">
      <SellerDashboard />
    </AuthGuard>
  )
}
