'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { PostCard } from '../ui/PostCard';
import { motion } from 'framer-motion';
import { SearchBar } from '../ui/SearchBar';
import Link from 'next/link';
import { Button } from '../ui/Buttons';
import Image from 'next/image';
import { useSearchPosts } from '@/hooks/usePosts';

const ResultView = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { posts, loading, searchPostsByQuery } = useSearchPosts();
  useEffect(() => {
    if (query) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('searchActive');
      }
      searchPostsByQuery(query);
    }
  }, [query, searchPostsByQuery]);

  return (
    <div
      className='container mx-auto px-4 py-8'
      role='main'
      aria-label='Search results main content'
    >
      <div className='md:hidden mb-8'>
        <SearchBar />
      </div>
      <div className='flex flex-col items-center w-full'>
        <div className='w-full'>
          <h1
            className='text-2xl font-bold mb-4 text-left w-full text-neutral-800 hidden md:block'
            tabIndex={0}
            aria-label={`Search result for ${query}`}
          >
            Result for &quot;{query}&quot;
          </h1>
          {loading ? (
            <div className='text-center py-16 text-gray-400'>Loading...</div>
          ) : posts.length > 0 ? (
            <div
              className='flex flex-col items-center w-full'
              style={{ maxWidth: 807 }}
            >
              {posts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  className='w-full'
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                >
                  <PostCard
                    post={post}
                    aria-label={`Search result post: ${post.title}`}
                  />
                  {idx !== posts.length - 1 && (
                    <div
                      className={`mt-6 mb-6 border-b border-gray-200 w-full min-w-4xl`}
                      role='separator'
                      aria-label='Post divider'
                    />
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-24 rounded-2xl mx-2'>
              <Image
                src='/no-result.svg'
                alt='No result'
                width={160}
                height={160}
                className='mb-8'
                priority
                aria-label='No search result illustration'
                role='img'
              />
              <h2
                className='text-2xl font-semibold mb-3 text-gray-800 tracking-tight'
                tabIndex={0}
                aria-label='No result found'
              >
                No result found
              </h2>
              <p
                className='text-lg text-gray-500 mb-6 text-center max-w-xs'
                aria-label='Try using different keywords'
              >
                Try using different keywords
              </p>
              <Button
                asChild
                variant='primary'
                className='px-8 py-3 rounded-full font-semibold text-lg shadow'
                style={{ boxShadow: '0 2px 8px 0 rgba(0,147,221,0.10)' }}
                aria-label='Back to Home'
              >
                <Link href='/'>Back to Home</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultView;
