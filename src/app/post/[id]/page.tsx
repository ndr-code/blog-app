import DetailView from '@/components/pages/DetailView';

export const revalidate = 60;

// SSG: Pre-generate static pages for popular posts
export async function generateStaticParams() {
  try {
    // Fetch popular posts to pre-generate
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/most-liked?limit=10`
    );
    const data = await res.json();

    return (
      data.data?.map((post: { id: number }) => ({
        id: post.id.toString(),
      })) || []
    );
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [postRes, commentsRes, mostLikedRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${id}`),
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/comments/${id}`),
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/most-liked?limit=3`),
  ]);

  const post = await postRes.json();
  const comments = await commentsRes.json();
  const mostLikedPosts = await mostLikedRes.json();

  return (
    <div className='flex flex-col min-h-screen bg-neutral-25'>
      <main className='flex-1'>
        <DetailView
          initialPost={post}
          initialComments={comments}
          initialMostLikedPosts={mostLikedPosts.data || []}
        />
      </main>
    </div>
  );
}
