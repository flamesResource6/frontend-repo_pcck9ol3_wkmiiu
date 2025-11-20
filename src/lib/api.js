export const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  if (!res.ok) {
    throw new Error(data?.message || `Request failed: ${res.status}`);
  }
  return data;
}

export const api = {
  news: (lang, limit = 4) => request(`/api/news?${new URLSearchParams({ lang, limit }).toString()}`),
  contact: (payload) => request('/api/contact', { method: 'POST', body: JSON.stringify(payload) }),
  booking: (payload) => request('/api/booking', { method: 'POST', body: JSON.stringify(payload) }),
  horses: () => request('/api/horses'),
  reviews: (lang, limit = 6) => request(`/api/reviews?${new URLSearchParams({ lang, limit }).toString()}`),
};
