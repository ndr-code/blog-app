import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth, handleApiError } from '@/utils/apiUtils';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id } = params || {};
  if (!id) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }
  const url = `${BASE_URL}/posts/${id}`;
  const res = await fetchWithAuth(url, req);
  if (!res.ok) return await handleApiError(res, 'Failed to fetch post detail');
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const formData = await req.formData();
  const url = `${BASE_URL}/posts/${params.id}`;
  const res = await fetchWithAuth(url, req, {
    method: 'PATCH',
    body: formData,
  });
  if (!res.ok) return await handleApiError(res, 'Failed to update post');
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const url = `${BASE_URL}/posts/${params.id}`;
  const res = await fetchWithAuth(url, req, {
    method: 'DELETE',
  });
  if (!res.ok) return await handleApiError(res, 'Failed to delete post');
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
