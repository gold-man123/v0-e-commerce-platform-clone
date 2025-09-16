"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingUp, TrendingDown, Activity } from "lucide-react"
import Link from "next/link"

interface PlatformOverviewProps {
  stats: {
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
}

export function PlatformOverview({ stats }: PlatformOverviewProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-MR", {
      style: "currency",
      currency: "MRU",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const pendingStoresCount = stats.totalStores - stats.verifiedStores
  const inactiveProductsCount = stats.totalProducts - stats.activeProducts

  return (
    <div className="space-y-6">
      {/* Alerts and Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pendingStoresCount > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <CardTitle className="text-sm text-orange-800">متاجر في انتظار التوثيق</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-900">{pendingStoresCount}</p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent" asChild>
                <Link href="/admin/stores?filter=pending">مراجعة المتاجر</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {stats.pendingOrders > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-sm text-blue-800">طلبات في الانتظار</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-900">{stats.pendingOrders}</p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent" asChild>
                <Link href="/admin/orders?status=pending">مراجعة الطلبات</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {inactiveProductsCount > 0 && (
          <Card className="border-gray-200 bg-gray-50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-gray-600" />
                <CardTitle className="text-sm text-gray-800">منتجات غير نشطة</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{inactiveProductsCount}</p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent" asChild>
                <Link href="/admin/products?status=inactive">مراجعة المنتجات</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>النشاط الأخير</CardTitle>
            <CardDescription>آخر الأنشطة على المنصة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">تم تسجيل بائع جديد</span>
                </div>
                <span className="text-xs text-muted-foreground">منذ 5 دقائق</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm">طلب جديد تم استلامه</span>
                </div>
                <span className="text-xs text-muted-foreground">منذ 15 دقيقة</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                  <span className="text-sm">متجر جديد في انتظار التوثيق</span>
                </div>
                <span className="text-xs text-muted-foreground">منذ 30 دقيقة</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm">منتج جديد تم إضافته</span>
                </div>
                <span className="text-xs text-muted-foreground">منذ ساعة</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إحصائيات سريعة</CardTitle>
            <CardDescription>نظرة سريعة على أداء المنصة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">معدل نمو المستخدمين</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-sm text-green-600">+12%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">معدل نمو المبيعات</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-sm text-green-600">+8%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">معدل التحويل</span>
                <div className="flex items-center gap-1">
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span className="text-sm text-red-600">-2%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">متوسط قيمة الطلب</span>
                <span className="text-sm font-medium">
                  {formatPrice(stats.totalRevenue / (stats.totalOrders || 1))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Health */}
      <Card>
        <CardHeader>
          <CardTitle>صحة المنصة</CardTitle>
          <CardDescription>مؤشرات الأداء الرئيسية للمنصة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {((stats.verifiedStores / (stats.totalStores || 1)) * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">المتاجر الموثقة</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {((stats.activeProducts / (stats.totalProducts || 1)) * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">المنتجات النشطة</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {((stats.totalSellers / (stats.totalUsers || 1)) * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">نسبة البائعين</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">98.5%</div>
              <p className="text-sm text-muted-foreground">وقت التشغيل</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
