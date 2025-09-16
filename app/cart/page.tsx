import { AuthGuard } from "@/components/auth/auth-guard"
import { ShoppingCart } from "@/components/cart/shopping-cart"

export default function CartPage() {
  return (
    <AuthGuard allowedRoles={["customer"]}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">سلة التسوق</h1>
          <ShoppingCart />
        </div>
      </div>
    </AuthGuard>
  )
}
