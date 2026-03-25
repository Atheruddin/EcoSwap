"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/toast"
import { createPost } from "@/lib/posts"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { ProtectedRoute } from "@/components/protected-route"

export default function PostPage() {
  const { user, userProfile } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    location: "",
    ecoFriendly: false,
  })

  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home & Garden",
    "Sports & Outdoors",
    "Toys & Games",
    "Art & Crafts",
    "Music & Instruments",
    "Other",
  ]

  const conditions = [
    { value: "new", label: "New" },
    { value: "like-new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "used", label: "Used" },
    { value: "vintage", label: "Vintage" },
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 5) {
      showToast("Maximum 5 images allowed", "error")
      return
    }

    setImages((prev) => [...prev, ...files])

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !userProfile) return

    setLoading(true)

    try {
      if (!formData.title || !formData.description || !formData.category || !formData.condition || !formData.location) {
        showToast("Please fill in all required fields", "error")
        setLoading(false)
        return
      }

      // Upload images to Cloudinary
      const imageUrls: string[] = []
      for (const image of images) {
        const url = await uploadToCloudinary(image)
        console.log("[v0] Image uploaded:", url)
        imageUrls.push(url)
      }

      if (imageUrls.length === 0) {
        console.warn("[v0] No images uploaded")
      }

      // Create post
      const postData = {
        userId: user.uid,
        userName: userProfile.displayName,
        userEmail: user.email || "",
        userDisplayName: userProfile.displayName,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        condition: formData.condition,
        images: imageUrls,
        imageUrl: imageUrls[0] || "",
        location: formData.location,
        status: "available" as const,
        interestedUsers: [],
        ecoFriendly: formData.ecoFriendly,
      }

      console.log("[v0] Submitting post data:", postData)
      const postId = await createPost(postData)
      console.log("[v0] Post created successfully with ID:", postId)

      showToast("Item posted successfully!", "success")
      router.push("/dashboard")
    } catch (error) {
      console.error("[v0] Error creating post:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to post item. Please try again."
      showToast(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-20 pb-20 md:pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">Post an Item</h1>
            <p className="text-xl text-gray-300">Share something amazing with the community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="glass-strong rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Item Title</label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="What are you posting?"
                    className="glass border-white/20 text-white placeholder:text-gray-400 focus:border-emerald-400 bg-black/20"
                    style={{ color: "white", backgroundColor: "rgba(0, 0, 0, 0.2)" }}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your item in detail..."
                    rows={4}
                    className="glass border-white/20 text-white placeholder:text-gray-400 focus:border-emerald-400 bg-black/20"
                    style={{ color: "white", backgroundColor: "rgba(0, 0, 0, 0.2)" }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="glass border-white/20 text-white bg-black/20">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Condition</label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                    <SelectTrigger className="glass border-white/20 text-white bg-black/20">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition.value} value={condition.value}>
                          {condition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Where is this item located?"
                    className="glass border-white/20 text-white placeholder:text-gray-400 focus:border-emerald-400 bg-black/20"
                    style={{ color: "white", backgroundColor: "rgba(0, 0, 0, 0.2)" }}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={formData.ecoFriendly}
                      onCheckedChange={(checked) => handleInputChange("ecoFriendly", checked)}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span className="text-white font-medium">Eco-Friendly Premium</span>
                      </div>
                      <p className="text-gray-400 text-sm">Mark this item as environmentally friendly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="glass-strong rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Photos</h2>

              <div className="space-y-4">
                {/* Upload Button */}
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-white font-medium mb-2">Upload Photos</p>
                    <p className="text-gray-400 text-sm">Drag and drop or click to select (Max 5 images)</p>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="eco-gradient text-white neon-glow hover:scale-105 transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Posting...
                  </div>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Post Item
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}
