// Centralized error handling
export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export function handleError(error: unknown): { message: string; statusCode: number } {
  console.error("Application Error:", error)

  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
    }
  }

  if (error instanceof Error) {
    // Database errors
    if (error.message.includes("duplicate key")) {
      return {
        message: "البيانات موجودة مسبقاً",
        statusCode: 409,
      }
    }

    if (error.message.includes("foreign key")) {
      return {
        message: "خطأ في ربط البيانات",
        statusCode: 400,
      }
    }

    if (error.message.includes("not found")) {
      return {
        message: "البيانات غير موجودة",
        statusCode: 404,
      }
    }
  }

  // Default error
  return {
    message: "حدث خطأ غير متوقع",
    statusCode: 500,
  }
}

// Error logging
export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString()
  const errorMessage = error instanceof Error ? error.message : String(error)
  const stack = error instanceof Error ? error.stack : ""

  console.error(`[${timestamp}] ${context ? `[${context}] ` : ""}${errorMessage}`)
  if (stack) {
    console.error(stack)
  }

  // In production, send to error tracking service
  // Example: Sentry, LogRocket, etc.
}
