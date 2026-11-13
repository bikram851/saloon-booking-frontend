import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, Firestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, FirebaseStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, Functions, connectFunctionsEmulator } from "firebase/functions";

// Environment Firebase Credentials
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD-MOCK-API-KEY-SUPER-ADMIN",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "glow-grace-saloon.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "glow-grace-saloon",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "glow-grace-saloon.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456",
};

// Initialize App singleton
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const functions: Functions = getFunctions(app, "us-central1");

// Determine if we're in Emulator Mode
const isEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true";

if (isEmulator && typeof window !== "undefined") {
  try {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
    connectStorageEmulator(storage, "localhost", 9199);
    connectFunctionsEmulator(functions, "localhost", 5001);
    console.log("🛠️ Connected to local Firebase Emulators");
  } catch (err) {
    console.warn("Firebase emulator connection notice:", err);
  }
}
