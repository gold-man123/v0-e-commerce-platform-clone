"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Category } from "@/lib/types"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Tags } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    description_ar: "",
    description_en: "",
    parent_id: "",
  })
  const supabase = createClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data } = await supabase.from("categories").select("*").order("sort_order")

      if (data) setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.name_en?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const slug = generateSlug(formData.name_en || formData.name_ar)
      const categoryData = {
        ...formData,
        slug,
        parent_id: formData.parent_id || null,
      }

      if (editingCategory) {
        const { error } = await supabase.from("categories").update(categoryData).eq("id", editingCategory.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("categories").insert(categoryData)
        if (error) throw error
      }

      await fetchCategories()
      setIsDialogOpen(false)
      setEditingCategory(null)
      setFormData({ name_ar: "", name_en: "", description_ar: "", description_en: "", parent_id: "" })
    } catch (error) {
      console.error("Error saving category:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name_ar: category.name_ar,
      name_en: category.name_en || "",
      description_ar: category.description_ar || "",
      description_en: category.description_en || "",
      parent_id: category.parent_id || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفئة؟")) return

    try {
      const { error } = await supabase.from("categories").delete().eq("id", categoryId)
      if (error) throw error
      await fetchCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  const toggleCategoryStatus = async (categoryId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("categories").update({ is_active: !currentStatus }).eq("id", categoryId)

      if (error) throw error
      await fetchCategories()
    } catch (error) {
      console.error("Error updating category status:", error)
    }
  }

  const parentCategories = categories.filter((cat) => !cat.parent_id)

  if (isLoading && categories.length === 0) {
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
          <h2 className="text-2xl font-bold">إدارة الفئات</h2>
          <p className="text-muted-foreground">إدارة فئات المنتجات</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
              إضافة فئة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "تعديل الفئة" : "إضافة فئة جديدة"}</DialogTitle>
              <DialogDescription>أدخل معلومات الفئة</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name_ar">الاسم (عربي) *</Label>
                  <Input
                    id="name_ar"
                    required
                    value={formData.name_ar}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name_ar: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_en">الاسم (إنجليزي)</Label>
                  <Input
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name_en: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description_ar">الوصف (عربي)</Label>
                  <Textarea
                    id="description_ar"
                    rows={2}
                    value={formData.description_ar}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description_ar: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_en">الوصف (إنجليزي)</Label>
                  <Textarea
                    id="description_en"
                    rows={2}
                    value={formData.description_en}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description_en: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent_id">الفئة الأب (اختياري)</Label>
                <select
                  id="parent_id"
                  value={formData.parent_id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, parent_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-input rounded-md"
                >
                  <option value="">فئة رئيسية</option>
                  {parentCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name_ar}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit">{editingCategory ? "تحديث" : "إضافة"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في الفئات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rtl:pl-4 rtl:pr-10"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>الفئات ({filteredCategories.length})</CardTitle>
          <CardDescription>قائمة بجميع فئات المنتجات</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <Tags className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد فئات</h3>
              <p className="text-muted-foreground">ابدأ بإضافة فئة جديدة</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الفئة</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="relative h-8 w-8 rounded-md overflow-hidden bg-muted">
                          <Image
                            src={
                              category.image_url ||
                              `/placeholder.svg?height=32&width=32&query=${category.name_en || "/placeholder.svg"} category icon`
                            }
                            alt={category.name_ar}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{category.name_ar}</p>
                          {category.name_en && <p className="text-sm text-muted-foreground">{category.name_en}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.parent_id ? "secondary" : "default"}>
                        {category.parent_id ? "فئة فرعية" : "فئة رئيسية"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.is_active ? "default" : "secondary"}>
                        {category.is_active ? "نشط" : "غير نشط"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(category.created_at).toLocaleDateString("ar-MR")}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(category)}>
                            <Edit className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleCategoryStatus(category.id, category.is_active)}>
                            {category.is_active ? "إلغاء التفعيل" : "تفعيل"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(category.id)} className="text-destructive">
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
