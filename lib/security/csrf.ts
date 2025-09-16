import { createHash, randomBytes } from "crypto"

// CSRF token generation and validation
export function generateCSRFToken(): string {
  return randomBytes(32).toString("hex")
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) return false

  // Simple validation - in production, use more sophisticated methods
  const expectedToken = createHash("sha256")
    .update(sessionToken + process.env.CSRF_SECRET || "default-secret")
    .digest("hex")

  return token === expectedToken
}

// CSRF middleware for API routes
export function withCSRF(handler: Function) {
  return async (req: any, res: any) => {
    if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE") {
      const token = req.headers["x-csrf-token"]
      const sessionToken = req.headers["authorization"]

      if (!validateCSRFToken(token, sessionToken)) {
        return res.status(403).json({ error: "Invalid CSRF token" })
      }
    }

    return handler(req, res)
  }
}
