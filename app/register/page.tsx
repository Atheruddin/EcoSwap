"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/toast"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp, signInWithGoogle } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match", "error")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      showToast("Password must be at least 6 characters", "error")
      setLoading(false)
      return
    }

    try {
      await signUp(formData.email, formData.password, formData.displayName)
      showToast("Account created successfully! Welcome to EcoSwap!", "success")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Registration error:", error)
      let errorMessage = "Registration failed"

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists"
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address"
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak"
      }

      showToast(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      showToast("Welcome to EcoSwap!", "success")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Google sign in error:", error)
      let errorMessage = "Google sign in failed"

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign in was cancelled"
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup was blocked. Please allow popups and try again"
      }

      showToast(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-8 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="glass-strong rounded-3xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">Join EcoSwap</h1>
            <p className="text-gray-300">Create your account and start swapping sustainably</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <Input
                type="text"
                value={formData.displayName}
                onChange={(e) => handleInputChange("displayName", e.target.value)}
                placeholder="Enter your full name"
                className="glass border-white/20 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:neon-glow bg-black/20"
                style={{
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your@email.com"
                className="glass border-white/20 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:neon-glow bg-black/20"
                style={{
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Create a password"
                  className="glass border-white/20 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:neon-glow pr-12 bg-black/20"
                  style={{
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                <Lock className="w-4 h-4 inline mr-2" />
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Confirm your password"
                  className="glass border-white/20 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:neon-glow pr-12 bg-black/20"
                  style={{
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full eco-gradient text-white py-3 rounded-full neon-glow hover:scale-105 transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-gray-400 text-sm">or</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Google Sign In */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 py-3 rounded-full transition-all duration-300 bg-transparent"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-gray-300">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
