import { Headers } from 'next/dist/compiled/@edge-runtime/primitives';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function GET (request: NextRequest, { params: { params } }: { params: { params: string[] } }) {
  const pathname = path.join(...params);
  const search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('connection');
  if (request.ip) {
    headers.set('x-forwarded-for', request.ip);
  }

  const resp = await fetch('https://api.ossinsight.io/' + pathname + search, {
    headers: headers,
  });

  return new NextResponse(resp.body, resp);
}