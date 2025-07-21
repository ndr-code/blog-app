'use client';
import { useEffect, useState } from 'react';
import { PostCard } from '../ui/PostCard';
import { motion } from 'framer-motion';
import { Pagination } from '../ui/Pagination';
import { CommentDialog } from '../ui/CommentDialog';
import { usePosts, useMostLikedPosts } from '@/hooks/usePosts';
import { useCommentDialog } from '@/context/CommentContext';
import { Post } from '@/interfaces/post.interface';

const POSTS_PER_PAGE = 5;
const MOST_LIKED_LIMIT = 3;

interface HomeViewProps {
  initialPosts: Post[];
  initialMostLikedPosts: Post[];
  initialTotalPages: number;
}

export default function HomeView({
  initialPosts,
  initialMostLikedPosts,
  initialTotalPages,
}: HomeViewProps) {
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>(
    {}
  );
  const {
    posts: recommended,
    currentPage,
    totalPages,
    loading,
    goToPage,
    fetchPosts,
    setPosts,
    setTotalPages,
  } = usePosts({ limit: POSTS_PER_PAGE, autoFetch: false });

  const {
    posts: mostLiked,
    loading: loadingMostLiked,
    fetchMostLikedPosts,
    setPosts: setMostLikedPosts,
  } = useMostLikedPosts(MOST_LIKED_LIMIT);

  const { open, postId, closeModal } = useCommentDialog();

  useEffect(() => {
    setPosts(initialPosts);
    setTotalPages(initialTotalPages);
    setMostLikedPosts(initialMostLikedPosts);
  }, [
    initialPosts,
    initialTotalPages,
    initialMostLikedPosts,
    setPosts,
    setTotalPages,
    setMostLikedPosts,
  ]);

  useEffect(() => {
    async function fetchCommentCounts(posts: Post[]) {
      const counts: Record<number, number> = {};
      await Promise.all(
        posts.map(async (post) => {
          try {
            const res = await fetch(`/api/comments/${post.id}`);
            const comments = await res.json();
            counts[post.id] = Array.isArray(comments) ? comments.length : 0;
          } catch {
            counts[post.id] = 0;
          }
        })
      );
      return counts;
    }

    async function batchFetchAllCommentCounts() {
      const recommendedCounts = await fetchCommentCounts(recommended);
      const mostLikedCounts = await fetchCommentCounts(mostLiked);
      setCommentCounts({ ...recommendedCounts, ...mostLikedCounts });
    }

    if (recommended.length > 0 || mostLiked.length > 0) {
      batchFetchAllCommentCounts();
    }
  }, [recommended, mostLiked]);

  useEffect(() => {
    if (initialMostLikedPosts.length === 0) {
      fetchMostLikedPosts();
    }
  }, [fetchMostLikedPosts, initialMostLikedPosts.length]);

  const handlePageChange = (page: number) => {
    goToPage(page);
    fetchPosts(page);
  };

  return (
    <main
      className='container mx-auto px-4 py-1'
      role='main'
      aria-label='Home main content'
    >
      <div className='grid grid-cols-1 md:grid-cols-12 gap-8 relative'>
        <div className='md:col-span-8 flex flex-col items-center w-full min-w-0 md:min-h-[80vh] md:flex-col md:justify-between'>
          <h2
            className='text-2xl font-bold mb-8 self-start'
            tabIndex={0}
            aria-label='Recommended For You'
          >
            Recommend For You
          </h2>

          <div className='w-full min-h-[400px]'>
            {loading ? (
              <div className='text-center py-16 text-gray-400'>Loading...</div>
            ) : recommended.length === 0 ? (
              <div className='text-center py-16 text-gray-400'>
                No posts found.
              </div>
            ) : (
              recommended.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <PostCard
                    post={post}
                    commentCount={commentCounts[post.id] ?? 0}
                    aria-label={`Recommended post: ${post.title}`}
                  />
                  {index !== recommended.length - 1 && (
                    <div
                      className='mt-4 mb-4 border-b border-gray-300 w-full'
                      role='separator'
                      aria-label='Post divider'
                    />
                  )}
                </motion.div>
              ))
            )}
          </div>
          <div className='w-full mt-8 md:mt-auto'>
            <Pagination
              current={currentPage}
              total={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
        <div className='md:col-span-4 relative z-10 w-full min-w-0 md:border-l md:border-[#D5D7DA] md:pl-8'>
          <div className='bg-transparent md:sticky md:top-8'>
            <h2
              className='text-2xl font-bold mb-8'
              tabIndex={0}
              aria-label='Most Liked Posts'
            >
              Most Liked
            </h2>
            <div className='flex flex-col gap-5'>
              {loadingMostLiked ? (
                <div className='text-center py-8 text-gray-400'>Loading...</div>
              ) : mostLiked.length === 0 ? (
                <div className='text-center py-8 text-gray-400'>
                  No posts found.
                </div>
              ) : (
                mostLiked.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <PostCard
                      post={post}
                      commentCount={commentCounts[post.id] ?? 0}
                      isSmall={true}
                      aria-label={`Most liked post: ${post.title}`}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <CommentDialog postId={postId || ''} open={open} onClose={closeModal} />
    </main>
  );
}
