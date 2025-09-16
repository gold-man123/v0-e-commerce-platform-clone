import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Clock } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">تم تأكيد طلبك بنجاح!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">
              شكراً لك على طلبك. سيتم التواصل معك قريباً لتأكيد التفاصيل وترتيب التوصيل.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Package className="h-5 w-5 text-primary" />
                <div className="text-right rtl:text-right">
                  <p className="font-medium">معالجة الطلب</p>
                  <p className="text-sm text-muted-foreground">1-2 أيام عمل</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div className="text-right rtl:text-right">
                  <p className="font-medium">التوصيل</p>
                  <p className="text-sm text-muted-foreground">3-5 أيام عمل</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/orders">عرض طلباتي</Link>
              </Button>

              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/">متابعة التسوق</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
