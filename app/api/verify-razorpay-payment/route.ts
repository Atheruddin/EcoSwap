import crypto from "crypto"
import { type NextRequest, NextResponse } from "next/server"

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentId, signature, email } = await request.json()

    // Verify Razorpay signature
    const body = `${orderId}|${paymentId}`
    const expectedSignature = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET!).update(body).digest("hex")

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Payment verified successfully
    // Here you would:
    // 1. Save subscription to database
    // 2. Send confirmation email
    // 3. Update user's Pro status
    console.log("[v0] Payment verified for:", email)

    return NextResponse.json({ success: true, message: "Payment verified" }, { status: 200 })
  } catch (error) {
    console.error("[v0] Payment verification error:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
