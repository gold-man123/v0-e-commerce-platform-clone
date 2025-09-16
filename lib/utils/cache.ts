// Simple in-memory cache for performance optimization
interface CacheItem<T> {
  data: T
  expiry: number
}

class Cache {
  private store: Map<string, CacheItem<any>> = new Map()

  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    const expiry = Date.now() + ttlMs
    this.store.set(key, { data, expiry })
  }

  get<T>(key: string): T | null {
    const item = this.store.get(key)

    if (!item) return null

    if (Date.now() > item.expiry) {
      this.store.delete(key)
      return null
    }

    return item.data
  }

  delete(key: string): void {
    this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }

  // Clean up expired items
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.store.entries()) {
      if (now > item.expiry) {
        this.store.delete(key)
      }
    }
  }
}

export const cache = new Cache()

// Auto cleanup every 5 minutes
setInterval(
  () => {
    cache.cleanup()
  },
  5 * 60 * 1000,
)

// Cache keys
export const CACHE_KEYS = {
  CATEGORIES: "categories",
  FEATURED_PRODUCTS: "featured_products",
  STORE_PRODUCTS: (storeId: string) => `store_products_${storeId}`,
  USER_PROFILE: (userId: string) => `user_profile_${userId}`,
  STORE_INFO: (storeId: string) => `store_info_${storeId}`,
}
