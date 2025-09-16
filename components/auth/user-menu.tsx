"use client"

import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, ShoppingBag, Heart, LogOut, Store, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function UserMenu() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
          setProfile(profile)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
      } else if (session?.user) {
        setUser(session.user)
        getUser()
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (isLoading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
  }

  if (!user || !profile) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" asChild>
          <Link href="/auth/login">تسجيل الدخول</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/sign-up">إنشاء حساب</Link>
        </Button>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
            <AvatarFallback>{getInitials(profile.full_name || profile.email)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile.full_name || "مستخدم"}</p>
            <p className="text-xs leading-none text-muted-foreground">{profile.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile.role === "admin" ? "مدير" : profile.role === "seller" ? "بائع" : "عميل"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>الملف الشخصي</span>
          </Link>
        </DropdownMenuItem>

        {profile.role === "customer" && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/orders" className="flex items-center">
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>طلباتي</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/wishlist" className="flex items-center">
                <Heart className="mr-2 h-4 w-4" />
                <span>المفضلة</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {profile.role === "seller" && (
          <DropdownMenuItem asChild>
            <Link href="/seller" className="flex items-center">
              <Store className="mr-2 h-4 w-4" />
              <span>لوحة البائع</span>
            </Link>
          </DropdownMenuItem>
        )}

        {profile.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              <span>لوحة الإدارة</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>الإعدادات</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>تسجيل الخروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
