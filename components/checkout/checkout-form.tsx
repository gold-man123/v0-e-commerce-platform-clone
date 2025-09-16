"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Smartphone, Building2, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface CartItem {
  id: string
  product_id: string
  quantity: number
  products: {
    id: string
    name_ar: string
    price: number
    image_url: string
    store_id: string
    stores: {
      name_ar: string
    }
  }
}

export function CheckoutForm() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery")
  const [shippingInfo, setShippingInfo] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "نواكشوط",
    notes: "",
  })
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: cartItems, error } = await supabase
        .from("cart_items")
        .select(`
          *,
          products (
            id,
            name_ar,
            price,
            image_url,
            store_id,
            stores (
              name_ar
            )
          )
        `)
        .eq("user_id", user.id)

      if (error) throw error
      setCartItems(cartItems || [])
    } catch (error) {
      console.error("Error fetching cart items:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.products.price * item.quantity, 0)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-MR", {
      style: "currency",
      currency: "MRU",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      // Group items by store
      const itemsByStore = cartItems.reduce(
        (acc, item) => {
          const storeId = item.products.store_id
          if (!acc[storeId]) {
            acc[storeId] = []
          }
          acc[storeId].push(item)
          return acc
        },
        {} as Record<string, CartItem[]>,
      )

      // Create separate orders for each store
      const orderPromises = Object.entries(itemsByStore).map(async ([storeId, items]) => {
        const storeTotal = items.reduce((total, item) => total + item.products.price * item.quantity, 0)

        // Create order
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: user.id,
            store_id: storeId,
            total_amount: storeTotal,
            status: "pending",
            payment_method: paymentMethod,
            payment_status: paymentMethod === "cash_on_delivery" ? "pending" : "paid",
            shipping_address: `${shippingInfo.full_name}\n${shippingInfo.phone}\n${shippingInfo.address}\n${shippingInfo.city}`,
            notes: shippingInfo.notes,
          })
          .select()
          .single()

        if (orderError) throw orderError

        // Create order items
        const orderItems = items.map((item) => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.products.price,
        }))

        const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

        if (itemsError) throw itemsError

        return order
      })

      await Promise.all(orderPromises)

      // Clear cart
      const { error: clearCartError } = await supabase.from("cart_items").delete().eq("user_id", user.id)

      if (clearCartError) throw clearCartError

      // Redirect to success page
      router.push("/checkout/success")
    } catch (error) {
      console.error("Error processing order:", error)
      alert("حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsProcessing(false)
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

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">سلة التسوق فارغة</h3>
            <p className="text-muted-foreground mb-4">لا يمكنك المتابعة إلى الدفع بسلة تسوق فارغة</p>
            <Button onClick={() => router.push("/")}>تصفح المنتجات</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              معلومات التوصيل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="full_name">الاسم الكامل *</Label>
              <Input
                id="full_name"
                value={shippingInfo.full_name}
                onChange={(e) => setShippingInfo((prev) => ({ ...prev, full_name: e.target.value }))}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">رقم الهاتف *</Label>
              <Input
                id="phone"
                type="tel"
                value={shippingInfo.phone}
                onChange={(e) => setShippingInfo((prev) => ({ ...prev, phone: e.target.value }))}
                required
                className="mt-1"
                placeholder="22 XX XX XX"
              />
            </div>

            <div>
              <Label htmlFor="city">المدينة *</Label>
              <Select
                value={shippingInfo.city}
                onValueChange={(value) => setShippingInfo((prev) => ({ ...prev, city: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نواكشوط">نواكشوط</SelectItem>
                  <SelectItem value="نواذيبو">نواذيبو</SelectItem>
                  <SelectItem value="روصو">روصو</SelectItem>
                  <SelectItem value="كيفة">كيفة</SelectItem>
                  <SelectItem value="العيون">العيون</SelectItem>
                  <SelectItem value="أطار">أطار</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="address">العنوان التفصيلي *</Label>
              <Textarea
                id="address"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo((prev) => ({ ...prev, address: e.target.value }))}
                required
                className="mt-1"
                placeholder="الحي، الشارع، رقم المنزل..."
              />
            </div>

            <div>
              <Label htmlFor="notes">ملاحظات إضافية</Label>
              <Textarea
                id="notes"
                value={shippingInfo.notes}
                onChange={(e) => setShippingInfo((prev) => ({ ...prev, notes: e.target.value }))}
                className="mt-1"
                placeholder="أي تعليمات خاصة للتوصيل..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              طريقة الدفع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 rtl:space-x-reverse p-4 border rounded-lg">
                <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                <Label htmlFor="cash_on_delivery" className="flex items-center gap-2 cursor-pointer">
                  <Building2 className="h-4 w-4" />
                  الدفع عند الاستلام
                </Label>
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse p-4 border rounded-lg">
                <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                <Label htmlFor="bank_transfer" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="h-4 w-4" />
                  تحويل بنكي
                </Label>
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse p-4 border rounded-lg">
                <RadioGroupItem value="mobile_money" id="mobile_money" />
                <Label htmlFor="mobile_money" className="flex items-center gap-2 cursor-pointer">
                  <Smartphone className="h-4 w-4" />
                  المحفظة الإلكترونية (Masrvi, Amanty)
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "bank_transfer" && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">معلومات التحويل البنكي</h4>
                <p className="text-sm text-muted-foreground">
                  البنك: البنك الوطني الموريتاني
                  <br />
                  رقم الحساب: 123456789
                  <br />
                  اسم الحساب: واد للتجارة الإلكترونية
                </p>
              </div>
            )}

            {paymentMethod === "mobile_money" && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">معلومات المحفظة الإلكترونية</h4>
                <p className="text-sm text-muted-foreground">
                  Masrvi: 22 XX XX XX
                  <br />
                  Amanty: 22 XX XX XX
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>ملخص الطلب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.products.name_ar}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.products.stores.name_ar} × {item.quantity}
                  </p>
                </div>
                <p className="font-medium">{formatPrice(item.products.price * item.quantity)}</p>
              </div>
            ))}

            <Separator />

            <div className="flex justify-between items-center">
              <span>المجموع الفرعي</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>رسوم التوصيل</span>
              <span>مجاني</span>
            </div>

            <Separator />

            <div className="flex justify-between items-center font-bold text-lg">
              <span>المجموع الكلي</span>
              <span className="text-primary">{formatPrice(calculateTotal())}</span>
            </div>
          </div>

          <Button type="submit" className="w-full mt-6" size="lg" disabled={isProcessing}>
            {isProcessing ? "جاري معالجة الطلب..." : "تأكيد الطلب"}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
