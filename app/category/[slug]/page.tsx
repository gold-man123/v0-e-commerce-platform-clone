import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Filter, Grid, List } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // Mock category data - in real app, this would fetch from API
  const categories = {
    electronics: {
      name: "إلكترونيات",
      name_en: "Electronics",
      description: "أحدث الأجهزة الإلكترونية والتقنية",
    },
    fashion: {
      name: "أزياء",
      name_en: "Fashion",
      description: "ملابس وإكسسوارات عصرية",
    },
    home: {
      name: "منزل وحديقة",
      name_en: "Home & Garden",
      description: "كل ما تحتاجه للمنزل والحديقة",
    },
  }

  const category = categories[params.slug as keyof typeof categories]
  if (!category) {
    notFound()
  }

  // Mock products for this category
  const products = [
    {
      id: 1,
      name: "هاتف ذكي سامسونج جالاكسي",
      name_en: "Samsung Galaxy Smartphone",
      price: 35000,
      originalPrice: 40000,
      image: "/samsung-galaxy-smartphone.png",
      rating: 4.6,
      reviews: 189,
      store: "متجر التقنية الحديثة",
    },
    {
      id: 2,
      name: "لابتوب HP بافيليون",
      name_en: "HP Pavilion Laptop",
      price: 55000,
      originalPrice: null,
      image: "/hp-pavilion-laptop.jpg",
      rating: 4.4,
      reviews: 156,
      store: "متجر الكمبيوتر",
    },
    {
      id: 3,
      name: "سماعات بلوتوث لاسلكية",
      name_en: "Wireless Bluetooth Headphones",
      price: 8000,
      originalPrice: 12000,
      image: "/wireless-bluetooth-headphones.jpg",
      rating: 4.2,
      reviews: 234,
      store: "متجر الصوتيات",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          <p className="text-muted-foreground">{category.description}</p>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-64 space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  تصفية المنتجات
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">السعر</h4>
                    <div className="space-y-1">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">أقل من 10,000</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">10,000 - 30,000</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">30,000 - 50,000</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">أكثر من 50,000</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">التقييم</h4>
                    <div className="space-y-1">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          4+ نجوم
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          3+ نجوم
                        </span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">العلامة التجارية</h4>
                    <div className="space-y-1">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">سامسونج</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">آبل</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">HP</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Sort and View Options */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">عرض {products.length} منتج</p>
              <div className="flex items-center gap-4">
                <select className="border rounded-md px-3 py-1">
                  <option>ترتيب حسب: الأحدث</option>
                  <option>السعر: من الأقل للأعلى</option>
                  <option>السعر: من الأعلى للأقل</option>
                  <option>الأعلى تقييماً</option>
                </select>
                <div className="flex border rounded-md">
                  <Button variant="ghost" size="sm">
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
