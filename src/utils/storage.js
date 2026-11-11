export function getStoredItem(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function setStoredItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeStoredItem(key) {
  localStorage.removeItem(key);
}

export function getUser() {
  return getStoredItem("gg_user");
}
