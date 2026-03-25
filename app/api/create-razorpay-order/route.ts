import { type NextRequest, NextResponse } from "next/server"

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

export async function POST(request: NextRequest) {
  try {
    const { email, fullName, planId, amount } = await request.json()

    // Validate inputs
    if (!email || !fullName || !planId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create Razorpay order
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")}`,
      },
      body: JSON.stringify({
        amount: amount, // in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          email,
          fullName,
          planId,
        },
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create Razorpay order")
    }

    const order = await response.json()

    return NextResponse.json(
      {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: RAZORPAY_KEY_ID, // Return key from server instead of exposing to client
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Razorpay order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
