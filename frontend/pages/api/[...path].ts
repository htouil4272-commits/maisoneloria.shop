import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:8000';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pathSegments = req.query.path as string[];
  const pathStr = pathSegments.join('/');

  const queryStr = req.url?.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  const targetUrl = `${BACKEND_URL}/api/${pathStr}${queryStr}`;

  const headers: Record<string, string> = {
    'content-type': (req.headers['content-type'] as string) || 'application/json',
  };
  if (req.headers['authorization']) {
    headers['authorization'] = req.headers['authorization'] as string;
  }
  if (req.headers['cookie']) {
    headers['cookie'] = req.headers['cookie'] as string;
  }

  const isBodyMethod = !['GET', 'HEAD'].includes(req.method || 'GET');

  let body: string | undefined;
  if (isBodyMethod) {
    body = await new Promise<string>((resolve) => {
      let data = '';
      req.on('data', (chunk) => { data += chunk; });
      req.on('end', () => resolve(data));
    });
  }

  try {
    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: body || undefined,
      cache: 'no-store',
    });

    const contentType = backendRes.headers.get('content-type') || 'application/json';
    const responseText = await backendRes.text();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.status(backendRes.status).send(responseText);
  } catch (error) {
    console.error(`[Proxy] Backend error for ${targetUrl}:`, error);
    res.status(503).json({ detail: 'Backend service unavailable', url: targetUrl });
  }
}
