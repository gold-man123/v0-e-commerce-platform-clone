// Rate limiting utility for API endpoints
interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export function rateLimit(config: RateLimitConfig) {
  return (identifier: string): { success: boolean; remaining: number; resetTime: number } => {
    const now = Date.now()
    const key = identifier

    // Clean up expired entries
    if (store[key] && now > store[key].resetTime) {
      delete store[key]
    }

    // Initialize or get existing entry
    if (!store[key]) {
      store[key] = {
        count: 0,
        resetTime: now + config.windowMs,
      }
    }

    const entry = store[key]

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      return {
        success: false,
        remaining: 0,
        resetTime: entry.resetTime,
      }
    }

    // Increment counter
    entry.count++

    return {
      success: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    }
  }
}

// Predefined rate limiters
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
})

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
})

export const orderRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 orders per minute
})
