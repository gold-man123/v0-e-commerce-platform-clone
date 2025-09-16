"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminSidebar } from "./admin-sidebar"
import { PlatformOverview } from "./platform-overview"
import { UserManagement } from "./user-management"
import { StoreManagement } from "./store-management"
import { CategoryManagement } from "./category-management"
import { OrderManagement } from "./order-management"
import { PlatformAnalytics } from "./platform-analytics"
import { Users, Store, Package, ShoppingCart, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

interface PlatformStats {
  totalUsers: number
  totalSellers: number
  totalStores: number
  verifiedStores: number
  totalProducts: number
  activeProducts: number
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  monthlyRevenue: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalSellers: 0,
    totalStores: 0,
    verifiedStores: 0,
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchPlatformStats = async () => {
      try {
        // Fetch user stats
        const { count: totalUsers } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true)

        const { count: totalSellers } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "seller")
          .eq("is_active", true)

        // Fetch store stats
        const { count: totalStores } = await supabase
          .from("stores")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true)

        const { count: verifiedStores } = await supabase
          .from("stores")
          .select("*", { count: "exact", head: true })
          .eq("is_verified", true)
          .eq("is_active", true)

        // Fetch product stats
        const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true })

        const { count: activeProducts } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("status", "active")

        // Fetch order stats
        const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

        const { count: pendingOrders } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending")

        // Fetch revenue stats
        const { data: revenueData } = await supabase
          .from("orders")
          .select("total_amount, created_at")
          .eq("payment_status", "paid")

        const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0

        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const monthlyRevenue =
          revenueData
            ?.filter((order) => {
              const orderDate = new Date(order.created_at)
              return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
            })
            .reduce((sum, order) => sum + order.total_amount, 0) || 0

        setStats({
          totalUsers: totalUsers || 0,
          totalSellers: totalSellers || 0,
          totalStores: totalStores || 0,
          verifiedStores: verifiedStores || 0,
          totalProducts: totalProducts || 0,
          activeProducts: activeProducts || 0,
          totalOrders: totalOrders || 0,
          pendingOrders: pendingOrders || 0,
          totalRevenue,
          monthlyRevenue,
        })
      } catch (error) {
        console.error("Error fetching platform stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlatformStats()
  }, [supabase])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-MR", {
      style: "currency",
      currency: "MRU",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">لوحة تحكم الإدارة</h1>
              <p className="text-muted-foreground">إدارة منصة وادي للتجارة الإلكترونية</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">{stats.totalSellers} بائع</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المتاجر</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStores}</div>
                <p className="text-xs text-muted-foreground">{stats.verifiedStores} متجر موثق</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المنتجات</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">{stats.activeProducts} منتج نشط</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الطلبات</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">{stats.pendingOrders} في الانتظار</p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الإيرادات الشهرية</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(stats.monthlyRevenue)}</div>
                <p className="text-xs text-muted-foreground">هذا الشهر</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">جميع الأوقات</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="users">المستخدمين</TabsTrigger>
              <TabsTrigger value="stores">المتاجر</TabsTrigger>
              <TabsTrigger value="categories">الفئات</TabsTrigger>
              <TabsTrigger value="orders">الطلبات</TabsTrigger>
              <TabsTrigger value="analytics">التحليلات</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <PlatformOverview stats={stats} />
            </TabsContent>

            <TabsContent value="users">
              <UserManagement />
            </TabsContent>

            <TabsContent value="stores">
              <StoreManagement />
            </TabsContent>

            <TabsContent value="categories">
              <CategoryManagement />
            </TabsContent>

            <TabsContent value="orders">
              <OrderManagement />
            </TabsContent>

            <TabsContent value="analytics">
              <PlatformAnalytics />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
