"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "./firebase"

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  location?: string
  joinedDate: Date
  rating: number
  reviewCount: number
  badges: string[]
  itemsPosted: number
  swapsCompleted: number
  co2Saved: number
  communityRank: number
  ecoPoints: number
  achievements: {
    firstSwap: boolean
    ecoWarrior: boolean
    communityHelper: number
    swapMaster: number
    greenChampion: number
    socialButterfly: number
  }
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase auth is not initialized. Using offline mode.")
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        await loadUserProfile(user.uid)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const loadUserProfile = async (uid: string) => {
    try {
      if (!db) {
        setUserProfile(createMockProfile(uid))
        return
      }

      const userDoc = await getDoc(doc(db, "users", uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        setUserProfile({
          uid,
          email: data.email,
          displayName: data.displayName,
          photoURL: data.photoURL,
          location: data.location || "Downtown District",
          joinedDate: data.joinedDate?.toDate() || new Date(),
          rating: data.rating || 4.8,
          reviewCount: data.reviewCount || 24,
          badges: data.badges || ["Eco Champion", "Top Swapper", "Community Helper"],
          itemsPosted: data.itemsPosted || 23,
          swapsCompleted: data.swapsCompleted || 18,
          co2Saved: data.co2Saved || 12.4,
          communityRank: data.communityRank || 156,
          ecoPoints: data.ecoPoints || 311,
          achievements: {
            firstSwap: data.achievements?.firstSwap || true,
            ecoWarrior: data.achievements?.ecoWarrior || true,
            communityHelper: data.achievements?.communityHelper || 10,
            swapMaster: data.achievements?.swapMaster || 15,
            greenChampion: data.achievements?.greenChampion || 12,
            socialButterfly: data.achievements?.socialButterfly || 67,
          },
        })
      } else {
        setUserProfile(createMockProfile(uid))
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
      setUserProfile(createMockProfile(uid))
    }
  }

  const createMockProfile = (uid: string): UserProfile => ({
    uid,
    email: user?.email || "user@example.com",
    displayName: user?.displayName || "EcoSwap User",
    photoURL: user?.photoURL,
    location: "Downtown District",
    joinedDate: new Date("2024-03-01"),
    rating: 4.8,
    reviewCount: 24,
    badges: ["Eco Champion", "Top Swapper", "Community Helper"],
    itemsPosted: 23,
    swapsCompleted: 18,
    co2Saved: 12.4,
    communityRank: 156,
    ecoPoints: 311,
    achievements: {
      firstSwap: true,
      ecoWarrior: true,
      communityHelper: 10,
      swapMaster: 15,
      greenChampion: 12,
      socialButterfly: 67,
    },
  })

  const signIn = async (email: string, password: string) => {
    try {
      if (!auth) {
        throw new Error("Firebase auth is not initialized. Please check your environment variables.")
      }
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      if (!auth) {
        throw new Error("Firebase auth is not initialized. Please check your environment variables.")
      }
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, { displayName })

      if (db) {
        await setDoc(doc(db, "users", user.uid), {
          email,
          displayName,
          joinedDate: serverTimestamp(),
          rating: 0,
          reviewCount: 0,
          badges: [],
          itemsPosted: 0,
          swapsCompleted: 0,
          co2Saved: 0,
          communityRank: 999,
          ecoPoints: 0,
          achievements: {
            firstSwap: false,
            ecoWarrior: false,
            communityHelper: 0,
            swapMaster: 0,
            greenChampion: 0,
            socialButterfly: 0,
          },
        })
      }
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      if (!auth) {
        throw new Error("Firebase auth is not initialized. Please check your environment variables.")
      }
      const provider = new GoogleAuthProvider()
      const { user } = await signInWithPopup(auth, provider)

      if (db) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (!userDoc.exists()) {
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            joinedDate: serverTimestamp(),
            rating: 0,
            reviewCount: 0,
            badges: [],
            itemsPosted: 0,
            swapsCompleted: 0,
            co2Saved: 0,
            communityRank: 999,
            ecoPoints: 0,
            achievements: {
              firstSwap: false,
              ecoWarrior: false,
              communityHelper: 0,
              swapMaster: 0,
              greenChampion: 0,
              socialButterfly: 0,
            },
          })
        }
      }
    } catch (error) {
      console.error("Google sign in error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      if (!auth) {
        return
      }
      await signOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return

    try {
      if (db) {
        await updateDoc(doc(db, "users", user.uid), updates)
        await loadUserProfile(user.uid)
      }
    } catch (error) {
      console.error("Error updating user profile:", error)
      throw error
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    updateUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
