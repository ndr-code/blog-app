import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth, handleApiError } from '@/utils/apiUtils';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ email: string }> }
) {
  const params = await context.params;
  if (!params?.email) {
    return NextResponse.json({ message: 'Missing email' }, { status: 400 });
  }
  const url = `${BASE_URL}/users/by-email/${encodeURIComponent(params.email)}`;
  const res = await fetchWithAuth(url, req);
  if (!res.ok)
    return await handleApiError(res, 'Failed to fetch user by email');
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
