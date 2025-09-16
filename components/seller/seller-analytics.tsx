"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, DollarSign, Package, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"

interface SellerAnalyticsProps {
  storeId: string
}

interface AnalyticsData {
  totalRevenue: number
  monthlyRevenue: number
  totalOrders: number
  monthlyOrders: number
  totalProducts: number
  activeProducts: number
  averageOrderValue: number
  conversionRate: number
}

export function SellerAnalytics({ storeId }: SellerAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    monthlyOrders: 0,
    totalProducts: 0,
    activeProducts: 0,
    averageOrderValue: 0,
    conversionRate: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")
  const supabase = createClient()

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch revenue data
        const { data: revenueData } = await supabase
          .from("order_items")
          .select("total_price, orders!inner(created_at, status)")
          .eq("store_id", storeId)
          .eq("orders.status", "delivered")

        const totalRevenue = revenueData?.reduce((sum, item) => sum + item.total_price, 0) || 0

        // Calculate monthly revenue
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const monthlyRevenue =
          revenueData
            ?.filter((item) => {
              const orderDate = new Date(item.orders.created_at)
              return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
            })
            .reduce((sum, item) => sum + item.total_price, 0) || 0

        // Fetch orders data
        const { count: totalOrders } = await supabase
          .from("order_items")
          .select("*", { count: "exact", head: true })
          .eq("store_id", storeId)

        const { count: monthlyOrders } = await supabase
          .from("order_items")
          .select("orders!inner(*)", { count: "exact", head: true })
          .eq("store_id", storeId)
          .gte("orders.created_at", new Date(currentYear, currentMonth, 1).toISOString())

        // Fetch products data
        const { count: totalProducts } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("store_id", storeId)

        const { count: activeProducts } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("store_id", storeId)
          .eq("status", "active")

        // Calculate metrics
        const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0
        const conversionRate = 0 // This would require visitor tracking

        setAnalytics({
          totalRevenue,
          monthlyRevenue,
          totalOrders: totalOrders || 0,
          monthlyOrders: monthlyOrders || 0,
          totalProducts: totalProducts || 0,
          activeProducts: activeProducts || 0,
          averageOrderValue,
          conversionRate,
        })
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [supabase, storeId, timeRange])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-MR", {
      style: "currency",
      currency: "MRU",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">التحليلات والإحصائيات</h2>
          <p className="text-muted-foreground">تتبع أداء متجرك ومبيعاتك</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">آخر 7 أيام</SelectItem>
            <SelectItem value="30d">آخر 30 يوم</SelectItem>
            <SelectItem value="90d">آخر 3 أشهر</SelectItem>
            <SelectItem value="1y">آخر سنة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإيرادات الشهرية</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(analytics.monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 text-green-500 ml-1 rtl:ml-0 rtl:mr-1" />
              إجمالي: {formatPrice(analytics.totalRevenue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الطلبات الشهرية</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.monthlyOrders}</div>
            <p className="text-xs text-muted-foreground">إجمالي: {analytics.totalOrders} طلب</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المنتجات النشطة</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeProducts}</div>
            <p className="text-xs text-muted-foreground">من أصل {analytics.totalProducts} منتج</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط قيمة الطلب</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(analytics.averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">لكل طلب</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>أداء المبيعات</CardTitle>
            <CardDescription>تطور المبيعات خلال الفترة المحددة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-12">
              الرسم البياني للمبيعات
              <br />
              <span className="text-sm">(سيتم إضافته قريباً)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>أفضل المنتجات مبيعاً</CardTitle>
            <CardDescription>المنتجات الأكثر مبيعاً في متجرك</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-12">
              قائمة أفضل المنتجات
              <br />
              <span className="text-sm">(سيتم إضافتها قريباً)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
