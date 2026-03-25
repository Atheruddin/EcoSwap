"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getUserPosts, subscribeToUserPosts, type Post } from "@/lib/posts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Package, RefreshCw, Leaf, Trophy, Star, Calendar, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { EditProfileModal } from "@/components/edit-profile-modal"

export default function Dashboard() {
  const { user, userProfile } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)

  useEffect(() => {
    if (!user) return

    const loadUserData = async () => {
      try {
        setLoading(true)
        const userPosts = await getUserPosts(user.uid)
        setPosts(userPosts)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    loadUserData()

    let unsubscribe: (() => void) | undefined
    try {
      unsubscribe = subscribeToUserPosts(user.uid, (updatedPosts) => {
        setPosts(updatedPosts)
      })
    } catch (error) {
      console.error("Error setting up real-time subscription:", error)
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [user])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date)
  }

  const achievements = [
    {
      id: "firstSwap",
      title: "First Swap",
      description: "Complete your first successful swap",
      icon: "🔄",
      unlocked: userProfile?.achievements?.firstSwap || false,
      progress: userProfile?.achievements?.firstSwap ? 1 : 0,
      total: 1,
    },
    {
      id: "ecoWarrior",
      title: "Eco Warrior",
      description: "Save 10kg of CO₂ through swapping",
      icon: "🌱",
      unlocked: (userProfile?.co2Saved || 0) >= 10,
      progress: Math.min(userProfile?.co2Saved || 0, 10),
      total: 10,
    },
    {
      id: "communityHelper",
      title: "Community Helper",
      description: "Help 25 community members",
      icon: "🤝",
      unlocked: (userProfile?.achievements?.communityHelper || 0) >= 25,
      progress: userProfile?.achievements?.communityHelper || 10,
      total: 25,
    },
    {
      id: "swapMaster",
      title: "Swap Master",
      description: "Complete 50 successful swaps",
      icon: "🏆",
      unlocked: (userProfile?.swapsCompleted || 0) >= 50,
      progress: userProfile?.swapsCompleted || 18,
      total: 50,
    },
    {
      id: "greenChampion",
      title: "Green Champion",
      description: "Save 25kg of CO₂",
      icon: "💎",
      unlocked: (userProfile?.co2Saved || 0) >= 25,
      progress: Math.min(userProfile?.co2Saved || 12.4, 25),
      total: 25,
    },
    {
      id: "socialButterfly",
      title: "Social Butterfly",
      description: "Chat with 100 different users",
      icon: "🦋",
      unlocked: (userProfile?.achievements?.socialButterfly || 0) >= 100,
      progress: userProfile?.achievements?.socialButterfly || 67,
      total: 100,
    },
  ]

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-20 md:pb-8 flex items-center justify-center">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading your dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-20 md:pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-emerald-400 mb-2">Dashboard</h1>
              <p className="text-xl text-gray-300">Welcome back, EcoSwapper!</p>
            </div>
            <Button
              onClick={() => setIsEditProfileOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          {/* Profile Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 p-1">
                  <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                    {userProfile?.photoURL ? (
                      <Image
                        src={userProfile.photoURL || "/placeholder.svg"}
                        alt="Profile"
                        width={72}
                        height={72}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-bold">
                          {userProfile?.displayName?.charAt(0) || user?.displayName?.charAt(0) || "U"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {userProfile?.displayName || user?.displayName || "Ahmmad Khan"}
                </h2>
                <div className="flex items-center space-x-4 text-gray-400 mb-3">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {userProfile?.location || "Downtown District"}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {formatDate(userProfile?.joinedDate || new Date("2024-03-01"))}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                    {userProfile?.rating || 4.8} ({userProfile?.reviewCount || 24} reviews)
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-400/30">Eco Champion</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">Top Swapper</Badge>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30">Community Helper</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center">
              <Package className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{posts.length || 23}</div>
              <div className="text-gray-400 text-sm">Items Posted</div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center">
              <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{userProfile?.swapsCompleted || 18}</div>
              <div className="text-gray-400 text-sm">Swaps Completed</div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center">
              <Leaf className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{userProfile?.co2Saved || 12.4}kg</div>
              <div className="text-gray-400 text-sm">CO₂ Saved</div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6 text-center border-2">
              <Trophy className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">#{userProfile?.communityRank || 156}</div>
              <div className="text-gray-400 text-sm">Community Rank</div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{userProfile?.ecoPoints || 311}</div>
              <div className="text-gray-400 text-sm">EcoPoints</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-slate-800/30 rounded-2xl p-1">
            {[
              { id: "overview", label: "Overview", icon: "📊" },
              { id: "achievements", label: "Achievements", icon: "🏆" },
              { id: "history", label: "Swap History", icon: "📋" },
              { id: "activity", label: "Recent Activity", icon: "🔔" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-gray-300">You posted a new item: "Vintage Camera"</span>
                    <span className="text-gray-500 text-sm ml-auto">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Swap completed with @sarah_eco</span>
                    <span className="text-gray-500 text-sm ml-auto">1 day ago</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-300">Achievement unlocked: Community Helper</span>
                    <span className="text-gray-500 text-sm ml-auto">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white">Your Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-6 text-center transition-all duration-300 ${
                      achievement.unlocked
                        ? "border-emerald-500/50 shadow-lg shadow-emerald-500/20"
                        : "border-slate-700/50"
                    }`}
                  >
                    <div className="text-4xl mb-4">{achievement.icon}</div>
                    <h4
                      className={`text-lg font-semibold mb-2 ${
                        achievement.unlocked ? "text-emerald-400" : "text-white"
                      }`}
                    >
                      {achievement.title}
                    </h4>
                    <p className="text-gray-400 text-sm mb-4">{achievement.description}</p>

                    {achievement.unlocked ? (
                      <Badge className="bg-emerald-500 text-white">Unlocked!</Badge>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-xs text-gray-400">
                          Progress: {achievement.progress}/{achievement.total}
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min((achievement.progress / achievement.total) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white">Swap History</h3>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="text-center py-12">
                  <RefreshCw className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                  <h4 className="text-xl font-semibold text-gray-300 mb-2">No swap history yet</h4>
                  <p className="text-gray-400 mb-6">Complete your first swap to see your history here</p>
                  <Link href="/explore">
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Browse Items</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white">Recent Activity</h3>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="space-y-4">
                  {[
                    { action: "Posted new item", item: "Vintage Camera", time: "2 hours ago", type: "post" },
                    { action: "Swap completed", item: "with @sarah_eco", time: "1 day ago", type: "swap" },
                    {
                      action: "Achievement unlocked",
                      item: "Community Helper",
                      time: "3 days ago",
                      type: "achievement",
                    },
                    { action: "Received message", item: "from @mike_green", time: "5 days ago", type: "message" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          activity.type === "post"
                            ? "bg-emerald-400"
                            : activity.type === "swap"
                              ? "bg-blue-400"
                              : activity.type === "achievement"
                                ? "bg-yellow-400"
                                : "bg-purple-400"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <div className="text-white">
                          {activity.action}: {activity.item}
                        </div>
                        <div className="text-gray-400 text-sm">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Edit Profile Modal */}
          <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
        </div>
      </div>
    </ProtectedRoute>
  )
}
