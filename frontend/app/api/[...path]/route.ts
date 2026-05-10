import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:8000';

type Params = { path: string[] };

async function proxyRequest(request: NextRequest, context: { params: Params }) {
  const { path } = context.params;
  const pathStr = path.join('/');
  const search = request.nextUrl.search;
  const targetUrl = `${BACKEND_URL}/api/${pathStr}${search}`;

  const headers: Record<string, string> = {};
  const contentType = request.headers.get('content-type');
  if (contentType) headers['content-type'] = contentType;
  const auth = request.headers.get('authorization');
  if (auth) headers['authorization'] = auth;
  const cookie = request.headers.get('cookie');
  if (cookie) headers['cookie'] = cookie;

  const isBodyMethod = !['GET', 'HEAD'].includes(request.method);
  let body: string | undefined;
  if (isBodyMethod) {
    body = await request.text();
  }

  try {
    const backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: body || undefined,
      cache: 'no-store',
    });

    const responseText = await backendResponse.text();
    const responseHeaders = new Headers();
    const ct = backendResponse.headers.get('content-type');
    if (ct) responseHeaders.set('content-type', ct);
    responseHeaders.set('cache-control', 'no-store, no-cache, must-revalidate');

    return new NextResponse(responseText, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`Backend proxy error for ${targetUrl}:`, error);
    return NextResponse.json(
      { detail: 'Backend service unavailable' },
      { status: 503 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
