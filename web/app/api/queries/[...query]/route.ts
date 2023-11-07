import {APIError, DataService} from "@/app/api/queries/[...query]/data-service";
import {endpoints} from "@/app/api/queries/[...query]/endpoints";
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Configure to us-west-2 region, make edge functions close to the database.
export const preferredRegion = ['pdx1'];

const dataService = new DataService({
  url: process.env.DATABASE_URL
});

export async function GET(req: NextRequest) {
  // Remove prefix.
  const queryName = req.nextUrl.pathname.replaceAll('/api/queries/', '');
  const endpoint = endpoints[queryName];
  if (!endpoint) {
    return new Response(JSON.stringify({ message: 'Endpoint not found.' }), {
      status: 404,
    });
  }

  let result;
  try {
    result = await dataService.handleQueryEndpoint(req, endpoint.templateSQL, endpoint.config);
  } catch (err: any) {
    if (err instanceof APIError) {
      return new Response(JSON.stringify({ message: err.message }), {
        status: err.statusCode,
      });
    } else {
      return new Response(JSON.stringify({ message: "Internal Server Error" }), {
        status: 500,
      });
    }
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      'Cache-Control': 'max-age=60',
      'CDN-Cache-Control': 'max-age=300',
      'Vercel-CDN-Cache-Control': 'max-age=3600',
    },
  });
}
