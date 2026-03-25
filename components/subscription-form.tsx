"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SubscriptionFormProps {
  planId: string
  amount: number
  planName: string
  price: string
  onClose: () => void
}

export default function SubscriptionForm({ planId, amount, planName, price, onClose }: SubscriptionFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validate form
    if (!formData.email || !formData.fullName) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    try {
      // Create order via API
      const response = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          planId: planId,
          amount: amount,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const data = await response.json()

      // Wait for Razorpay script to load
      const checkRazorpay = () => {
        if ((window as any).Razorpay) {
          openRazorpayCheckout(data)
          setLoading(false)
        } else {
          setTimeout(checkRazorpay, 100)
        }
      }

      checkRazorpay()
    } catch (err) {
      setError("Failed to process payment. Please try again.")
      setLoading(false)
    }
  }

  const openRazorpayCheckout = async (data: any) => {
    try {
      const options = {
        key: data.keyId, // Use key from server response instead of env var
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/verify-razorpay-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                email: formData.email,
              }),
            })

            if (verifyResponse.ok) {
              // Redirect to success page
              window.location.href = `/success?email=${encodeURIComponent(formData.email)}`
            } else {
              setError("Payment verification failed")
            }
          } catch (err) {
            setError("Error verifying payment")
          }
          setLoading(false)
        },
        prefill: {
          email: formData.email,
          name: formData.fullName,
        },
        theme: {
          color: "#10b981",
        },
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (err) {
      setError("Error opening payment checkout")
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="glass-strong rounded-2xl max-w-md w-full relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-2">Upgrade to {planName}</h2>
          <p className="text-gray-400 mb-6">{price}/month</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full glass rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full glass rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg px-4 py-2 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full eco-gradient text-white rounded-lg py-2 font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Continue to Payment"}
            </Button>

            <p className="text-xs text-gray-400 text-center">Secure payment powered by Razorpay</p>
          </form>
        </div>
      </div>
    </div>
  )
}
