// NOTE:
// Endpoint ini hanya untuk mengambil/mengupdate profile user yang sedang login (butuh auth).
// Untuk menampilkan profile user lain (public), gunakan route: /api/users/[id]/route.ts
// Jadi, GET di sini memang seharusnya requireAuth: true.
// Jika ingin menampilkan profile user lain tanpa login, gunakan endpoint /api/users/[id].

import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth, handleApiError } from '@/utils/apiUtils';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest) {
  const res = await fetchWithAuth(`${BASE_URL}/users/profile`, req, {
    method: 'GET',
  });
  if (!res.ok) return await handleApiError(res, 'Failed to fetch user profile');
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(req: NextRequest) {
  const formData = await req.formData();
  const res = await fetchWithAuth(`${BASE_URL}/users/profile`, req, {
    method: 'PATCH',
    body: formData,
  });
  if (!res.ok)
    return await handleApiError(res, 'Failed to update user profile');
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
