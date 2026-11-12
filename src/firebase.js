/**
 * Firebase Client & Backend Handshake Configuration
 * Glow & Grace Salon Booking Platform
 */

// Determine the active Firebase Backend API URL
export function getFirebaseApiUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, "");
  }

  // If in local development, check standard Firebase emulator or local server ports
  if (import.meta.env.DEV) {
    // Default to local Firebase Functions Emulator or standalone Express server
    return "http://localhost:8080/api";
  }

  // Production Firebase Cloud Functions URL for Glow & Grace
  return "https://us-central1-glow-grace-saloon.cloudfunctions.net/api";
}

export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "glow-grace-saloon.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "glow-grace-saloon",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "glow-grace-saloon.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

let cachedHandshakeStatus = null;

/**
 * Performs a handshake verification against the Firebase Cloud Functions backend.
 * Checks the /health endpoint and returns connection status with latency.
 */
export async function testFirebaseHandshake() {
  const apiUrl = getFirebaseApiUrl();
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${apiUrl}/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      const latency = Date.now() - startTime;
      cachedHandshakeStatus = {
        connected: true,
        service: data.service || "Glow & Grace Salon Firebase Backend",
        timestamp: data.timestamp || new Date().toISOString(),
        latency,
        apiUrl,
      };
    } else {
      cachedHandshakeStatus = {
        connected: false,
        error: `HTTP ${res.status}: Handshake response rejected`,
        apiUrl,
      };
    }
  } catch (err) {
    cachedHandshakeStatus = {
      connected: false,
      error: err.name === "AbortError" ? "Handshake timed out (4s)" : (err.message || "Failed to reach Firebase backend"),
      apiUrl,
    };
  }

  // Dispatch status event for UI listeners
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("gg-firebase-status", { detail: cachedHandshakeStatus })
    );
  }

  return cachedHandshakeStatus;
}

export function getCachedHandshakeStatus() {
  return cachedHandshakeStatus;
}
