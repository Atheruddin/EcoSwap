"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUserPosts, type Post } from "@/lib/posts"
import { createOrGetChat, sendMessage } from "@/lib/chat"
import { toast } from "@/hooks/use-toast"

interface SwapRequestModalProps {
  isOpen: boolean
  onClose: () => void
  post: Post
}

export function SwapRequestModal({ isOpen, onClose, post }: SwapRequestModalProps) {
  const { user } = useAuth()
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [selectedPostId, setSelectedPostId] = useState<string>("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingPosts, setLoadingPosts] = useState(true)

  useEffect(() => {
    if (isOpen && user) {
      loadUserPosts()
      setMessage(`Hi! I'm interested in your "${post.title}". Would you like to trade?`)
    }
  }, [isOpen, user, post.title])

  const loadUserPosts = async () => {
    if (!user) return

    try {
      const posts = await getUserPosts(user.uid)
      setUserPosts(posts)
    } catch (error) {
      console.error("Error loading user posts:", error)
      toast({
        title: "Error",
        description: "Failed to load your items",
        variant: "destructive",
      })
    } finally {
      setLoadingPosts(false)
    }
  }

  const handleSendSwapRequest = async () => {
    if (!user || !selectedPostId || !message.trim()) return

    setLoading(true)
    try {
      // Create or get chat
      const chatId = await createOrGetChat(user.uid, post.userId, user.displayName || "Anonymous", post.userName)

      // Send swap request message
      const selectedPost = userPosts.find((p) => p.id === selectedPostId)
      const swapMessage = `${message}\n\nI'd like to offer my "${selectedPost?.title}" in exchange.`

      await sendMessage(chatId, user.uid, user.displayName || "Anonymous", swapMessage)

      toast({
        title: "Swap Request Sent!",
        description: `Your swap request has been sent to ${post.userName}`,
      })

      onClose()
    } catch (error) {
      console.error("Error sending swap request:", error)
      toast({
        title: "Error",
        description: "Failed to send swap request",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request a Swap</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Item they want */}
          <div>
            <h3 className="font-medium mb-2">Item you want:</h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={post.imageUrl || `/placeholder.svg?height=80&width=80`}
                    alt={post.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{post.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <Badge variant="secondary">{post.condition}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Select item to offer */}
          <div>
            <h3 className="font-medium mb-2">Select an item to offer:</h3>
            {loadingPosts ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            ) : userPosts.length === 0 ? (
              <Card>
                <CardContent className="p-4 text-center text-gray-500">
                  <p>You don't have any items posted yet.</p>
                  <p className="text-sm">Create a post first to offer items for trade.</p>
                </CardContent>
              </Card>
            ) : (
              <Select value={selectedPostId} onValueChange={setSelectedPostId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an item to offer" />
                </SelectTrigger>
                <SelectContent>
                  {userPosts.map((userPost) => (
                    <SelectItem key={userPost.id} value={userPost.id!}>
                      <div className="flex items-center gap-2">
                        <img
                          src={userPost.imageUrl || `/placeholder.svg?height=24&width=24`}
                          alt={userPost.title}
                          className="w-6 h-6 object-cover rounded"
                        />
                        <span>{userPost.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {selectedPostId && (
              <Card className="mt-2">
                <CardContent className="p-4">
                  {(() => {
                    const selectedPost = userPosts.find((p) => p.id === selectedPostId)
                    return selectedPost ? (
                      <div className="flex gap-4">
                        <img
                          src={selectedPost.imageUrl || `/placeholder.svg?height=80&width=80`}
                          alt={selectedPost.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{selectedPost.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{selectedPost.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{selectedPost.category}</Badge>
                            <Badge variant="secondary">{selectedPost.condition}</Badge>
                          </div>
                        </div>
                      </div>
                    ) : null
                  })()}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Message */}
          <div>
            <h3 className="font-medium mb-2">Message:</h3>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message to the seller..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSendSwapRequest}
              disabled={!selectedPostId || !message.trim() || loading || userPosts.length === 0}
            >
              {loading ? "Sending..." : "Send Swap Request"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
