import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore"
import { db } from "./firebase"

export interface Post {
  id?: string
  userId: string
  userName: string
  userEmail: string
  userDisplayName: string
  title: string
  description: string
  category: string
  condition: string
  images: string[]
  imageUrl?: string
  location: string
  createdAt: Date
  updatedAt: Date
  status: "available" | "pending" | "swapped"
  interestedUsers?: string[]
  ecoFriendly?: boolean
}

export async function createPost(postData: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<string> {
  try {
    if (!db) throw new Error("Firestore not initialized")

    const docRef = await addDoc(collection(db, "posts"), {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error) {
    console.error("Error creating post:", error)
    throw error
  }
}

export async function getPosts(): Promise<Post[]> {
  try {
    if (!db) {
      console.warn("Firestore not initialized, returning mock data")
      return getMockPosts()
    }

    const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(postsQuery)

    const posts: Post[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      posts.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Post)
    })

    return posts
  } catch (error) {
    console.error("Error fetching posts:", error)
    return getMockPosts()
  }
}

export async function getUserPosts(userId: string): Promise<Post[]> {
  try {
    if (!db) {
      console.warn("Firestore not initialized, returning mock data")
      return getMockUserPosts(userId)
    }

    const postsQuery = query(collection(db, "posts"), where("userId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(postsQuery)

    const posts: Post[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      posts.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Post)
    })

    return posts
  } catch (error) {
    console.error("Error fetching user posts:", error)
    return getMockUserPosts(userId)
  }
}

export function subscribeToPosts(callback: (posts: Post[]) => void): () => void {
  try {
    if (!db) {
      console.warn("Firestore not initialized, using mock data")
      callback(getMockPosts())
      return () => {}
    }

    const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"))

    return onSnapshot(
      postsQuery,
      (querySnapshot) => {
        const posts: Post[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          posts.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Post)
        })
        callback(posts)
      },
      (error) => {
        console.error("Error in posts subscription:", error)
        callback(getMockPosts())
      },
    )
  } catch (error) {
    console.error("Error setting up posts subscription:", error)
    callback(getMockPosts())
    return () => {}
  }
}

export function subscribeToUserPosts(userId: string, callback: (posts: Post[]) => void): () => void {
  try {
    if (!db) {
      console.warn("Firestore not initialized, using mock data")
      callback(getMockUserPosts(userId))
      return () => {}
    }

    const postsQuery = query(collection(db, "posts"), where("userId", "==", userId), orderBy("createdAt", "desc"))

    return onSnapshot(
      postsQuery,
      (querySnapshot) => {
        const posts: Post[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          posts.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Post)
        })
        callback(posts)
      },
      (error) => {
        console.error("Error in user posts subscription:", error)
        callback(getMockUserPosts(userId))
      },
    )
  } catch (error) {
    console.error("Error setting up user posts subscription:", error)
    callback(getMockUserPosts(userId))
    return () => {}
  }
}

export async function deletePost(postId: string): Promise<void> {
  try {
    if (!db) throw new Error("Firestore not initialized")

    await deleteDoc(doc(db, "posts", postId))
  } catch (error) {
    console.error("Error deleting post:", error)
    throw error
  }
}

export async function updatePost(postId: string, updates: Partial<Post>): Promise<void> {
  try {
    if (!db) throw new Error("Firestore not initialized")

    await updateDoc(doc(db, "posts", postId), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating post:", error)
    throw error
  }
}

// Mock data functions for fallback
function getMockPosts(): Post[] {
  return [
    {
      id: "mock-1",
      userId: "mock-user-1",
      userName: "Sarah Green",
      userEmail: "sarah@example.com",
      userDisplayName: "Sarah Green",
      title: "Vintage Denim Jacket",
      description: "Classic vintage denim jacket in excellent condition. Perfect for sustainable fashion lovers!",
      category: "Clothing",
      condition: "good",
      images: ["/images/vintage-denim-jacket.jpg"],
      imageUrl: "/images/vintage-denim-jacket.jpg",
      location: "Downtown",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "available",
      interestedUsers: [],
      ecoFriendly: true,
    },
    {
      id: "mock-2",
      userId: "mock-user-2",
      userName: "Mike Eco",
      userEmail: "mike@example.com",
      userDisplayName: "Mike Eco",
      title: "Programming Books Collection",
      description: "Collection of programming books including JavaScript, React, and Node.js. Great for developers!",
      category: "Books",
      condition: "like-new",
      images: ["/images/programming-books.jpg"],
      imageUrl: "/images/programming-books.jpg",
      location: "Tech District",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: "available",
      interestedUsers: [],
      ecoFriendly: false,
    },
    {
      id: "mock-3",
      userId: "mock-user-3",
      userName: "Emma Sustainable",
      userEmail: "emma@example.com",
      userDisplayName: "Emma Sustainable",
      title: "Handmade Ceramic Vase",
      description: "Beautiful handmade ceramic vase, perfect for home decoration. Made with eco-friendly materials.",
      category: "Home & Garden",
      condition: "new",
      images: ["/images/ceramic-vase.jpg"],
      imageUrl: "/images/ceramic-vase.jpg",
      location: "Arts Quarter",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "available",
      interestedUsers: [],
      ecoFriendly: true,
    },
  ]
}

function getMockUserPosts(userId: string): Post[] {
  return [
    {
      id: "user-mock-1",
      userId: userId,
      userName: "You",
      userEmail: "you@example.com",
      userDisplayName: "You",
      title: "Vintage Camera",
      description: "Classic film camera in working condition. Perfect for photography enthusiasts!",
      category: "Electronics",
      condition: "good",
      images: ["/images/vintage-cameras.jpg"],
      imageUrl: "/images/vintage-cameras.jpg",
      location: "Your Location",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      status: "available",
      interestedUsers: [],
      ecoFriendly: false,
    },
    {
      id: "user-mock-2",
      userId: userId,
      userName: "You",
      userEmail: "you@example.com",
      userDisplayName: "You",
      title: "Organic Cotton T-Shirt",
      description: "Soft organic cotton t-shirt, barely worn. Sustainable fashion choice!",
      category: "Clothing",
      condition: "like-new",
      images: ["/images/organic-cotton-tshirt.jpg"],
      imageUrl: "/images/organic-cotton-tshirt.jpg",
      location: "Your Location",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "available",
      interestedUsers: [],
      ecoFriendly: true,
    },
  ]
}
