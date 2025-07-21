import HomeView from '@/components/pages/HomeView';
import { cookies } from 'next/headers';
import { fetchWithAuthHeaders } from '@/utils/apiUtils';

export const revalidate = 60;

async function fetchHomeData(token?: string) {
  const [postsRes, mostLikedRes] = await Promise.all([
    fetchWithAuthHeaders(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL || ''
      }/posts/recommended?page=1&limit=5`,
      token
    ),
    fetchWithAuthHeaders(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/posts/most-liked?limit=3`,
      token
    ),
  ]);
  const postsData = await postsRes.json();
  const mostLikedData = await mostLikedRes.json();
  return { postsData, mostLikedData };
}

export default async function HomePage() {
  let initialPosts = [];
  let initialMostLikedPosts = [];
  let initialTotalPages = 1;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const { postsData, mostLikedData } = await fetchHomeData(token);
    initialPosts = postsData.data || [];
    initialMostLikedPosts = mostLikedData.data || [];
    initialTotalPages = postsData.lastPage || 1;
  } catch {}
  return (
    <div className='flex flex-col min-h-screen bg-neutral-25'>
      <main className='flex-1 mt-6'>
        <HomeView
          initialPosts={initialPosts}
          initialMostLikedPosts={initialMostLikedPosts}
          initialTotalPages={initialTotalPages}
        />
      </main>
    </div>
  );
}
