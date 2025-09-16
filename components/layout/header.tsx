"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserMenu } from "@/components/auth/user-menu"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Search, ShoppingCart, Heart, Menu } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { Category } from "@/lib/types"

export function Header() {
  const [categories, setCategories] = useState<Category[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .is("parent_id", null)
        .eq("is_active", true)
        .order("sort_order")
        .limit(8)

      if (data) setCategories(data)
    }

    fetchCategories()
  }, [supabase])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">مرحباً بكم في وادي</span>
              <Link href="/seller" className="text-primary hover:underline">
                كن بائعاً معنا
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/help" className="text-muted-foreground hover:text-foreground">
                المساعدة
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                اتصل بنا
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              و
            </div>
            <span className="text-xl font-bold text-primary">وادي</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <Input
                type="search"
                placeholder="ابحث عن المنتجات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rtl:pl-4 rtl:pr-10"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute left-1 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-1 h-7 w-7 p-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/wishlist" className="relative">
                <Heart className="h-5 w-5" />
                <span className="sr-only">المفضلة</span>
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 rtl:-left-2 rtl:right-auto h-5 w-5 rounded-full p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
                <span className="sr-only">سلة التسوق</span>
              </Link>
            </Button>

            <UserMenu />
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <NavigationMenu>
            <NavigationMenuList className="flex-wrap gap-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9">
                  <Menu className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1" />
                  جميع الفئات
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {categories.map((category) => (
                      <NavigationMenuLink key={category.id} asChild>
                        <Link
                          href={`/category/${category.slug}`}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{category.name_ar}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {category.description_ar}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {categories.slice(0, 6).map((category) => (
                <NavigationMenuItem key={category.id}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={`/category/${category.slug}`}
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    >
                      {category.name_ar}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      </div>
    </header>
  )
}
