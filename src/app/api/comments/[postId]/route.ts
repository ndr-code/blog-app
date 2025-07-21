import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth, handleApiError } from '@/utils/apiUtils';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const params = await context.params;
  if (!params.postId) {
    return NextResponse.json({ message: 'Missing postId' }, { status: 400 });
  }
  const res = await fetchWithAuth(`${BASE_URL}/comments/${params.postId}`, req);
  if (!res.ok) return await handleApiError(res, 'Failed to fetch comments');
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const params = await context.params;
  if (!params.postId) {
    return NextResponse.json({ message: 'Missing postId' }, { status: 400 });
  }
  const body = await req.json();
  const res = await fetchWithAuth(
    `${BASE_URL}/comments/${params.postId}`,
    req,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) return await handleApiError(res, 'Failed to create comment');
  const data = await res.json();
  let comment = data;
  if (data && Array.isArray(data.data) && data.data.length > 0) {
    comment = data.data[0];
  } else if (data && data.data) {
    comment = data.data;
  }
  return NextResponse.json(comment, { status: res.status });
}
