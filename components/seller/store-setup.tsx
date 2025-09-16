"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Store } from "@/lib/types"
import { StoreIcon } from "lucide-react"
import { useState } from "react"

interface StoreSetupProps {
  onStoreCreated: (store: Store) => void
}

export function StoreSetup({ onStoreCreated }: StoreSetupProps) {
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    description_ar: "",
    description_en: "",
    phone: "",
    email: "",
    address_ar: "",
    address_en: "",
    city: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

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
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const slug = generateSlug(formData.name_en || formData.name_ar)

      const { data, error } = await supabase
        .from("stores")
        .insert({
          seller_id: user.id,
          ...formData,
          slug,
          country: "Mauritania",
        })
        .select()
        .single()

      if (error) throw error

      onStoreCreated(data)
    } catch (error: any) {
      setError(error.message || "حدث خطأ أثناء إنشاء المتجر")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <StoreIcon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">إعداد متجرك</CardTitle>
          <CardDescription>أكمل المعلومات التالية لإنشاء متجرك على منصة وادي</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name_ar">اسم المتجر (عربي) *</Label>
                <Input
                  id="name_ar"
                  required
                  value={formData.name_ar}
                  onChange={(e) => handleChange("name_ar", e.target.value)}
                  placeholder="متجر الإلكترونيات"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_en">اسم المتجر (إنجليزي)</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => handleChange("name_en", e.target.value)}
                  placeholder="Electronics Store"
                />
              </div>
            </div>

            {/* Store Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description_ar">وصف المتجر (عربي)</Label>
                <Textarea
                  id="description_ar"
                  rows={3}
                  value={formData.description_ar}
                  onChange={(e) => handleChange("description_ar", e.target.value)}
                  placeholder="وصف مختصر عن متجرك ومنتجاتك..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_en">وصف المتجر (إنجليزي)</Label>
                <Textarea
                  id="description_en"
                  rows={3}
                  value={formData.description_en}
                  onChange={(e) => handleChange("description_en", e.target.value)}
                  placeholder="Brief description of your store and products..."
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+222 XX XX XX XX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="store@example.com"
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address_ar">العنوان (عربي)</Label>
                  <Input
                    id="address_ar"
                    value={formData.address_ar}
                    onChange={(e) => handleChange("address_ar", e.target.value)}
                    placeholder="شارع الاستقلال، حي النصر"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_en">العنوان (إنجليزي)</Label>
                  <Input
                    id="address_en"
                    value={formData.address_en}
                    onChange={(e) => handleChange("address_en", e.target.value)}
                    placeholder="Independence Street, Nasr District"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">المدينة *</Label>
                <Select value={formData.city} onValueChange={(value) => handleChange("city", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nouakchott">نواكشوط</SelectItem>
                    <SelectItem value="nouadhibou">نواذيبو</SelectItem>
                    <SelectItem value="rosso">روصو</SelectItem>
                    <SelectItem value="kaedi">كيهيدي</SelectItem>
                    <SelectItem value="zouerate">الزويرات</SelectItem>
                    <SelectItem value="atar">أطار</SelectItem>
                    <SelectItem value="kiffa">كيفة</SelectItem>
                    <SelectItem value="nema">النعمة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "جاري إنشاء المتجر..." : "إنشاء المتجر"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
