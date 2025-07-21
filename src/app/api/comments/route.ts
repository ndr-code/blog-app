import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth, handleApiError } from '@/utils/apiUtils';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Handles GET and POST for /comments/{postId} via query param
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');
  if (!postId) {
    return NextResponse.json({ message: 'Missing postId' }, { status: 400 });
  }
  const res = await fetchWithAuth(`${BASE_URL}/comments/${postId}`, req);
  if (!res.ok) return await handleApiError(res, 'Failed to fetch comments');
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');
  if (!postId) {
    return NextResponse.json({ message: 'Missing postId' }, { status: 400 });
  }
  const body = await req.json();
  const res = await fetchWithAuth(`${BASE_URL}/comments/${postId}`, req, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) return await handleApiError(res, 'Failed to create comment');
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
