import { NextRequest, NextResponse } from "next/server"

// Dynamic import for nodemailer to handle cases where it's not installed
let nodemailer: any
try {
  nodemailer = require("nodemailer")
} catch (e) {
  console.warn("nodemailer not installed. Please run: npm install nodemailer @types/nodemailer")
}

export async function POST(request: NextRequest) {
  try {
    // Check if nodemailer is installed
    if (!nodemailer) {
      console.error("nodemailer is not installed. Please run: npm install nodemailer @types/nodemailer")
      return NextResponse.json(
        { error: "Email service not configured. Please install nodemailer." },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { name, email, company, eventType, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    // Check for email configuration
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS

    if (!smtpUser || !smtpPass) {
      console.error("SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS environment variables.")
      return NextResponse.json(
        { error: "Email service not configured. Please set up SMTP credentials." },
        { status: 500 }
      )
    }

    // Create transporter (using Gmail SMTP as example)
    // You'll need to set up environment variables for production
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    // Email content
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

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error sending email:", error)
    
    // Provide more specific error messages
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

