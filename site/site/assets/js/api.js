// API client for the MAISON ELORIA backend.
// If API_BASE is empty or unreachable, callers should gracefully fall back
// to WhatsApp-only flow (the cart still works without backend).

export const API_BASE = (() => {
  const host = location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return localStorage.getItem('eloria.apiBase') || 'http://localhost:3000';
  }
  return `https://api.${host.replace(/^www\./, '')}`;
})();

export async function apiFetch(path, opts = {}) {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(API_BASE + path, {
      ...opts,
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
      signal: ctrl.signal
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, data: { error: 'network_error', message: err.message } };
  } finally {
    clearTimeout(timeout);
  }
}

export async function postOrder(payload) {
  return apiFetch('/api/orders', { method: 'POST', body: JSON.stringify(payload) });
}

export async function postNewsletter(payload) {
  return apiFetch('/api/newsletter', { method: 'POST', body: JSON.stringify(payload) });
}

export async function postContact(payload) {
  return apiFetch('/api/contact', { method: 'POST', body: JSON.stringify(payload) });
}
