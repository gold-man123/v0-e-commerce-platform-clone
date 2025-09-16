"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface CartItem {
  id: string
  product_id: string
  quantity: number
  products: {
    id: string
    name_ar: string
    name_en: string
    price: number
    image_url: string
    stock_quantity: number
    stores: {
      name_ar: string
      name_en: string
    }
  }
}

export function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
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
            name_en,
            price,
            image_url,
            stock_quantity,
            stores (
              name_ar,
              name_en
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

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setIsUpdating(true)
    try {
      const { error } = await supabase.from("cart_items").update({ quantity: newQuantity }).eq("id", itemId)

      if (error) throw error

      setCartItems((items) => items.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    } catch (error) {
      console.error("Error updating quantity:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const removeItem = async (itemId: string) => {
    setIsUpdating(true)
    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

      if (error) throw error

      setCartItems((items) => items.filter((item) => item.id !== itemId))
    } catch (error) {
      console.error("Error removing item:", error)
    } finally {
      setIsUpdating(false)
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
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">سلة التسوق فارغة</h3>
            <p className="text-muted-foreground mb-4">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد</p>
            <Button onClick={() => router.push("/")}>تصفح المنتجات</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            سلة التسوق ({cartItems.length} منتج)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={item.products.image_url || "/placeholder.svg?height=64&width=64"}
                    alt={item.products.name_ar}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.products.name_ar}</h4>
                  <p className="text-xs text-muted-foreground">{item.products.stores.name_ar}</p>
                  <p className="text-sm font-bold text-primary">{formatPrice(item.products.price)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={isUpdating || item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={isUpdating || item.quantity >= item.products.stock_quantity}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => removeItem(item.id)}
                  disabled={isUpdating}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>ملخص الطلب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>المجموع الفرعي</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>
            <div className="flex justify-between">
              <span>رسوم التوصيل</span>
              <span>مجاني</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>المجموع الكلي</span>
              <span className="text-primary">{formatPrice(calculateTotal())}</span>
            </div>
          </div>

          <Button
            className="w-full mt-6"
            size="lg"
            onClick={() => router.push("/checkout")}
            disabled={cartItems.length === 0}
          >
            متابعة إلى الدفع
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
