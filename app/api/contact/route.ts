import { createServerClient } from "@/lib/supabase/server"
import { withValidation } from "@/lib/api/auth-middleware"
import { contactSchema } from "@/lib/security/validation"
import { measurePerformance } from "@/lib/utils/performance"
import { type NextRequest, NextResponse } from "next/server"

// POST /api/contact - Submit contact form
export const POST = withValidation(async (req: NextRequest, data: any) => {
  return measurePerformance("POST /api/contact", async () => {
    try {
      const supabase = createServerClient()

      const { data: contact, error } = await supabase
        .from("contact_messages")
        .insert({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          status: "new",
        })
        .select()
        .single()

      if (error) throw error

      // Here you could also send an email notification to admins
      // await sendEmailNotification(data)

      return NextResponse.json({ message: "تم إرسال رسالتك بنجاح. سنتواصل معك قريباً." }, { status: 201 })
    } catch (error) {
      console.error("Error submitting contact form:", error)
      return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
    }
  })
}, contactSchema)
