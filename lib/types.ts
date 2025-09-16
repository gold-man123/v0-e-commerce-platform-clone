// Database types for the e-commerce platform

export interface Profile {
  id: string
  email: string
  full_name?: string
  phone?: string
  avatar_url?: string
  role: "customer" | "seller" | "admin"
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name_ar: string
  name_en: string
  slug: string
  description_ar?: string
  description_en?: string
  image_url?: string
  parent_id?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  children?: Category[]
}

export interface Store {
  id: string
  seller_id: string
  name_ar: string
  name_en: string
  slug: string
  description_ar?: string
  description_en?: string
  logo_url?: string
  banner_url?: string
  phone?: string
  email?: string
  address_ar?: string
  address_en?: string
  city?: string
  country: string
  is_verified: boolean
  is_active: boolean
  rating: number
  total_reviews: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  store_id: string
  category_id: string
  name_ar: string
  name_en: string
  slug: string
  description_ar?: string
  description_en?: string
  short_description_ar?: string
  short_description_en?: string
  sku?: string
  price: number
  compare_price?: number
  cost_price?: number
  stock_quantity: number
  min_stock_level: number
  weight?: number
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  images: string[]
  is_featured: boolean
  is_active: boolean
  status: "draft" | "active" | "inactive" | "out_of_stock"
  seo_title?: string
  seo_description?: string
  tags?: string[]
  created_at: string
  updated_at: string
  store?: Store
  category?: Category
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  product_id: string
  name_ar: string
  name_en: string
  sku?: string
  price?: number
  stock_quantity: number
  attributes: Record<string, any>
  image_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_id: string
  order_number: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  payment_status: "pending" | "paid" | "failed" | "refunded"
  payment_method?: string
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  total_amount: number
  currency: string
  shipping_name: string
  shipping_phone: string
  shipping_address_ar: string
  shipping_address_en?: string
  shipping_city: string
  shipping_country: string
  billing_name?: string
  billing_phone?: string
  billing_address_ar?: string
  billing_address_en?: string
  billing_city?: string
  billing_country?: string
  notes?: string
  tracking_number?: string
  shipped_at?: string
  delivered_at?: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id?: string
  store_id: string
  quantity: number
  unit_price: number
  total_price: number
  product_name_ar: string
  product_name_en: string
  product_image?: string
  variant_attributes?: Record<string, any>
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  variant_id?: string
  quantity: number
  created_at: string
  updated_at: string
  product?: Product
  variant?: ProductVariant
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface Review {
  id: string
  user_id: string
  product_id: string
  order_id?: string
  rating: number
  title?: string
  comment?: string
  images?: string[]
  is_verified: boolean
  is_approved: boolean
  created_at: string
  updated_at: string
  user?: Profile
}

export interface Coupon {
  id: string
  code: string
  name_ar: string
  name_en: string
  description_ar?: string
  description_en?: string
  type: "percentage" | "fixed"
  value: number
  minimum_amount: number
  maximum_discount?: number
  usage_limit?: number
  used_count: number
  is_active: boolean
  starts_at?: string
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title_ar: string
  title_en: string
  message_ar: string
  message_en: string
  data?: Record<string, any>
  is_read: boolean
  created_at: string
}
