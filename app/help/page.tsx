import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, HelpCircle, ShoppingCart, Truck, CreditCard, RotateCcw } from "lucide-react"

export default function HelpPage() {
  const categories = [
    {
      icon: ShoppingCart,
      title: "الطلبات والشراء",
      description: "كيفية إجراء الطلبات وإدارتها",
      articles: 12,
    },
    {
      icon: Truck,
      title: "الشحن والتوصيل",
      description: "معلومات حول الشحن وأوقات التوصيل",
      articles: 8,
    },
    {
      icon: CreditCard,
      title: "الدفع والفواتير",
      description: "طرق الدفع والمشاكل المالية",
      articles: 6,
    },
    {
      icon: RotateCcw,
      title: "الإرجاع والاستبدال",
      description: "سياسات الإرجاع وكيفية الاستبدال",
      articles: 5,
    },
  ]

  const popularArticles = [
    "كيفية إنشاء حساب جديد",
    "طرق الدفع المتاحة",
    "كيفية تتبع الطلب",
    "سياسة الإرجاع والاستبدال",
    "كيفية التواصل مع البائع",
    "حل مشاكل تسجيل الدخول",
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">مركز المساعدة</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              ابحث عن إجابات لأسئلتك أو تصفح المقالات المفيدة
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="ابحث في مركز المساعدة..."
                  className="pl-12 rtl:pl-4 rtl:pr-12 h-12 text-lg"
                />
                <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">تصفح حسب الفئة</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-4">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    <Badge variant="secondary">{category.articles} مقال</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">المقالات الأكثر شيوعاً</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {popularArticles.map((article, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="font-medium">{article}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">لم تجد ما تبحث عنه؟</h2>
              <p className="text-muted-foreground mb-8">فريق الدعم لدينا جاهز لمساعدتك في أي وقت</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="/contact">تواصل معنا</a>
                </Button>
                <Button variant="outline" size="lg">
                  دردشة مباشرة
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
