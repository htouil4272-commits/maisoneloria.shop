import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:8000';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const segments = req.query.path as string[];
  const pathStr = segments.join('/');
  const rawUrl = req.url || '';
  const queryStr = rawUrl.includes('?') ? rawUrl.substring(rawUrl.indexOf('?')) : '';
  const targetUrl = `${BACKEND_URL}/api/${pathStr}${queryStr}`;

  const forwardHeaders: Record<string, string> = {};
  if (req.headers['content-type']) forwardHeaders['content-type'] = req.headers['content-type'] as string;
  if (req.headers['authorization']) forwardHeaders['authorization'] = req.headers['authorization'] as string;
  if (req.headers['cookie']) forwardHeaders['cookie'] = req.headers['cookie'] as string;

  const hasBody = !['GET', 'HEAD'].includes(req.method || 'GET');
  let body: Buffer | undefined;

  if (hasBody) {
    body = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on('data', (chunk: Buffer) => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body: hasBody && body ? body : undefined,
      // @ts-ignore
      duplex: 'half',
      cache: 'no-store',
    });

    const responseBody = await upstream.text();
    const ct = upstream.headers.get('content-type') || 'application/json';

    res.setHeader('Content-Type', ct);
    res.setHeader('Cache-Control', 'no-store');
    res.status(upstream.status).send(responseBody);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[proxy] ${req.method} ${targetUrl} =>`, message);
    res.status(503).json({ detail: 'Backend unavailable', target: targetUrl, error: message });
  }
}
