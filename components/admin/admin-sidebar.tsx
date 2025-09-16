"use client"

import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Shield,
  Tags,
  MessageSquare,
  HelpCircle,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const navigation = [
    {
      name: "لوحة التحكم",
      href: "/admin",
      icon: LayoutDashboard,
      current: pathname === "/admin",
    },
    {
      name: "المستخدمين",
      href: "/admin/users",
      icon: Users,
      current: pathname.startsWith("/admin/users"),
    },
    {
      name: "المتاجر",
      href: "/admin/stores",
      icon: Store,
      current: pathname.startsWith("/admin/stores"),
    },
    {
      name: "الفئات",
      href: "/admin/categories",
      icon: Tags,
      current: pathname.startsWith("/admin/categories"),
    },
    {
      name: "المنتجات",
      href: "/admin/products",
      icon: Package,
      current: pathname.startsWith("/admin/products"),
    },
    {
      name: "الطلبات",
      href: "/admin/orders",
      icon: ShoppingCart,
      current: pathname.startsWith("/admin/orders"),
    },
    {
      name: "التحليلات",
      href: "/admin/analytics",
      icon: BarChart3,
      current: pathname.startsWith("/admin/analytics"),
    },
    {
      name: "الرسائل",
      href: "/admin/messages",
      icon: MessageSquare,
      current: pathname.startsWith("/admin/messages"),
    },
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-card border-r">
      {/* Admin Header */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">لوحة الإدارة</p>
            <p className="text-xs text-muted-foreground">منصة وادي</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={item.current ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 rtl:flex-row-reverse"
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-3 rtl:flex-row-reverse" asChild>
          <Link href="/admin/help">
            <HelpCircle className="h-4 w-4" />
            المساعدة
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 rtl:flex-row-reverse" asChild>
          <Link href="/admin/settings">
            <Settings className="h-4 w-4" />
            الإعدادات
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rtl:flex-row-reverse text-destructive hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  )
}
