import { z } from "zod"

// Product validation schema
export const productSchema = z.object({
  name_ar: z.string().min(1, "اسم المنتج باللغة العربية مطلوب"),
  name_en: z.string().min(1, "Product name in English is required"),
  description_ar: z.string().min(10, "وصف المنتج باللغة العربية يجب أن يكون 10 أحرف على الأقل"),
  description_en: z.string().min(10, "Product description in English must be at least 10 characters"),
  price: z.number().positive("السعر يجب أن يكون أكبر من صفر"),
  compare_price: z.number().optional(),
  category_id: z.string().uuid("معرف الفئة غير صحيح"),
  images: z.array(z.string().url()).min(1, "صورة واحدة على الأقل مطلوبة"),
  stock_quantity: z.number().int().min(0, "كمية المخزون يجب أن تكون صفر أو أكثر"),
  sku: z.string().optional(),
  weight: z.number().positive().optional(),
  dimensions: z
    .object({
      length: z.number().positive(),
      width: z.number().positive(),
      height: z.number().positive(),
    })
    .optional(),
  tags: z.array(z.string()).optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
})

// Store validation schema
export const storeSchema = z.object({
  name_ar: z.string().min(1, "اسم المتجر باللغة العربية مطلوب"),
  name_en: z.string().min(1, "Store name in English is required"),
  description_ar: z.string().min(20, "وصف المتجر باللغة العربية يجب أن يكون 20 حرف على الأقل"),
  description_en: z.string().min(20, "Store description in English must be at least 20 characters"),
  logo_url: z.string().url().optional(),
  banner_url: z.string().url().optional(),
  phone: z.string().min(8, "رقم الهاتف يجب أن يكون 8 أرقام على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  address_ar: z.string().min(10, "العنوان باللغة العربية مطلوب"),
  address_en: z.string().min(10, "Address in English is required"),
  city: z.string().min(1, "المدينة مطلوبة"),
  country: z.string().default("MR"),
  business_license: z.string().optional(),
  tax_id: z.string().optional(),
})

// Category validation schema
export const categorySchema = z.object({
  name_ar: z.string().min(1, "اسم الفئة باللغة العربية مطلوب"),
  name_en: z.string().min(1, "Category name in English is required"),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  image_url: z.string().url().optional(),
  parent_id: z.string().uuid().optional(),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
})

// User profile validation schema
export const profileSchema = z.object({
  first_name: z.string().min(1, "الاسم الأول مطلوب"),
  last_name: z.string().min(1, "اسم العائلة مطلوب"),
  phone: z.string().min(8, "رقم الهاتف يجب أن يكون 8 أرقام على الأقل"),
  address_ar: z.string().optional(),
  address_en: z.string().optional(),
  city: z.string().optional(),
  country: z.string().default("MR"),
  date_of_birth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
})

// Order validation schema
export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
      }),
    )
    .min(1, "يجب أن يحتوي الطلب على منتج واحد على الأقل"),
  shipping_address: z.object({
    first_name: z.string().min(1, "الاسم الأول مطلوب"),
    last_name: z.string().min(1, "اسم العائلة مطلوب"),
    phone: z.string().min(8, "رقم الهاتف مطلوب"),
    address_ar: z.string().min(10, "العنوان مطلوب"),
    city: z.string().min(1, "المدينة مطلوبة"),
    postal_code: z.string().optional(),
  }),
  payment_method: z.enum(["cash_on_delivery", "bank_transfer", "mobile_money"]),
  notes: z.string().optional(),
})

// Cart item validation schema
export const cartItemSchema = z.object({
  product_id: z.string().uuid("معرف المنتج غير صحيح"),
  quantity: z.number().int().positive("الكمية يجب أن تكون أكبر من صفر"),
})

// Review validation schema
export const reviewSchema = z.object({
  product_id: z.string().uuid("معرف المنتج غير صحيح"),
  rating: z.number().int().min(1).max(5, "التقييم يجب أن يكون بين 1 و 5"),
  comment: z.string().min(10, "التعليق يجب أن يكون 10 أحرف على الأقل"),
})

// Contact form validation schema
export const contactSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  subject: z.string().min(1, "الموضوع مطلوب"),
  message: z.string().min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل"),
})
