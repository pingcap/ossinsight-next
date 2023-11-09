import {APIError, DataService} from "@/app/api/queries/[...query]/data-service";
import {endpoints} from "@/app/api/queries/[...query]/endpoints";
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Set preferred Region to make the edge function execute on nodes in the same region of the database.
export const preferredRegion = 'pdx1';

const dataService = new DataService({
  url: process.env.DATABASE_URL
});

export async function GET(req: NextRequest) {
  // Remove prefix.
  const queryName = req.nextUrl.pathname.replaceAll('/api/queries-without-cache-regional/', '');
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

  return NextResponse.json(result);
}
