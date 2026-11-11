/**
 * Glow & Grace — Notification Service Worker
 * sw-notifications.js  (served from project root / public folder)
 *
 * Receives a list of scheduled notifications from the main thread,
 * stores them in SW cache, and fires them at the right time using
 * a periodic check via setInterval inside the SW.
 */

const STORAGE_KEY = "gg_scheduled_notifs";

let scheduledNotifs = [];
let checkInterval = null;

/** Re-arm the check loop */
function startCheckLoop() {
  if (checkInterval) return;
  checkInterval = setInterval(fireReadyNotifs, 15_000); // check every 15 s
}

function fireReadyNotifs() {
  const now = Date.now();
  scheduledNotifs = scheduledNotifs.filter((n) => {
    if (n.fireAt <= now) {
      self.registration.showNotification(n.title, {
        body: n.body,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        tag: n.tag,
        requireInteraction: true,
        data: { tag: n.tag },
      });
      return false; // remove after firing
    }
    return true;
  });

  // Stop loop if nothing left to fire
  if (scheduledNotifs.length === 0 && checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
}

// ─── Message handler ────────────────────────────────────────────────────────
self.addEventListener("message", (event) => {
  if (event.data?.type === "SYNC_NOTIFS") {
    scheduledNotifs = Array.isArray(event.data.notifs) ? event.data.notifs : [];
    if (scheduledNotifs.length > 0) {
      startCheckLoop();
      // Fire immediately in case some are already due
      fireReadyNotifs();
    } else if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
  }
});

// ─── Notification click: focus or open the app ──────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes("/appointments") && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow("/appointments");
        }
      })
  );
});

// ─── Activate: claim clients immediately ────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
