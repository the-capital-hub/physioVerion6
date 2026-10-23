const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

function getAuthToken() {
  // Match the token keys used by the existing Rehabics frontend.
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("rehabics_token") ||
    ""
  );
}

export async function sendAIMessage(message) {
  const trimmedMessage = String(message || "").trim();

  if (!trimmedMessage) {
    throw new Error("Please enter a message.");
  }

  if (trimmedMessage.length > 2000) {
    throw new Error("Message must be 2000 characters or fewer.");
  }

  const token = getAuthToken();
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({ message: trimmedMessage }),
    });
  } catch {
    throw new Error(
      "Backend se connection nahi ho pa raha. Backend server aur API URL check karo."
    );
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload.message ||
        (response.status === 503
          ? "AI service configured nahi hai. Backend .env mein GEMINI_API_KEY check karo."
          : "AI reply nahi kar pa raha. Thodi der baad dobara try karo.")
    );
  }

  if (typeof payload.reply !== "string" || !payload.reply.trim()) {
    throw new Error("Backend se valid AI response nahi mila.");
  }

  return payload.reply.trim();
}
