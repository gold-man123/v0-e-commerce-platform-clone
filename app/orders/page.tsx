import { AuthGuard } from "@/components/auth/auth-guard"
import { OrderHistory } from "@/components/orders/order-history"

export default function OrdersPage() {
  return (
    <AuthGuard allowedRoles={["customer"]}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">طلباتي</h1>
          <OrderHistory />
        </div>
      </div>
    </AuthGuard>
  )
}
