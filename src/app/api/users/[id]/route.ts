import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/apiUtils';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getHandler(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  if (!params?.id) {
    return NextResponse.json({ message: 'Missing user id' }, { status: 400 });
  }
  const res = await fetchWithAuth(`${BASE_URL}/users/${params.id}`, req);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export const GET = getHandler;
