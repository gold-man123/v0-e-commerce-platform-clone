-- Seed initial data for the e-commerce platform

-- Insert main categories
INSERT INTO public.categories (name_ar, name_en, slug, description_ar, description_en, sort_order) VALUES
('إلكترونيات', 'Electronics', 'electronics', 'أجهزة إلكترونية ومعدات تقنية', 'Electronic devices and tech equipment', 1),
('أزياء', 'Fashion', 'fashion', 'ملابس وإكسسوارات', 'Clothing and accessories', 2),
('منزل وحديقة', 'Home & Garden', 'home-garden', 'أدوات منزلية ومعدات الحديقة', 'Home appliances and garden tools', 3),
('رياضة', 'Sports', 'sports', 'معدات رياضية وملابس رياضية', 'Sports equipment and athletic wear', 4),
('كتب', 'Books', 'books', 'كتب ومواد تعليمية', 'Books and educational materials', 5),
('صحة وجمال', 'Health & Beauty', 'health-beauty', 'منتجات العناية والجمال', 'Health and beauty products', 6),
('ألعاب', 'Toys', 'toys', 'ألعاب الأطفال والترفيه', 'Children toys and entertainment', 7),
('سيارات', 'Automotive', 'automotive', 'قطع غيار ومعدات السيارات', 'Car parts and automotive equipment', 8);

-- Insert subcategories for Electronics
INSERT INTO public.categories (name_ar, name_en, slug, description_ar, description_en, parent_id, sort_order) 
SELECT 
  'هواتف ذكية', 'Smartphones', 'smartphones', 'هواتف ذكية وإكسسوارات', 'Smartphones and accessories', id, 1
FROM public.categories WHERE slug = 'electronics';

INSERT INTO public.categories (name_ar, name_en, slug, description_ar, description_en, parent_id, sort_order) 
SELECT 
  'حاسوب', 'Computers', 'computers', 'أجهزة حاسوب ولابتوب', 'Desktop and laptop computers', id, 2
FROM public.categories WHERE slug = 'electronics';

INSERT INTO public.categories (name_ar, name_en, slug, description_ar, description_en, parent_id, sort_order) 
SELECT 
  'تلفزيونات', 'TVs', 'tvs', 'تلفزيونات وشاشات', 'Televisions and monitors', id, 3
FROM public.categories WHERE slug = 'electronics';

-- Insert subcategories for Fashion
INSERT INTO public.categories (name_ar, name_en, slug, description_ar, description_en, parent_id, sort_order) 
SELECT 
  'ملابس رجالية', 'Men Clothing', 'men-clothing', 'ملابس للرجال', 'Clothing for men', id, 1
FROM public.categories WHERE slug = 'fashion';

INSERT INTO public.categories (name_ar, name_en, slug, description_ar, description_en, parent_id, sort_order) 
SELECT 
  'ملابس نسائية', 'Women Clothing', 'women-clothing', 'ملابس للنساء', 'Clothing for women', id, 2
FROM public.categories WHERE slug = 'fashion';

INSERT INTO public.categories (name_ar, name_en, slug, description_ar, description_en, parent_id, sort_order) 
SELECT 
  'أحذية', 'Shoes', 'shoes', 'أحذية للرجال والنساء', 'Shoes for men and women', id, 3
FROM public.categories WHERE slug = 'fashion';

-- Create sample admin user (will be created when someone signs up with this email)
-- The trigger will handle profile creation

-- Insert sample coupons
INSERT INTO public.coupons (code, name_ar, name_en, description_ar, description_en, type, value, minimum_amount, usage_limit, is_active, expires_at) VALUES
('WELCOME10', 'خصم ترحيبي', 'Welcome Discount', 'خصم 10% للعملاء الجدد', '10% discount for new customers', 'percentage', 10.00, 50.00, 100, true, NOW() + INTERVAL '30 days'),
('SAVE50', 'وفر 50', 'Save 50', 'خصم 50 أوقية على الطلبات فوق 200', '50 MRU discount on orders over 200', 'fixed', 50.00, 200.00, 50, true, NOW() + INTERVAL '15 days'),
('SUMMER20', 'صيف 20', 'Summer 20', 'خصم صيفي 20%', '20% summer discount', 'percentage', 20.00, 100.00, 200, true, NOW() + INTERVAL '60 days');
