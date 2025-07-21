import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth, handleApiError } from '@/utils/apiUtils';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  if (!params?.id) {
    return NextResponse.json({ message: 'Missing post id' }, { status: 400 });
  }
  const res = await fetchWithAuth(`${BASE_URL}/posts/${params.id}/like`, req, {
    method: 'POST',
  });
  if (!res.ok) return await handleApiError(res, 'Failed to like post');
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
