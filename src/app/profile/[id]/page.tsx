import ProfileView from '@/components/pages/ProfileView';
import React from 'react';

export const revalidate = 300; // 5 minutes

// SSG: Pre-generate static pages for active users
export async function generateStaticParams() {
  try {
    // Fetch recent posts to get active user IDs
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/recommended?limit=20`
    );
    const data = await res.json();

    // Extract unique user IDs from post authors
    const userIds =
      data.data?.reduce((acc: string[], post: { author: { id: number } }) => {
        const id = post.author.id.toString();
        if (!acc.includes(id)) {
          acc.push(id);
        }
        return acc;
      }, []) || [];

    return userIds.slice(0, 10).map((id: string) => ({ id }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const awaitedParams = await params;
  return (
    <div className='flex-1 bg-neutral-25'>
      <ProfileView userId={awaitedParams.id} />
    </div>
  );
};

export default ProfilePage;
