"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Order, OrderItem } from "@/lib/types"
import { Package, Eye, Truck } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface OrderManagementProps {
  storeId: string
}

interface OrderWithItems extends Order {
  items: OrderItem[]
}

export function OrderManagement({ storeId }: OrderManagementProps) {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const supabase = createClient()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // First get order items for this store
        const { data: orderItems } = await supabase
          .from("order_items")
          .select(
            `
            *,
            orders!inner(*)
          `,
          )
          .eq("store_id", storeId)
          .order("created_at", { ascending: false })

        if (orderItems) {
          // Group order items by order
          const ordersMap = new Map<string, OrderWithItems>()

          orderItems.forEach((item) => {
            const order = item.orders
            if (!ordersMap.has(order.id)) {
              ordersMap.set(order.id, {
                ...order,
                items: [],
              })
            }
            ordersMap.get(order.id)!.items.push(item)
          })

          setOrders(Array.from(ordersMap.values()))
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [supabase, storeId])

  const filteredOrders = orders.filter((order) => statusFilter === "all" || order.status === statusFilter)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-MR", {
      style: "currency",
      currency: "MRU",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "في الانتظار", variant: "secondary" as const },
      confirmed: { label: "مؤكد", variant: "default" as const },
      processing: { label: "قيد التحضير", variant: "default" as const },
      shipped: { label: "تم الشحن", variant: "default" as const },
      delivered: { label: "تم التسليم", variant: "default" as const },
      cancelled: { label: "ملغي", variant: "destructive" as const },
      refunded: { label: "مسترد", variant: "outline" as const },
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId)

      if (error) throw error

      // Update local state
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus as any } : order)))
    } catch (error) {
      console.error("Error updating order status:", error)
    }
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
          <h2 className="text-2xl font-bold">إدارة الطلبات</h2>
          <p className="text-muted-foreground">تتبع وإدارة طلبات متجرك</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الطلبات</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="confirmed">مؤكد</SelectItem>
                <SelectItem value="processing">قيد التحضير</SelectItem>
                <SelectItem value="shipped">تم الشحن</SelectItem>
                <SelectItem value="delivered">تم التسليم</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>الطلبات ({filteredOrders.length})</CardTitle>
          <CardDescription>قائمة بطلبات متجرك</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد طلبات</h3>
              <p className="text-muted-foreground">ستظهر الطلبات هنا عندما يطلب العملاء منتجاتك</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>المنتجات</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الطلب</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const storeTotal = order.items.reduce((sum, item) => sum + item.total_price, 0)
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.order_number}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.shipping_name}</p>
                          <p className="text-sm text-muted-foreground">{order.shipping_phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div key={item.id} className="text-sm">
                              {item.product_name_ar} × {item.quantity}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{formatPrice(storeTotal)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString("ar-MR")}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/seller/orders/${order.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {order.status === "confirmed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, "processing")}
                            >
                              <Truck className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
