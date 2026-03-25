"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "your email"
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Log subscription success (you can send this to your backend)
    console.log("[v0] Subscription successful for:", email)
  }, [email])

  const copyEmail = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-strong rounded-2xl p-8 md:p-12 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <CheckCircle className="w-16 h-16 text-emerald-400 animate-bounce" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-white mb-2">Subscription Confirmed!</h1>

        {/* Message */}
        <p className="text-gray-300 mb-6">Welcome to EcoSwap Pro! Your subscription is now active.</p>

        {/* Confirmation Details */}
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <p className="text-gray-400 text-sm mb-2">Confirmation sent to:</p>
          <div className="flex items-center justify-between gap-2">
            <p className="text-white font-semibold break-all">{email}</p>
            <button
              onClick={copyEmail}
              className="flex-shrink-0 p-2 hover:bg-white/10 rounded transition-colors"
              title="Copy email"
            >
              <Copy className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
          {copied && <p className="text-emerald-400 text-xs mt-2">Copied!</p>}
        </div>

        {/* Feature Highlight */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-8 text-left">
          <h3 className="text-white font-semibold mb-3">You now have:</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✓ Unlimited swaps per month</li>
            <li>✓ Featured item listings</li>
            <li>✓ Priority support access</li>
            <li>✓ Advanced search filters</li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Link href="/explore">
            <Button className="w-full eco-gradient text-white rounded-lg py-3 font-semibold hover:scale-105 transition-all duration-300">
              Start Exploring
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="w-full border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-gray-900 rounded-lg py-3 transition-all duration-300 bg-transparent"
            >
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Support Text */}
        <p className="text-gray-400 text-xs mt-8">
          Questions? Contact our support team at{" "}
          <a href="mailto:support@ecoswap.com" className="text-emerald-400 hover:underline">
            support@ecoswap.com
          </a>
        </p>
      </div>
    </div>
  )
}
