/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:8000';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

function readBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const segments = Array.isArray(req.query.path) ? req.query.path : [req.query.path as string];
  const pathStr = segments.join('/');
  const rawUrl: string = req.url || '';
  const qIdx = rawUrl.indexOf('?');
  const queryStr = qIdx >= 0 ? rawUrl.substring(qIdx) : '';
  const targetUrl = `${BACKEND_URL}/api/${pathStr}${queryStr}`;

  const forwardHeaders: Record<string, string> = {};
  const ct = req.headers['content-type'];
  if (ct) forwardHeaders['content-type'] = Array.isArray(ct) ? ct[0] : ct;
  const auth = req.headers['authorization'];
  if (auth) forwardHeaders['authorization'] = Array.isArray(auth) ? auth[0] : auth;
  const cookie = req.headers['cookie'];
  if (cookie) forwardHeaders['cookie'] = Array.isArray(cookie) ? cookie[0] : cookie;

  const method = req.method || 'GET';
  const hasBody = !['GET', 'HEAD'].includes(method);
  let bodyBuffer: Buffer | undefined;
  if (hasBody) {
    bodyBuffer = await readBody(req);
  }

  try {
    const upstream = await fetch(targetUrl, {
      method,
      headers: forwardHeaders,
      body: hasBody && bodyBuffer && bodyBuffer.length > 0 ? bodyBuffer : undefined,
      cache: 'no-store',
    } as any);

    const responseText = await upstream.text();
    const contentType = upstream.headers.get('content-type') ?? 'application/json';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-store');
    res.status(upstream.status).send(responseText);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[proxy] ${method} ${targetUrl} =>`, msg);
    res.status(503).json({ detail: 'Backend unavailable', target: targetUrl, error: msg });
  }
}
