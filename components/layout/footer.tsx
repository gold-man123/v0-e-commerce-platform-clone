import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                و
              </div>
              <span className="text-xl font-bold text-primary">وادي</span>
            </div>
            <p className="text-sm text-muted-foreground">
              منصة التجارة الإلكترونية الرائدة في موريتانيا. نربط البائعين بالعملاء لتوفير أفضل تجربة تسوق.
            </p>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Button variant="outline" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground">
                  كيف يعمل الموقع
                </Link>
              </li>
              <li>
                <Link href="/seller" className="text-muted-foreground hover:text-foreground">
                  كن بائعاً
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                  الوظائف
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                  المدونة
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">خدمة العملاء</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground">
                  مركز المساعدة
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-foreground">
                  الشحن والتوصيل
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-foreground">
                  الإرجاع والاستبدال
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-muted-foreground hover:text-foreground">
                  الضمان
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">تواصل معنا</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+222 XX XX XX XX</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@wadi.mr</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>نواكشوط، موريتانيا</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">اشترك في النشرة الإخبارية</h4>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Input placeholder="بريدك الإلكتروني" className="flex-1" />
                <Button>اشترك</Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-4 rtl:space-x-reverse text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              شروط الاستخدام
            </Link>
            <Link href="/cookies" className="hover:text-foreground">
              سياسة الكوكيز
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 وادي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}
