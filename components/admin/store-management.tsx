"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Store } from "@/lib/types"
import { Search, MoreHorizontal, CheckCircle, XCircle, Eye, StoreIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export function StoreManagement() {
  const [stores, setStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [verificationFilter, setVerificationFilter] = useState<string>("all")
  const supabase = createClient()

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data } = await supabase.from("stores").select("*").order("created_at", { ascending: false })

        if (data) setStores(data)
      } catch (error) {
        console.error("Error fetching stores:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStores()
  }, [supabase])

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.name_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.email?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? store.is_active : !store.is_active)
    const matchesVerification =
      verificationFilter === "all" || (verificationFilter === "verified" ? store.is_verified : !store.is_verified)

    return matchesSearch && matchesStatus && matchesVerification
  })

  const toggleStoreStatus = async (storeId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("stores").update({ is_active: !currentStatus }).eq("id", storeId)

      if (error) throw error

      setStores((prev) => prev.map((store) => (store.id === storeId ? { ...store, is_active: !currentStatus } : store)))
    } catch (error) {
      console.error("Error updating store status:", error)
    }
  }

  const toggleStoreVerification = async (storeId: string, currentVerification: boolean) => {
    try {
      const { error } = await supabase.from("stores").update({ is_verified: !currentVerification }).eq("id", storeId)

      if (error) throw error

      setStores((prev) =>
        prev.map((store) => (store.id === storeId ? { ...store, is_verified: !currentVerification } : store)),
      )
    } catch (error) {
      console.error("Error updating store verification:", error)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة المتاجر</h2>
          <p className="text-muted-foreground">إدارة ومراجعة متاجر المنصة</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المتاجر..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rtl:pl-4 rtl:pr-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
              </SelectContent>
            </Select>
            <Select value={verificationFilter} onValueChange={setVerificationFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="التوثيق" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المتاجر</SelectItem>
                <SelectItem value="verified">موثق</SelectItem>
                <SelectItem value="unverified">غير موثق</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Stores Table */}
      <Card>
        <CardHeader>
          <CardTitle>المتاجر ({filteredStores.length})</CardTitle>
          <CardDescription>قائمة بجميع متاجر المنصة</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStores.length === 0 ? (
            <div className="text-center py-12">
              <StoreIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد نتائج</h3>
              <p className="text-muted-foreground">جرب تغيير معايير البحث</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المتجر</TableHead>
                  <TableHead>المدينة</TableHead>
                  <TableHead>التقييم</TableHead>
                  <TableHead>التوثيق</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted">
                          <Image
                            src={
                              store.logo_url ||
                              `/placeholder.svg?height=40&width=40&query=${store.name_en || "/placeholder.svg"} store logo`
                            }
                            alt={store.name_ar}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{store.name_ar}</p>
                          <p className="text-sm text-muted-foreground">{store.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{store.city}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{store.rating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">({store.total_reviews})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={store.is_verified ? "default" : "secondary"}>
                        {store.is_verified ? "موثق" : "غير موثق"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={store.is_active ? "default" : "secondary"}>
                        {store.is_active ? "نشط" : "غير نشط"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(store.created_at).toLocaleDateString("ar-MR")}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/store/${store.slug}`}>
                              <Eye className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                              عرض المتجر
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStoreVerification(store.id, store.is_verified)}>
                            {store.is_verified ? (
                              <>
                                <XCircle className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                                إلغاء التوثيق
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                                توثيق المتجر
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStoreStatus(store.id, store.is_active)}>
                            {store.is_active ? (
                              <>
                                <XCircle className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                                إلغاء التفعيل
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                                تفعيل المتجر
                              </>
                            )}
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
