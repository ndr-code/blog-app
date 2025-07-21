import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth, handleApiError } from '@/utils/apiUtils';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';
  const url = `${BASE_URL}/posts?page=${page}&limit=${limit}`;
  const res = await fetchWithAuth(url, req);
  if (!res.ok) return await handleApiError(res, 'Failed to fetch posts');
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const res = await fetchWithAuth(`${BASE_URL}/posts`, req, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) return await handleApiError(res, 'Failed to create post');
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
