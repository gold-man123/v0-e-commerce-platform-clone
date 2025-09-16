import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">تواصل معنا</h1>
            <p className="text-xl text-muted-foreground">نحن هنا لمساعدتك. تواصل معنا في أي وقت</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>أرسل لنا رسالة</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">الاسم الأول</Label>
                      <Input id="firstName" placeholder="أحمد" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">اسم العائلة</Label>
                      <Input id="lastName" placeholder="محمد" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input id="email" type="email" placeholder="ahmed@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input id="phone" type="tel" placeholder="+222 XX XX XX XX" />
                  </div>
                  <div>
                    <Label htmlFor="subject">الموضوع</Label>
                    <Input id="subject" placeholder="كيف يمكننا مساعدتك؟" />
                  </div>
                  <div>
                    <Label htmlFor="message">الرسالة</Label>
                    <Textarea id="message" placeholder="اكتب رسالتك هنا..." rows={5} />
                  </div>
                  <Button type="submit" className="w-full">
                    إرسال الرسالة
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">الهاتف</h3>
                      <p className="text-muted-foreground">+222 XX XX XX XX</p>
                      <p className="text-muted-foreground">+222 YY YY YY YY</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">البريد الإلكتروني</h3>
                      <p className="text-muted-foreground">info@wadi.mr</p>
                      <p className="text-muted-foreground">support@wadi.mr</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">العنوان</h3>
                      <p className="text-muted-foreground">
                        شارع الاستقلال
                        <br />
                        نواكشوط، موريتانيا
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">ساعات العمل</h3>
                      <p className="text-muted-foreground">
                        الأحد - الخميس: 8:00 ص - 6:00 م<br />
                        الجمعة: 2:00 م - 6:00 م<br />
                        السبت: مغلق
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <Card>
                <CardHeader>
                  <CardTitle>الأسئلة الشائعة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">كيف يمكنني تتبع طلبي؟</h4>
                      <p className="text-sm text-muted-foreground">يمكنك تتبع طلبك من خلال صفحة "طلباتي" في حسابك</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">ما هي طرق الدفع المتاحة؟</h4>
                      <p className="text-sm text-muted-foreground">
                        نقبل الدفع عند الاستلام، التحويل البنكي، والمحافظ الإلكترونية
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">كم تستغرق عملية التوصيل؟</h4>
                      <p className="text-sm text-muted-foreground">
                        عادة ما يستغرق التوصيل من 2-5 أيام عمل حسب المنطقة
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
