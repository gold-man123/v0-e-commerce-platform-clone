// Performance monitoring utilities
export function measurePerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const start = performance.now()

    try {
      const result = await fn()
      const end = performance.now()
      const duration = end - start

      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)

      // Log slow operations
      if (duration > 1000) {
        console.warn(`[Performance Warning] Slow operation: ${name} took ${duration.toFixed(2)}ms`)
      }

      resolve(result)
    } catch (error) {
      const end = performance.now()
      const duration = end - start
      console.error(`[Performance Error] ${name} failed after ${duration.toFixed(2)}ms:`, error)
      reject(error)
    }
  })
}

// Database query optimization
export function optimizeQuery(query: string): string {
  // Add LIMIT if not present for safety
  if (!query.toLowerCase().includes("limit") && query.toLowerCase().includes("select")) {
    return `${query} LIMIT 1000`
  }
  return query
}

// Image optimization
export function getOptimizedImageUrl(url: string, width?: number, height?: number): string {
  if (!url) return "/placeholder.svg"

  // If it's already a placeholder, return as is
  if (url.includes("placeholder.svg")) return url

  // Add optimization parameters for external images
  const params = new URLSearchParams()
  if (width) params.set("w", width.toString())
  if (height) params.set("h", height.toString())
  params.set("q", "80") // Quality
  params.set("f", "webp") // Format

  return `${url}?${params.toString()}`
}

// Debounce utility for search and input
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility for scroll events
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
