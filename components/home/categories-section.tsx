"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import type { Category } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await supabase
          .from("categories")
          .select("*")
          .is("parent_id", null)
          .eq("is_active", true)
          .order("sort_order")
          .limit(8)

        if (data) setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [supabase])

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 text-center">
                  <div className="h-16 w-16 mx-auto mb-3 bg-muted rounded-full" />
                  <div className="h-4 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">تسوق حسب الفئة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-4 text-center">
                  <div className="h-16 w-16 mx-auto mb-3 relative overflow-hidden rounded-full bg-muted group-hover:scale-110 transition-transform">
                    <Image
                      src={
                        category.image_url ||
                        `/placeholder.svg?height=64&width=64&query=${category.name_en || "/placeholder.svg"} category icon`
                      }
                      alt={category.name_ar}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-balance">{category.name_ar}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
