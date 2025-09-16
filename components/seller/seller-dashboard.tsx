"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SellerSidebar } from "./seller-sidebar"
import { StoreSetup } from "./store-setup"
import { ProductManagement } from "./product-management"
import { OrderManagement } from "./order-management"
import { SellerAnalytics } from "./seller-analytics"
import { Package, ShoppingCart, TrendingUp, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import type { StoreType } from "@/lib/types"

export function SellerDashboard() {
  const [store, setStore] = useState<StoreType | null>(null)
  const [stats, setStats] = useState({
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
    const fetchSellerData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        // Fetch seller's store
        const { data: storeData } = await supabase.from("stores").select("*").eq("seller_id", user.id).single()

        setStore(storeData)

        if (storeData) {
          // Fetch products count
          const { count: totalProducts } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("store_id", storeData.id)

          const { count: activeProducts } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("store_id", storeData.id)
            .eq("status", "active")

          // Fetch orders count
          const { count: totalOrders } = await supabase
            .from("order_items")
            .select("*", { count: "exact", head: true })
            .eq("store_id", storeData.id)

          const { count: pendingOrders } = await supabase
            .from("order_items")
            .select("orders!inner(*)", { count: "exact", head: true })
            .eq("store_id", storeData.id)
            .eq("orders.status", "pending")

          // Fetch revenue data
          const { data: revenueData } = await supabase
            .from("order_items")
            .select("total_price, orders!inner(created_at, status)")
            .eq("store_id", storeData.id)
            .eq("orders.status", "delivered")

          const totalRevenue = revenueData?.reduce((sum, item) => sum + item.total_price, 0) || 0

          const currentMonth = new Date().getMonth()
          const currentYear = new Date().getFullYear()
          const monthlyRevenue =
            revenueData
              ?.filter((item) => {
                const orderDate = new Date(item.orders.created_at)
                return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
              })
              .reduce((sum, item) => sum + item.total_price, 0) || 0

          setStats({
            totalProducts: totalProducts || 0,
            activeProducts: activeProducts || 0,
            totalOrders: totalOrders || 0,
            pendingOrders: pendingOrders || 0,
            totalRevenue,
            monthlyRevenue,
          })
        }
      } catch (error) {
        console.error("Error fetching seller data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSellerData()
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

  if (!store) {
    return <StoreSetup onStoreCreated={setStore} />
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar store={store} />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">لوحة تحكم البائع</h1>
              <p className="text-muted-foreground">مرحباً بك في متجر {store.name_ar}</p>
            </div>
            <div className="flex items-center gap-2">
              {store.is_verified ? (
                <Badge className="bg-green-100 text-green-800">متجر موثق</Badge>
              ) : (
                <Badge variant="secondary">في انتظار التوثيق</Badge>
              )}
              <Button>
                <Plus className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                منتج جديد
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">{stats.activeProducts} منتج نشط</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">{stats.pendingOrders} طلب في الانتظار</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الإيرادات الشهرية</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(stats.monthlyRevenue)}</div>
                <p className="text-xs text-muted-foreground">إجمالي: {formatPrice(stats.totalRevenue)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">تقييم المتجر</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{store.rating.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">{store.total_reviews} تقييم</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="products">المنتجات</TabsTrigger>
              <TabsTrigger value="orders">الطلبات</TabsTrigger>
              <TabsTrigger value="analytics">التحليلات</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>الطلبات الأخيرة</CardTitle>
                    <CardDescription>آخر 5 طلبات تم استلامها</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* This would be populated with actual recent orders */}
                      <div className="text-center text-muted-foreground py-8">لا توجد طلبات حديثة</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>المنتجات الأكثر مبيعاً</CardTitle>
                    <CardDescription>أفضل 5 منتجات مبيعاً هذا الشهر</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center text-muted-foreground py-8">لا توجد بيانات مبيعات حتى الآن</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="products">
              <ProductManagement storeId={store.id} />
            </TabsContent>

            <TabsContent value="orders">
              <OrderManagement storeId={store.id} />
            </TabsContent>

            <TabsContent value="analytics">
              <SellerAnalytics storeId={store.id} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
