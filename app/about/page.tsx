import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, ShoppingBag, Store, Award } from "lucide-react"

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "عملاء راضون", value: "10,000+" },
    { icon: Store, label: "متاجر شريكة", value: "500+" },
    { icon: ShoppingBag, label: "منتج متاح", value: "50,000+" },
    { icon: Award, label: "سنوات خبرة", value: "5+" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">من نحن</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              منصة التجارة الإلكترونية الرائدة في موريتانيا، نربط البائعين بالعملاء لتوفير أفضل تجربة تسوق رقمية
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">قصتنا</h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-muted-foreground mb-4">
                    بدأت وادي كفكرة بسيطة: ربط التجار المحليين في موريتانيا بالعملاء من خلال منصة إلكترونية موثوقة وسهلة
                    الاستخدام.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    منذ تأسيسنا، نمونا لنصبح أكبر منصة تجارة إلكترونية في البلاد، حيث نخدم آلاف العملاء ونساعد مئات
                    التجار على توسيع أعمالهم.
                  </p>
                  <p className="text-muted-foreground">
                    نحن ملتزمون بتوفير تجربة تسوق آمنة ومريحة، مع دعم اللغة العربية والثقافة المحلية.
                  </p>
                </div>
                <div className="relative">
                  <img src="/mauritanian-marketplace-team.jpg" alt="فريق وادي" className="rounded-lg shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">رسالتنا</h3>
                    <p className="text-muted-foreground">
                      تمكين التجار المحليين من الوصول إلى عملاء أكثر وتوفير منصة آمنة وموثوقة للتسوق الإلكتروني في
                      موريتانيا، مع الحفاظ على القيم المحلية والثقافية.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">رؤيتنا</h3>
                    <p className="text-muted-foreground">
                      أن نكون المنصة الأولى للتجارة الإلكترونية في موريتانيا وغرب أفريقيا، ونساهم في التحول الرقمي
                      للاقتصاد المحلي.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">قيمنا</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Badge variant="secondary" className="text-lg p-2">
                    الثقة
                  </Badge>
                  <p className="text-muted-foreground">نبني الثقة من خلال الشفافية والأمان في جميع معاملاتنا</p>
                </div>
                <div className="space-y-3">
                  <Badge variant="secondary" className="text-lg p-2">
                    الجودة
                  </Badge>
                  <p className="text-muted-foreground">نضمن جودة المنتجات والخدمات المقدمة عبر منصتنا</p>
                </div>
                <div className="space-y-3">
                  <Badge variant="secondary" className="text-lg p-2">
                    الابتكار
                  </Badge>
                  <p className="text-muted-foreground">نسعى دائماً لتطوير حلول مبتكرة تلبي احتياجات السوق المحلي</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
