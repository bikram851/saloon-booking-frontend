import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from "firebase/app-check";
import { app } from "./config";

let appCheckInstance: AppCheck | null = null;

export function initAppCheck(): AppCheck | null {
  if (typeof window === "undefined") return null;
  if (appCheckInstance) return appCheckInstance;

  const appCheckKey = import.meta.env.VITE_FIREBASE_APP_CHECK_KEY;

  try {
    // In local development, enable self-attestation debug token
    if (import.meta.env.DEV) {
      // @ts-ignore
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    if (appCheckKey) {
      appCheckInstance = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(appCheckKey),
        isTokenAutoRefreshEnabled: true,
      });
      console.log("🛡️ Firebase App Check initialized successfully");
    } else {
      console.info("ℹ️ Firebase App Check key omitted for local/preview environment");
    }
  } catch (err) {
    console.warn("Firebase App Check initialization notice:", err);
  }

  return appCheckInstance;
}
