import { AuthGuard } from "@/components/auth/auth-guard"
import { CheckoutForm } from "@/components/checkout/checkout-form"

export default function CheckoutPage() {
  return (
    <AuthGuard allowedRoles={["customer"]}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">إتمام الطلب</h1>
          <CheckoutForm />
        </div>
      </div>
    </AuthGuard>
  )
}
