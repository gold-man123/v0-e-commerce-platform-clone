"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"

interface Order {
  id: string
  total_amount: number
  status: string
  payment_status: string
  payment_method: string
  created_at: string
  stores: {
    name_ar: string
    name_en: string
  }
  order_items: {
    quantity: number
    price: number
    products: {
      name_ar: string
      name_en: string
      image_url: string
    }
  }[]
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: orders, error } = await supabase
        .from("orders")
        .select(`
          *,
          stores (
            name_ar,
            name_en
          ),
          order_items (
            quantity,
            price,
            products (
              name_ar,
              name_en,
              image_url
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setOrders(orders || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "في الانتظار"
      case "processing":
        return "قيد المعالجة"
      case "shipped":
        return "تم الشحن"
      case "delivered":
        return "تم التسليم"
      case "cancelled":
        return "ملغي"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cash_on_delivery":
        return "الدفع عند الاستلام"
      case "bank_transfer":
        return "تحويل بنكي"
      case "mobile_money":
        return "محفظة إلكترونية"
      default:
        return method
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-MR", {
      style: "currency",
      currency: "MRU",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-MR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد طلبات</h3>
            <p className="text-muted-foreground mb-4">لم تقم بأي طلبات بعد</p>
            <Button onClick={() => (window.location.href = "/")}>ابدأ التسوق</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">طلب #{order.id.slice(-8)}</CardTitle>
              <Badge className={getStatusColor(order.status)}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(order.status)}
                  {getStatusText(order.status)}
                </div>
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{formatDate(order.created_at)}</span>
              <span>{order.stores.name_ar}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Order Items */}
              <div className="space-y-2">
                {order.order_items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 border rounded">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={item.products.image_url || "/placeholder.svg?height=48&width=48"}
                        alt={item.products.name_ar}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.products.name_ar}</p>
                      <p className="text-xs text-muted-foreground">الكمية: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-sm text-muted-foreground">
                  <p>طريقة الدفع: {getPaymentMethodText(order.payment_method)}</p>
                  <p>حالة الدفع: {order.payment_status === "paid" ? "مدفوع" : "غير مدفوع"}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{formatPrice(order.total_amount)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
