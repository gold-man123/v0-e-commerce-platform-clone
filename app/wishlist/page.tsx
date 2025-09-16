import { AuthGuard } from "@/components/auth/auth-guard"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Trash2, ShoppingCart } from "lucide-react"
import Image from "next/image"

export default function WishlistPage() {
  // Mock wishlist data - in real app, this would fetch from API
  const wishlistItems = [
    {
      id: 1,
      name: "هاتف ذكي آيفون",
      name_en: "iPhone Smartphone",
      price: 85000,
      originalPrice: 95000,
      image: "/modern-smartphone.png",
      rating: 4.8,
      reviews: 256,
      store: "متجر التقنية المتقدمة",
      inStock: true,
    },
    {
      id: 2,
      name: "ساعة ذكية",
      name_en: "Smart Watch",
      price: 15000,
      originalPrice: null,
      image: "/smartwatch-lifestyle.png",
      rating: 4.3,
      reviews: 89,
      store: "متجر الإكسسوارات",
      inStock: false,
    },
  ]

  return (
    <AuthGuard allowedRoles={["customer"]}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">قائمة المفضلة</h1>

            {wishlistItems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">قائمة المفضلة فارغة</p>
                  <Button asChild>
                    <a href="/">تصفح المنتجات</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      {item.originalPrice && (
                        <Badge className="absolute top-2 right-2 rtl:right-auto rtl:left-2">
                          خصم {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                        </Badge>
                      )}
                      {!item.inStock && (
                        <Badge variant="destructive" className="absolute top-2 left-2 rtl:left-auto rtl:right-2">
                          نفد المخزون
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{item.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(item.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">({item.reviews})</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-primary">{item.price.toLocaleString()} أوقية</span>
                        {item.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{item.store}</p>
                      <div className="flex gap-2">
                        <Button className="flex-1" disabled={!item.inStock}>
                          <ShoppingCart className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1" />
                          {item.inStock ? "أضف للسلة" : "نفد المخزون"}
                        </Button>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  )
}
