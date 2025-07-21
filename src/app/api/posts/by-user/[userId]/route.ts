import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth, handleApiError } from '@/utils/apiUtils';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const params = await context.params;
  if (!params?.userId) {
    return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
  }
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';
  const url = `${BASE_URL}/posts/by-user/${params.userId}?page=${page}&limit=${limit}`;
  const res = await fetchWithAuth(url, req);
  if (!res.ok) return await handleApiError(res, 'Failed to fetch user posts');
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
