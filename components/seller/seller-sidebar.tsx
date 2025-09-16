"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Store } from "@/lib/types"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  StoreIcon,
  Users,
  MessageSquare,
  HelpCircle,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface SellerSidebarProps {
  store: Store
}

export function SellerSidebar({ store }: SellerSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const navigation = [
    {
      name: "لوحة التحكم",
      href: "/seller",
      icon: LayoutDashboard,
      current: pathname === "/seller",
    },
    {
      name: "المنتجات",
      href: "/seller/products",
      icon: Package,
      current: pathname.startsWith("/seller/products"),
    },
    {
      name: "الطلبات",
      href: "/seller/orders",
      icon: ShoppingCart,
      current: pathname.startsWith("/seller/orders"),
    },
    {
      name: "العملاء",
      href: "/seller/customers",
      icon: Users,
      current: pathname.startsWith("/seller/customers"),
    },
    {
      name: "التحليلات",
      href: "/seller/analytics",
      icon: BarChart3,
      current: pathname.startsWith("/seller/analytics"),
    },
    {
      name: "الرسائل",
      href: "/seller/messages",
      icon: MessageSquare,
      current: pathname.startsWith("/seller/messages"),
    },
    {
      name: "إعدادات المتجر",
      href: "/seller/settings",
      icon: StoreIcon,
      current: pathname.startsWith("/seller/settings"),
    },
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-card border-r">
      {/* Store Info */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Avatar className="h-10 w-10">
            <AvatarImage src={store.logo_url || ""} alt={store.name_ar} />
            <AvatarFallback>{store.name_ar.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{store.name_ar}</p>
            <div className="flex items-center gap-2 mt-1">
              {store.is_verified ? (
                <Badge className="text-xs bg-green-100 text-green-800">موثق</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  غير موثق
                </Badge>
              )}
            </div>
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
          <Link href="/seller/help">
            <HelpCircle className="h-4 w-4" />
            المساعدة
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 rtl:flex-row-reverse" asChild>
          <Link href="/seller/settings">
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
