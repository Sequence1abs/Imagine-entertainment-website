import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid request body. Expected JSON." },
      { status: 400 }
    )
  }

  try {
    const { name, email, company, eventType, message } = body as { name?: string; email?: string; company?: string; eventType?: string; message?: string }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASSWORD
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = parseInt(process.env.SMTP_PORT || "465")

    if (!smtpUser || !smtpPass || !smtpHost) {
      console.error("SMTP credentials not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD.")
      return NextResponse.json(
        { error: "Email service not configured. Please set up SMTP credentials." },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    const mailOptions = {
      from: smtpUser,
      to: "hasaldharmagunawardana@gmail.com",
      subject: `New Contact Form Submission - ${eventType || "General Inquiry"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="margin-top: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
            ${eventType ? `<p><strong>Event Type:</strong> ${eventType}</p>` : ""}
          </div>
          
          <div style="margin-top: 30px;">
            <h3 style="color: #333;">Message:</h3>
            <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
              ${message}
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>This email was sent from the Imagine Entertainment contact form.</p>
            <p>Reply directly to: ${email}</p>
          </div>
        </div>
      `,
      replyTo: email,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error sending email:", error)
    let errorMessage = "Failed to send email. Please try again later."
    
    if (error?.code === "EAUTH") {
      errorMessage = "Email authentication failed. Please check your SMTP credentials."
    } else if (error?.code === "ECONNECTION") {
      errorMessage = "Could not connect to email server. Please check your internet connection."
    } else if (error?.message) {
      errorMessage = `Email error: ${error.message}`
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

