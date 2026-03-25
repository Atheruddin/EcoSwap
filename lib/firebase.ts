import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const validateFirebaseConfig = () => {
  const requiredFields = ["apiKey", "authDomain", "projectId", "appId"]
  const missingFields = requiredFields.filter((field) => !firebaseConfig[field as keyof typeof firebaseConfig])

  if (missingFields.length > 0) {
    console.error(
      "[Firebase] Missing required environment variables:",
      missingFields.map((field) => `NEXT_PUBLIC_FIREBASE_${field.toUpperCase()}`),
    )
    return false
  }
  return true
}

let app
let auth
let db
let storage

try {
  if (!validateFirebaseConfig()) {
    throw new Error("Firebase configuration incomplete")
  }

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }

  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)

  console.log("[Firebase] ✓ Successfully initialized")
} catch (error) {
  console.error("[Firebase] ✗ Initialization failed:", error instanceof Error ? error.message : error)
  auth = null as any
  db = null as any
  storage = null as any
}

export { app, auth, db, storage }
