"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Filter } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Image from "next/image"

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  // Mock search results - in real app, this would fetch from API
  const mockResults = [
    {
      id: 1,
      name: "هاتف ذكي سامسونج",
      name_en: "Samsung Smartphone",
      price: 25000,
      originalPrice: 30000,
      image: "/samsung-smartphone-display.png",
      rating: 4.5,
      reviews: 128,
      store: "متجر التقنية",
    },
    {
      id: 2,
      name: "لابتوب ديل",
      name_en: "Dell Laptop",
      price: 45000,
      originalPrice: null,
      image: "/dell-laptop.png",
      rating: 4.2,
      reviews: 89,
      store: "متجر الكمبيوتر",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">نتائج البحث عن: "{query}"</h1>
          <p className="text-muted-foreground">تم العثور على {mockResults.length} منتج</p>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-64 space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  تصفية النتائج
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">الفئة</h4>
                    <div className="space-y-1">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">إلكترونيات</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">أزياء</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">السعر</h4>
                    <div className="space-y-1">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">أقل من 10,000</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">10,000 - 50,000</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockResults.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                    {product.originalPrice && (
                      <Badge className="absolute top-2 right-2 rtl:right-auto rtl:left-2">
                        خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-primary">{product.price.toLocaleString()} أوقية</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{product.store}</p>
                    <Button className="w-full">أضف للسلة</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <SearchResults />
    </Suspense>
  )
}
