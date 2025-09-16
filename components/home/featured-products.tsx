"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import { Heart, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data } = await supabase
          .from("products")
          .select(
            `
            *,
            store:stores(name_ar, name_en, is_verified),
            category:categories(name_ar, name_en)
          `,
          )
          .eq("is_featured", true)
          .eq("is_active", true)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(8)

        if (data) setProducts(data)
      } catch (error) {
        console.error("Error fetching featured products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [supabase])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-MR", {
      style: "currency",
      currency: "MRU",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-muted" />
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-6 bg-muted rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">المنتجات المميزة</h2>
          <Button variant="outline" asChild>
            <Link href="/products">عرض الكل</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={
                    product.images[0] ||
                    `/placeholder.svg?height=300&width=300&query=${product.name_en || "/placeholder.svg"} product image`
                  }
                  alt={product.name_ar}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                {product.compare_price && product.compare_price > product.price && (
                  <Badge className="absolute top-2 right-2 rtl:right-auto rtl:left-2 bg-destructive">
                    خصم {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
                  </Badge>
                )}
                <div className="absolute top-2 left-2 rtl:left-auto rtl:right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{product.category?.name_ar}</span>
                    {product.store?.is_verified && (
                      <Badge variant="secondary" className="text-xs">
                        متجر موثق
                      </Badge>
                    )}
                  </div>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors text-balance">
                      {product.name_ar}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">{product.store?.name_ar}</p>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">(4.5)</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <div className="flex items-center justify-between w-full">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                      {product.compare_price && product.compare_price > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.compare_price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button size="sm" className="gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    أضف للسلة
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
