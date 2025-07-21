import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/apiUtils';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const url = `${BASE_URL}/posts/recommended?page=${page}&limit=${limit}`;

    const res = await fetchWithAuth(url, req);

    if (!res.ok) {
      const errorData = await res.json();

      return NextResponse.json(
        { message: errorData.message || 'Failed to fetch recommended posts' },
        { status: res.status }
      );
    }
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error: unknown) {
    let message = 'Internal server error';
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ message }, { status: 500 });
  }
}
