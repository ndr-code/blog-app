const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://blogger-wph-api-production.up.railway.app'
).replace(/\/$/, '');

export const getAvatarUrl = (avatarUrl: string | null | undefined): string => {
  if (!avatarUrl) {
    return '';
  }
  if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
    return avatarUrl;
  }

  if (avatarUrl.startsWith('/')) {
    return `${API_BASE_URL}${avatarUrl}`;
  }
  return `${API_BASE_URL}/uploads/${avatarUrl}`;
};
