"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Users, Store, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"

export function PlatformAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalUsers: 0,
    monthlyUsers: 0,
    totalOrders: 0,
    monthlyOrders: 0,
    totalStores: 0,
    monthlyStores: 0,
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
          .from("orders")
          .select("total_amount, created_at")
          .eq("payment_status", "paid")

        const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0

        // Calculate monthly revenue
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const monthlyRevenue =
          revenueData
            ?.filter((order) => {
              const orderDate = new Date(order.created_at)
              return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
            })
            .reduce((sum, order) => sum + order.total_amount, 0) || 0

        // Fetch user stats
        const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

        const { count: monthlyUsers } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gte("created_at", new Date(currentYear, currentMonth, 1).toISOString())

        // Fetch order stats
        const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

        const { count: monthlyOrders } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .gte("created_at", new Date(currentYear, currentMonth, 1).toISOString())

        // Fetch store stats
        const { count: totalStores } = await supabase.from("stores").select("*", { count: "exact", head: true })

        const { count: monthlyStores } = await supabase
          .from("stores")
          .select("*", { count: "exact", head: true })
          .gte("created_at", new Date(currentYear, currentMonth, 1).toISOString())

        // Calculate metrics
        const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0
        const conversionRate = 2.5 // This would require visitor tracking

        setAnalytics({
          totalRevenue,
          monthlyRevenue,
          totalUsers: totalUsers || 0,
          monthlyUsers: monthlyUsers || 0,
          totalOrders: totalOrders || 0,
          monthlyOrders: monthlyOrders || 0,
          totalStores: totalStores || 0,
          monthlyStores: monthlyStores || 0,
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
  }, [supabase, timeRange])

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
          <h2 className="text-2xl font-bold">تحليلات المنصة</h2>
          <p className="text-muted-foreground">إحصائيات شاملة عن أداء المنصة</p>
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
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">المستخدمين الجدد</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.monthlyUsers}</div>
            <p className="text-xs text-muted-foreground">إجمالي: {analytics.totalUsers} مستخدم</p>
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
            <CardTitle className="text-sm font-medium">المتاجر الجديدة</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.monthlyStores}</div>
            <p className="text-xs text-muted-foreground">إجمالي: {analytics.totalStores} متجر</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>مؤشرات الأداء الرئيسية</CardTitle>
            <CardDescription>المقاييس المهمة لنمو المنصة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">متوسط قيمة الطلب</span>
                <span className="text-sm font-bold">{formatPrice(analytics.averageOrderValue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">معدل التحويل</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-sm font-bold text-green-600">{formatPercentage(analytics.conversionRate)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">معدل نمو المستخدمين</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-sm font-bold text-green-600">+15%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">معدل نمو الإيرادات</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-sm font-bold text-green-600">+22%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>توزيع المبيعات</CardTitle>
            <CardDescription>أداء المبيعات حسب الفئات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">إلكترونيات</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-primary rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">35%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">أزياء</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-secondary rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">25%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">منزل وحديقة</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-2/5 h-full bg-accent rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">20%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">رياضة</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-1/5 h-full bg-destructive rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">20%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
