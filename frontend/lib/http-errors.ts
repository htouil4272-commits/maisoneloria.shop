/** Parse FastAPI / Starlette error body: { detail: string | { msg }[] | unknown } */
export function formatApiErrorBody(body: unknown, fallback: string): string {
  if (!body || typeof body !== 'object') return fallback;
  const d = (body as { detail?: unknown }).detail;
  if (typeof d === 'string' && d.trim()) return d;
  if (Array.isArray(d) && d.length > 0) {
    const first = d[0] as { msg?: string };
    if (typeof first?.msg === 'string' && first.msg.trim()) return first.msg;
  }
  return fallback;
}
