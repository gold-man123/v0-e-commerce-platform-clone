"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Product } from "@/lib/types"
import { Plus, Search, MoreHorizontal, Edit, Eye, Trash2, Package } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

interface ProductManagementProps {
  storeId: string
}

export function ProductManagement({ storeId }: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await supabase
          .from("products")
          .select(
            `
            *,
            category:categories(name_ar, name_en)
          `,
          )
          .eq("store_id", storeId)
          .order("created_at", { ascending: false })

        if (data) setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [supabase, storeId])

  const filteredProducts = products.filter(
    (product) =>
      product.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-MR", {
      style: "currency",
      currency: "MRU",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: "نشط", variant: "default" as const },
      draft: { label: "مسودة", variant: "secondary" as const },
      inactive: { label: "غير نشط", variant: "outline" as const },
      out_of_stock: { label: "نفد المخزون", variant: "destructive" as const },
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
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
          <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
          <p className="text-muted-foreground">إدارة منتجات متجرك</p>
        </div>
        <Button asChild>
          <Link href="/seller/products/new">
            <Plus className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
            إضافة منتج جديد
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="relative flex-1">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المنتجات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rtl:pl-4 rtl:pr-10"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>المنتجات ({filteredProducts.length})</CardTitle>
          <CardDescription>قائمة بجميع منتجات متجرك</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد منتجات</h3>
              <p className="text-muted-foreground mb-4">ابدأ بإضافة منتجك الأول</p>
              <Button asChild>
                <Link href="/seller/products/new">إضافة منتج جديد</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>السعر</TableHead>
                  <TableHead>المخزون</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted">
                          <Image
                            src={
                              product.images[0] ||
                              `/placeholder.svg?height=40&width=40&query=${product.name_en || "/placeholder.svg"} product`
                            }
                            alt={product.name_ar}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">{product.name_ar}</p>
                          <p className="text-sm text-muted-foreground">{product.sku}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category?.name_ar}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      <span
                        className={
                          product.stock_quantity <= product.min_stock_level ? "text-destructive font-medium" : ""
                        }
                      >
                        {product.stock_quantity}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>{new Date(product.created_at).toLocaleDateString("ar-MR")}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/product/${product.slug}`}>
                              <Eye className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                              عرض
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/seller/products/${product.id}/edit`}>
                              <Edit className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                              تعديل
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
