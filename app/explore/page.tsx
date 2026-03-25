"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Calendar, MessageCircle, Heart, Filter } from "lucide-react"
import { getPosts, type Post } from "@/lib/posts"
import { createOrGetChat } from "@/lib/chat"
import { SwapRequestModal } from "@/components/swap-request-modal"
import { toast } from "@/hooks/use-toast"

export default function ExplorePage() {
  return (
    <ProtectedRoute>
      <ExploreContent />
    </ProtectedRoute>
  )
}

function ExploreContent() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCondition, setSelectedCondition] = useState("all")
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showSwapModal, setShowSwapModal] = useState(false)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const allPosts = await getPosts()
        // Filter out current user's posts
        const otherUsersPosts = allPosts.filter((post) => post.userId !== user?.uid)
        setPosts(otherUsersPosts)
        setFilteredPosts(otherUsersPosts)
      } catch (error) {
        console.error("Error loading posts:", error)
        toast({
          title: "Error",
          description: "Failed to load posts",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadPosts()
    }
  }, [user])

  useEffect(() => {
    let filtered = posts

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory)
    }

    // Filter by condition
    if (selectedCondition !== "all") {
      filtered = filtered.filter((post) => post.condition === selectedCondition)
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm, selectedCategory, selectedCondition])

  const handleContactSeller = async (post: Post) => {
    if (!user) return

    try {
      const chatId = await createOrGetChat(user.uid, post.userId, user.displayName || "Anonymous", post.userName)

      toast({
        title: "Chat Started",
        description: `You can now message ${post.userName}`,
      })

      // Redirect to chat page
      window.location.href = "/chat"
    } catch (error) {
      console.error("Error creating chat:", error)
      toast({
        title: "Error",
        description: "Failed to start chat",
        variant: "destructive",
      })
    }
  }

  const handleSwapRequest = (post: Post) => {
    setSelectedPost(post)
    setShowSwapModal(true)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const categories = ["all", "electronics", "clothing", "books", "home", "sports", "toys", "other"]
  const conditions = ["all", "new", "like-new", "good", "fair", "poor"]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Items</h1>
        <p className="text-gray-600">Discover amazing items from the EcoSwap community</p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition === "all" ? "All Conditions" : condition.charAt(0).toUpperCase() + condition.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          {filteredPosts.length} {filteredPosts.length === 1 ? "item" : "items"} found
        </p>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500 text-center">
              Try adjusting your search criteria or check back later for new items.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={post.imageUrl || `/placeholder.svg?height=300&width=300`}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90">
                    {post.condition}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{post.title}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mt-2">{post.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={`/placeholder.svg?height=24&width=24`} />
                    <AvatarFallback className="text-xs bg-green-100 text-green-700">
                      {post.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{post.userName}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{post.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleContactSeller(post)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button size="sm" className="flex-1" onClick={() => handleSwapRequest(post)}>
                  <Heart className="h-4 w-4 mr-2" />
                  Swap
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Swap Request Modal */}
      {showSwapModal && selectedPost && (
        <SwapRequestModal
          isOpen={showSwapModal}
          onClose={() => {
            setShowSwapModal(false)
            setSelectedPost(null)
          }}
          post={selectedPost}
        />
      )}
    </div>
  )
}
