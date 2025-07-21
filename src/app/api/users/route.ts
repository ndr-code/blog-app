import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/apiUtils';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Handles GET for /users/by-email/{email} and /users/{id} via query params, PATCH for /users/profile and /users/password
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');
    let url = '';
    if (email) {
      url = `${BASE_URL}/users/by-email/${encodeURIComponent(email)}`;
    } else if (id) {
      url = `${BASE_URL}/users/${id}`;
    } else {
      return NextResponse.json(
        { message: 'Missing email or id' },
        { status: 400 }
      );
    }
    const res = await fetchWithAuth(url, req);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: unknown) {
    let message = 'Internal server error';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'profile' or 'password'
    let endpoint = '';
    let headers: Record<string, string> = {};
    let body: FormData | string | undefined;
    if (type === 'profile') {
      endpoint = '/users/profile';
      headers = { Authorization: req.headers.get('authorization') || '' };
      body = await req.formData();
    } else if (type === 'password') {
      endpoint = '/users/password';
      headers = {
        Authorization: req.headers.get('authorization') || '',
        'Content-Type': 'application/json',
      };
      body = JSON.stringify(await req.json());
    } else {
      return NextResponse.json(
        { message: 'Invalid patch type' },
        { status: 400 }
      );
    }
    const res = await fetchWithAuth(`${BASE_URL}${endpoint}`, req, {
      method: 'PATCH',
      headers,
      body,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: unknown) {
    let message = 'Internal server error';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
