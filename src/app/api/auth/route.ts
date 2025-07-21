import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth, handleApiError } from '@/utils/apiUtils';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: NextRequest) {
  const body = await req.json();
  let endpoint = '';
  if (body.type === 'register') {
    endpoint = '/auth/register';
  } else if (body.type === 'login') {
    endpoint = '/auth/login';
  } else {
    return NextResponse.json({ message: 'Invalid auth type' }, { status: 400 });
  }
  // Remove 'type' before forwarding
  const payload = { ...body };
  delete payload.type;

  const res = await fetchWithAuth(`${BASE_URL}${endpoint}`, req, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return await handleApiError(res, 'Failed to authenticate');
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
