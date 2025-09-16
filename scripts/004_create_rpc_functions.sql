-- Create RPC functions for the e-commerce platform

-- Function to safely decrement product stock
CREATE OR REPLACE FUNCTION decrement_stock(product_id UUID, quantity INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products 
  SET 
    stock_quantity = stock_quantity - quantity,
    status = CASE 
      WHEN stock_quantity - quantity <= 0 THEN 'out_of_stock'
      WHEN stock_quantity - quantity <= min_stock_level THEN 'low_stock'
      ELSE status
    END,
    updated_at = NOW()
  WHERE id = product_id 
    AND stock_quantity >= quantity
    AND is_active = true;
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for product %', product_id;
  END IF;
END;
$$;

-- Function to increment product stock (for returns/cancellations)
CREATE OR REPLACE FUNCTION increment_stock(product_id UUID, quantity INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products 
  SET 
    stock_quantity = stock_quantity + quantity,
    status = CASE 
      WHEN status = 'out_of_stock' AND stock_quantity + quantity > 0 THEN 'active'
      ELSE status
    END,
    updated_at = NOW()
  WHERE id = product_id;
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product % not found', product_id;
  END IF;
END;
$$;

-- Function to calculate order total with tax and shipping
CREATE OR REPLACE FUNCTION calculate_order_total(
  subtotal DECIMAL(10,2),
  tax_rate DECIMAL(5,4) DEFAULT 0.0,
  shipping_amount DECIMAL(10,2) DEFAULT 0.0,
  discount_amount DECIMAL(10,2) DEFAULT 0.0
)
RETURNS DECIMAL(10,2)
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  tax_amount DECIMAL(10,2);
  total_amount DECIMAL(10,2);
BEGIN
  tax_amount := subtotal * tax_rate;
  total_amount := subtotal + tax_amount + shipping_amount - discount_amount;
  
  -- Ensure total is not negative
  IF total_amount < 0 THEN
    total_amount := 0;
  END IF;
  
  RETURN total_amount;
END;
$$;

-- Function to generate unique order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  order_number TEXT;
  counter INTEGER;
BEGIN
  -- Generate order number with format: ORD-YYYYMMDD-XXXX
  SELECT COUNT(*) + 1 INTO counter
  FROM orders 
  WHERE DATE(created_at) = CURRENT_DATE;
  
  order_number := 'ORD-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 4, '0');
  
  RETURN order_number;
END;
$$;

-- Function to update product rating after review
CREATE OR REPLACE FUNCTION update_product_rating(product_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  avg_rating DECIMAL(3,2);
  review_count INTEGER;
BEGIN
  SELECT 
    COALESCE(AVG(rating), 0)::DECIMAL(3,2),
    COUNT(*)
  INTO avg_rating, review_count
  FROM reviews 
  WHERE product_id = update_product_rating.product_id 
    AND is_approved = true;
  
  UPDATE products 
  SET 
    rating = avg_rating,
    total_reviews = review_count,
    updated_at = NOW()
  WHERE id = product_id;
END;
$$;

-- Function to update store rating based on product ratings
CREATE OR REPLACE FUNCTION update_store_rating(store_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  avg_rating DECIMAL(3,2);
  review_count INTEGER;
BEGIN
  SELECT 
    COALESCE(AVG(p.rating), 0)::DECIMAL(3,2),
    SUM(p.total_reviews)
  INTO avg_rating, review_count
  FROM products p
  WHERE p.store_id = update_store_rating.store_id 
    AND p.is_active = true;
  
  UPDATE stores 
  SET 
    rating = avg_rating,
    total_reviews = COALESCE(review_count, 0),
    updated_at = NOW()
  WHERE id = store_id;
END;
$$;

-- Function to check if user can review a product
CREATE OR REPLACE FUNCTION can_user_review_product(user_id UUID, product_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  has_purchased BOOLEAN := false;
  already_reviewed BOOLEAN := false;
BEGIN
  -- Check if user has purchased this product
  SELECT EXISTS(
    SELECT 1 
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE o.customer_id = user_id 
      AND oi.product_id = can_user_review_product.product_id
      AND o.status = 'delivered'
  ) INTO has_purchased;
  
  -- Check if user already reviewed this product
  SELECT EXISTS(
    SELECT 1 
    FROM reviews r
    WHERE r.user_id = can_user_review_product.user_id 
      AND r.product_id = can_user_review_product.product_id
  ) INTO already_reviewed;
  
  RETURN has_purchased AND NOT already_reviewed;
END;
$$;

-- Function to apply coupon discount
CREATE OR REPLACE FUNCTION apply_coupon_discount(
  coupon_code TEXT,
  order_total DECIMAL(10,2)
)
RETURNS DECIMAL(10,2)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  coupon_record RECORD;
  discount_amount DECIMAL(10,2) := 0;
BEGIN
  -- Get coupon details
  SELECT * INTO coupon_record
  FROM coupons 
  WHERE code = coupon_code 
    AND is_active = true
    AND (starts_at IS NULL OR starts_at <= NOW())
    AND (expires_at IS NULL OR expires_at >= NOW())
    AND (usage_limit IS NULL OR used_count < usage_limit)
    AND order_total >= minimum_amount;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired coupon code: %', coupon_code;
  END IF;
  
  -- Calculate discount
  IF coupon_record.type = 'percentage' THEN
    discount_amount := order_total * (coupon_record.value / 100);
  ELSE
    discount_amount := coupon_record.value;
  END IF;
  
  -- Apply maximum discount limit if set
  IF coupon_record.maximum_discount IS NOT NULL AND discount_amount > coupon_record.maximum_discount THEN
    discount_amount := coupon_record.maximum_discount;
  END IF;
  
  -- Ensure discount doesn't exceed order total
  IF discount_amount > order_total THEN
    discount_amount := order_total;
  END IF;
  
  -- Update coupon usage count
  UPDATE coupons 
  SET used_count = used_count + 1 
  WHERE id = coupon_record.id;
  
  RETURN discount_amount;
END;
$$;

-- Function to get product search results with ranking
CREATE OR REPLACE FUNCTION search_products(
  search_query TEXT,
  category_filter UUID DEFAULT NULL,
  store_filter UUID DEFAULT NULL,
  min_price DECIMAL(10,2) DEFAULT NULL,
  max_price DECIMAL(10,2) DEFAULT NULL,
  sort_by TEXT DEFAULT 'relevance'
)
RETURNS TABLE (
  id UUID,
  name_ar TEXT,
  name_en TEXT,
  price DECIMAL(10,2),
  images JSONB,
  store_name_ar TEXT,
  category_name_ar TEXT,
  rating DECIMAL(3,2),
  search_rank REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name_ar,
    p.name_en,
    p.price,
    p.images,
    s.name_ar as store_name_ar,
    c.name_ar as category_name_ar,
    p.rating,
    ts_rank(
      to_tsvector('arabic', p.name_ar || ' ' || COALESCE(p.description_ar, '')),
      plainto_tsquery('arabic', search_query)
    ) as search_rank
  FROM products p
  JOIN stores s ON p.store_id = s.id
  JOIN categories c ON p.category_id = c.id
  WHERE p.is_active = true
    AND p.status = 'active'
    AND s.is_active = true
    AND (category_filter IS NULL OR p.category_id = category_filter)
    AND (store_filter IS NULL OR p.store_id = store_filter)
    AND (min_price IS NULL OR p.price >= min_price)
    AND (max_price IS NULL OR p.price <= max_price)
    AND (
      to_tsvector('arabic', p.name_ar || ' ' || COALESCE(p.description_ar, '')) @@ plainto_tsquery('arabic', search_query)
      OR to_tsvector('english', p.name_en || ' ' || COALESCE(p.description_en, '')) @@ plainto_tsquery('english', search_query)
    )
  ORDER BY 
    CASE 
      WHEN sort_by = 'price_asc' THEN p.price
      ELSE NULL
    END ASC,
    CASE 
      WHEN sort_by = 'price_desc' THEN p.price
      ELSE NULL
    END DESC,
    CASE 
      WHEN sort_by = 'rating' THEN p.rating
      ELSE NULL
    END DESC,
    CASE 
      WHEN sort_by = 'newest' THEN p.created_at
      ELSE NULL
    END DESC,
    search_rank DESC;
END;
$$;

-- Create triggers for automatic rating updates
CREATE OR REPLACE FUNCTION trigger_update_product_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    PERFORM update_product_rating(NEW.product_id);
    PERFORM update_store_rating((SELECT store_id FROM products WHERE id = NEW.product_id));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM update_product_rating(OLD.product_id);
    PERFORM update_store_rating((SELECT store_id FROM products WHERE id = OLD.product_id));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger for review rating updates
DROP TRIGGER IF EXISTS trigger_review_rating_update ON reviews;
CREATE TRIGGER trigger_review_rating_update
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_product_rating();

-- Create trigger for order number generation
CREATE OR REPLACE FUNCTION trigger_generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_order_number_generation ON orders;
CREATE TRIGGER trigger_order_number_generation
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_generate_order_number();
