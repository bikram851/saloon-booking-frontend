/**
 * Appointment Push Notification Utility
 * ─────────────────────────────────────
 * Handles:
 *  1. Requesting browser notification permission
 *  2. Scheduling a notification 30 minutes before each upcoming appointment
 *  3. Registering a Service Worker for background push (when tab is not active)
 *  4. Storing scheduled notification metadata in localStorage so the SW can
 *     re-arm itself after a page refresh
 */

const NOTIF_LEAD_MS = 30 * 60 * 1000; // 30 minutes in ms
const STORAGE_KEY = "gg_scheduled_notifs";

/** Request permission once; returns true if granted */
export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

/** Register the service worker (best-effort) */
export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register("/sw-notifications.js", {
      scope: "/",
    });
    return reg;
  } catch (e) {
    console.warn("[GG] SW registration failed:", e);
    return null;
  }
}

/**
 * Schedule a browser notification 30 min before `apptTimestamp`.
 * Uses setTimeout while the tab is open, and also persists to localStorage
 * so the service worker can fire it if the tab is closed.
 *
 * @param {object} appt  - appointment object with { id, name, role, dateTime, apptTimestamp }
 * @param {Map}    timers - mutable Map<id, timeoutId> maintained by the caller
 */
export function scheduleApptNotification(appt, timers) {
  if (!appt?.apptTimestamp) return;

  const fireAt = appt.apptTimestamp - NOTIF_LEAD_MS;
  const delay = fireAt - Date.now();

  // Already past the 30-min window → skip
  if (delay <= 0) return;

  // Clear any existing timer for this appointment
  if (timers.has(appt.id)) {
    clearTimeout(timers.get(appt.id));
  }

  // In-tab setTimeout notification
  const tid = setTimeout(() => {
    if (Notification.permission === "granted") {
      new Notification("Glow & Grace — Appointment Reminder 💇", {
        body: `Your appointment with ${appt.name} (${appt.role}) starts in 30 minutes.`,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        tag: `appt-reminder-${appt.id}`,
        requireInteraction: true,
      });
    }
    timers.delete(appt.id);
  }, delay);

  timers.set(appt.id, tid);

  // Persist to localStorage so the SW can also fire it
  persistScheduledNotif(appt, fireAt);
}

/** Cancel a previously scheduled notification */
export function cancelApptNotification(apptId, timers) {
  if (timers.has(apptId)) {
    clearTimeout(timers.get(apptId));
    timers.delete(apptId);
  }
  removePersistedNotif(apptId);
}

/** Cancel all scheduled notifications */
export function cancelAllNotifications(timers) {
  timers.forEach((tid) => clearTimeout(tid));
  timers.clear();
  localStorage.removeItem(STORAGE_KEY);
}

// ─── Persistence helpers ───────────────────────────────────────────────────

function readPersistedNotifs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function persistScheduledNotif(appt, fireAt) {
  const list = readPersistedNotifs().filter((n) => n.id !== appt.id);
  list.push({
    id: appt.id,
    fireAt,
    title: "Glow & Grace — Appointment Reminder 💇",
    body: `Your appointment with ${appt.name} (${appt.role}) starts in 30 minutes.`,
    tag: `appt-reminder-${appt.id}`,
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    // Notify SW to sync its alarm list
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SYNC_NOTIFS",
        notifs: list,
      });
    }
  } catch {}
}

function removePersistedNotif(apptId) {
  const list = readPersistedNotifs().filter((n) => n.id !== apptId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SYNC_NOTIFS",
        notifs: list,
      });
    }
  } catch {}
}

/**
 * Schedule notifications for all upcoming (future) appointments at once.
 * Call this whenever the appointments list changes.
 */
export function syncAllNotifications(appointments, timers) {
  const now = Date.now();
  // Cancel timers for appointments that no longer exist or are past the window
  timers.forEach((_, id) => {
    const still = appointments.find((a) => a.id === id);
    if (!still || (still.apptTimestamp && still.apptTimestamp - NOTIF_LEAD_MS <= now)) {
      cancelApptNotification(id, timers);
    }
  });

  // Schedule for all upcoming appointments
  appointments.forEach((appt) => {
    const s = String(appt.status || "").toUpperCase();
    const isCancelled = s === "CANCELLED" || s === "CANCELED";
    if (isCancelled) return;
    if (!appt.apptTimestamp || appt.apptTimestamp < now) return;
    scheduleApptNotification(appt, timers);
  });
}
