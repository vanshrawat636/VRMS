// src/utils/auth.js
// Client authentication helper managing JWT access & refresh tokens with automatic expiry validation.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

let cachedToken = null;

export async function getAuthToken() {
  const storedToken = localStorage.getItem("swipegig_access_token");
  if (storedToken) {
    try {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      // Verify token hasn't expired (with 30-second buffer)
      if (payload.exp && payload.exp * 1000 > Date.now() + 30000) {
        cachedToken = storedToken;
        return storedToken;
      }
    } catch {
      // Malformed or expired token
      localStorage.removeItem("swipegig_access_token");
    }
  }

  // Obtain an agent/session token automatically from the backend
  try {
    const demoEmail = "agent@swipegig.io";
    const demoPassword = "DemoPassword123!";

    let res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: demoEmail, password: demoPassword }),
    });

    if (!res.ok) {
      // If demo user is not yet created, register
      res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: `anon-${Date.now()}@swipegig.io`,
          password: "SecureAgentPassword123!",
        }),
      });
    }

    if (res.ok) {
      const data = await res.json();
      cachedToken = data.access_token;
      localStorage.setItem("swipegig_access_token", data.access_token);
      if (data.refresh_token) {
        localStorage.setItem("swipegig_refresh_token", data.refresh_token);
      }
      return data.access_token;
    }
  } catch (err) {
    console.info("Backend offline or auth unavailable, proceeding with guest/offline mode:", err);
  }

  return null;
}

export function clearAuthToken() {
  cachedToken = null;
  localStorage.removeItem("swipegig_access_token");
  localStorage.removeItem("swipegig_refresh_token");
}
