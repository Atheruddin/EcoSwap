import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
  limit,
} from "firebase/firestore"
import { db } from "./firebase"

export interface Message {
  id?: string
  chatId: string
  senderId: string
  senderName: string
  text: string
  timestamp: Date
  read: boolean
}

export interface Chat {
  id?: string
  participants: string[]
  participantNames: { [key: string]: string }
  lastMessage?: string
  lastMessageTime?: Date
  createdAt: Date
}

export async function createOrGetChat(
  userId1: string,
  userId2: string,
  userName1: string,
  userName2: string,
): Promise<string> {
  try {
    if (!db) {
      console.warn("Firestore not initialized")
      return "mock-chat-" + Date.now()
    }

    // Check if chat already exists
    const chatsRef = collection(db, "chats")
    const q = query(chatsRef, where("participants", "array-contains", userId1))
    const querySnapshot = await getDocs(q)

    let existingChatId = null
    querySnapshot.forEach((doc) => {
      const chatData = doc.data()
      if (chatData.participants.includes(userId2)) {
        existingChatId = doc.id
      }
    })

    if (existingChatId) {
      return existingChatId
    }

    // Create new chat
    const chatData: Omit<Chat, "id"> = {
      participants: [userId1, userId2],
      participantNames: {
        [userId1]: userName1,
        [userId2]: userName2,
      },
      createdAt: new Date(),
    }

    const docRef = await addDoc(chatsRef, {
      ...chatData,
      createdAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error) {
    console.error("Error creating/getting chat:", error)
    return "mock-chat-" + Date.now()
  }
}

export async function sendMessage(chatId: string, senderId: string, senderName: string, text: string) {
  try {
    if (!db) {
      console.warn("Firestore not initialized")
      return
    }

    const messageData: Omit<Message, "id"> = {
      chatId,
      senderId,
      senderName,
      text,
      timestamp: new Date(),
      read: false,
    }

    await addDoc(collection(db, "messages"), {
      ...messageData,
      timestamp: serverTimestamp(),
    })

    // Update chat with last message
    const chatRef = doc(db, "chats", chatId)
    await setDoc(
      chatRef,
      {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
      },
      { merge: true },
    )
  } catch (error) {
    console.error("Error sending message:", error)
  }
}

export function subscribeToMessages(chatId: string, callback: (messages: Message[]) => void) {
  if (!db) {
    console.error("[Chat] Firestore not initialized. Check your Firebase environment variables in the Vars section.")
    callback([])
    return () => {}
  }

  try {
    const q = query(collection(db, "messages"), where("chatId", "==", chatId), limit(100))

    return onSnapshot(
      q,
      (querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date(),
        })) as Message[]

        messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        callback(messages)
      },
      (error) => {
        console.error("[Chat] Firestore subscription error:", error)
        callback([])
      },
    )
  } catch (error) {
    console.error("[Chat] Error setting up messages subscription:", error)
    callback([])
    return () => {}
  }
}

export async function getUserChats(userId: string): Promise<Chat[]> {
  try {
    if (!db) {
      console.warn("Firestore not initialized, returning mock data")
      return getMockChats(userId)
    }

    const q = query(collection(db, "chats"), where("participants", "array-contains", userId))
    const querySnapshot = await getDocs(q)

    const chats = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      lastMessageTime: doc.data().lastMessageTime?.toDate(),
    })) as Chat[]

    chats.sort((a, b) => {
      if (!a.lastMessageTime && !b.lastMessageTime) return 0
      if (!a.lastMessageTime) return 1
      if (!b.lastMessageTime) return -1
      return b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
    })

    return chats
  } catch (error) {
    console.error("Error getting user chats:", error)
    return getMockChats(userId)
  }
}

export function subscribeToUserChats(userId: string, callback: (chats: Chat[]) => void) {
  if (!db) {
    console.error("[Chat] Firestore not initialized. Check your Firebase environment variables in the Vars section.")
    callback([])
    return () => {}
  }

  try {
    const q = query(collection(db, "chats"), where("participants", "array-contains", userId))

    return onSnapshot(
      q,
      (querySnapshot) => {
        const chats = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          lastMessageTime: doc.data().lastMessageTime?.toDate(),
        })) as Chat[]

        chats.sort((a, b) => {
          if (!a.lastMessageTime && !b.lastMessageTime) return 0
          if (!a.lastMessageTime) return 1
          if (!b.lastMessageTime) return -1
          return b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
        })

        callback(chats)
      },
      (error) => {
        console.error("[Chat] Firestore chats subscription error:", error)
        callback([])
      },
    )
  } catch (error) {
    console.error("[Chat] Error setting up chats subscription:", error)
    callback([])
    return () => {}
  }
}

// Mock data functions
function getMockChats(userId: string): Chat[] {
  return [
    {
      id: "mock-chat-1",
      participants: [userId, "mock-user-1"],
      participantNames: {
        [userId]: "You",
        "mock-user-1": "Sarah Green",
      },
      lastMessage: "Hi! Is the vintage jacket still available?",
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: "mock-chat-2",
      participants: [userId, "mock-user-2"],
      participantNames: {
        [userId]: "You",
        "mock-user-2": "Mike Eco",
      },
      lastMessage: "Thanks for the trade!",
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
  ]
}

function getMockMessages(chatId: string): Message[] {
  return [
    {
      id: "mock-msg-1",
      chatId,
      senderId: "mock-user-1",
      senderName: "Sarah Green",
      text: "Hi! Is the vintage jacket still available?",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
    },
    {
      id: "mock-msg-2",
      chatId,
      senderId: "current-user",
      senderName: "You",
      text: "Yes, it's still available! Would you like to see more photos?",
      timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: "mock-msg-3",
      chatId,
      senderId: "mock-user-1",
      senderName: "Sarah Green",
      text: "That would be great! Also, what would you like to trade for it?",
      timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
      read: false,
    },
  ]
}
