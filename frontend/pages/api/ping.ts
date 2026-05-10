export default async function handler(req: any, res: any) {
  const result: any = {
    router: 'pages-api-working',
    time: new Date().toISOString(),
    backend_url: process.env.BACKEND_URL || 'http://backend:8000',
  };

  try {
    const r = await fetch(`${result.backend_url}/api/health`, { cache: 'no-store' });
    result.backend_status = r.status;
    result.backend_body = await r.text();
  } catch (e: any) {
    result.backend_error = e.message;
    result.backend_code = e.code || 'unknown';
  }

  res.status(200).json(result);
}
