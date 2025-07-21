const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://blogger-wph-api-production.up.railway.app'
).replace(/\/$/, '');

export const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) {
    return '/image-post.png';
  }
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  if (imageUrl.startsWith('/')) {
    return `${API_BASE_URL}${imageUrl}`;
  }
  return `${API_BASE_URL}/uploads/${imageUrl}`;
};
