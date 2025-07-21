import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth, handleApiError } from '@/utils/apiUtils';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const res = await fetchWithAuth(`${BASE_URL}/users/password`, req, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) return await handleApiError(res, 'Failed to update password');
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
