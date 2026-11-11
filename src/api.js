export const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function request(path, opts = {}) {
  const token = localStorage.getItem("gg_token");
  const headers = {
    Accept: "application/json",
    ...(opts.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opts.headers || {}),
  };
  let response;
  try {
    response = await fetch(`${API}${path}`, { ...opts, headers });
  } catch {
    throw new Error("Cannot connect to the API. Start the Spring Boot backend on port 8080 and try again.");
  }
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const payload = await response.json();
      message = payload.details ? Object.values(payload.details).join("; ") : (payload.error || payload.message || message);
    } catch {
      try { message = (await response.text()) || message; } catch {}
    }
    if (response.status === 401) {
      localStorage.removeItem("gg_token");
      localStorage.removeItem("gg_user");
    }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("application/json") ? response.json() : response.text();
}
