import { NextRequest, NextResponse } from 'next/server';

/**
 * Helper for SSR fetch with headers (not NextRequest)
 */
export async function fetchWithAuthHeaders(
  url: string,
  token?: string,
  options?: RequestInit
) {
  const headers = {
    ...(options?.headers || {}),
    ...(token
      ? {
          Authorization: token.startsWith('Bearer ')
            ? token
            : `Bearer ${token}`,
        }
      : {}),
  };
  return fetch(url, { ...options, headers });
}

/**
 * Helper untuk fetch ke backend dengan Authorization header dari NextRequest
 */
export async function fetchWithAuth(
  url: string,
  req: NextRequest,
  options: RequestInit = {}
) {
  const token = req.headers.get('authorization');
  return fetch(url, {
    ...options,
    headers: {
      ...(token ? { Authorization: token } : {}),
      ...(options.headers || {}),
    },
  });
}

/**
 * Helper untuk error handling response dari backend
 */
export async function handleApiError(res: Response, defaultMsg: string) {
  let errorData: Record<string, unknown> = {};
  try {
    errorData = await res.json();
  } catch {}
  return NextResponse.json(
    { message: errorData.message || defaultMsg },
    { status: res.status }
  );
}

/**
 * API Interceptor: fetch wrapper with error handling and optional token
 */
export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers = {
    ...(options.headers || {}),
    ...(token
      ? {
          Authorization: token.startsWith('Bearer ')
            ? token
            : `Bearer ${token}`,
        }
      : {}),
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let errorData: Record<string, unknown> = {};
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    throw new Error(
      typeof errorData.message === 'string' ? errorData.message : 'API Error'
    );
  }
  return response.json();
}
