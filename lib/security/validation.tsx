import { z } from "zod"

// User validation schemas
export const signUpSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  full_name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  phone: z.string().regex(/^[0-9+\-\s()]+$/, "رقم الهاتف غير صحيح"),
  role: z.enum(["customer", "seller"]),
})

export const signInSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
})

// Product validation schemas
export const productSchema = z.object({
  name_ar: z.string().min(2, "اسم المنتج بالعربية مطلوب"),
  name_en: z.string().min(2, "اسم المنتج بالإنجليزية مطلوب"),
  description_ar: z.string().min(10, "وصف المنتج بالعربية مطلوب"),
  description_en: z.string().min(10, "وصف المنتج بالإنجليزية مطلوب"),
  price: z.number().positive("السعر يجب أن يكون أكبر من صفر"),
  stock_quantity: z.number().int().min(0, "الكمية يجب أن تكون صفر أو أكثر"),
  category_id: z.string().uuid("معرف الفئة غير صحيح"),
  image_url: z.string().url("رابط الصورة غير صحيح").optional(),
})

// Store validation schemas
export const storeSchema = z.object({
  name_ar: z.string().min(2, "اسم المتجر بالعربية مطلوب"),
  name_en: z.string().min(2, "اسم المتجر بالإنجليزية مطلوب"),
  description_ar: z.string().min(10, "وصف المتجر بالعربية مطلوب"),
  description_en: z.string().min(10, "وصف المتجر بالإنجليزية مطلوب"),
  phone: z.string().regex(/^[0-9+\-\s()]+$/, "رقم الهاتف غير صحيح"),
  address: z.string().min(5, "العنوان مطلوب"),
  logo_url: z.string().url("رابط الشعار غير صحيح").optional(),
})

// Order validation schemas
export const orderSchema = z.object({
  shipping_address: z.string().min(10, "عنوان التوصيل مطلوب"),
  payment_method: z.enum(["cash_on_delivery", "bank_transfer", "mobile_money"]),
  notes: z.string().optional(),
})

// Sanitization functions
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "")
}

// Input validation middleware
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => err.message),
      }
    }
    return {
      success: false,
      errors: ["خطأ في التحقق من البيانات"],
    }
  }
}
