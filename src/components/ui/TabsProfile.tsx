import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { PostCard } from './PostCard';
import type { Post } from '../../interfaces/post.interface';
import Image from 'next/image';
import { LuPencilLine } from 'react-icons/lu';
import { Button } from './Buttons';
import UpdatePasswordForm from './UpdatePasswordForm';

const TabsProfile = ({
  posts = [],
  isOwner = false,
  onWritePost,
}: {
  posts?: Post[];
  isOwner?: boolean;
  onWritePost?: () => void;
}) => {
  function handleClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();
    if (onWritePost) {
      onWritePost();
    }
  }

  return (
    <TabsPrimitive.Root
      className='flex flex-col w-full max-w-5xl mx-auto'
      defaultValue='tab1'
      aria-label='Profile Tabs'
    >
      <TabsPrimitive.List
        className='flex flex-shrink-0'
        aria-label='Profile Tab List'
        role='tablist'
      >
        <TabsPrimitive.Trigger
          className='font-sans bg-neutral-25 min-w-45 px-5 h-[45px] flex items-center justify-center text-[15px] leading-none text-gray-700 select-none  hover:text-primary-300 data-[state=active]:text-primary-300 data-[state=active]:border-b-3 data-[state=active]:border-primary-300 focus:relative  cursor-pointer data-[state=active]:font-semibold border-b border-neutral-300'
          value='tab1'
          role='tab'
          aria-controls='tabpanel-posts'
          id='tab-posts'
        >
          Your Post
        </TabsPrimitive.Trigger>
        <TabsPrimitive.Trigger
          className='font-sans bg-neutral-25 min-w-45  h-[45px] flex items-center justify-center text-[15px] leading-none text-gray-700 select-none  hover:text-primary-300 data-[state=active]:text-primary-300 data-[state=active]:border-b-3 data-[state=active]:border-primary-300 focus:relative  cursor-pointer data-[state=active]:font-semibold border-b border-neutral-300'
          value='tab2'
          role='tab'
          aria-controls='tabpanel-password'
          id='tab-password'
        >
          Change Password
        </TabsPrimitive.Trigger>
      </TabsPrimitive.List>

      <TabsPrimitive.Content
        className='flex-grow py-6 bg-neutral-25  outline-none '
        value='tab1'
        role='tabpanel'
        id='tabpanel-posts'
        aria-labelledby='tab-posts'
        tabIndex={0}
      >
        {posts.length > 0 ? (
          <>
            <div className='flex items-center justify-between mb-6 '>
              <h2 className='text-xl font-bold py-auto '>
                {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
              </h2>
              {isOwner && (
                <div className='ml-auto flex items-center justify-center px-4'>
                  <Button
                    variant='primary'
                    className='rounded-full px-6 py-2 min-w-45 text-base font-semibold flex items-center gap-2'
                    onClick={onWritePost}
                  >
                    <LuPencilLine size={20} className='inline-block mr-2' />
                    Write Post
                  </Button>
                </div>
              )}
            </div>

            <ul className='space-y-6 border-t border-gray-300 pt-4'>
              {posts.map((post, idx) => (
                <li key={post.id || idx}>
                  <PostCard post={post} isEditMode={isOwner} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className='flex flex-col items-center justify-center py-24 rounded-2xl mx-2'>
            <Image
              src='/no-result.svg'
              alt='No result'
              width={160}
              height={160}
              className='mb-8'
              priority
            />
            <h2 className='text-lg font-semibold mb-3 text-gray-800 tracking-tight'>
              Your writing journey starts here
            </h2>
            <p className='mb-6 text-gray-500'>
              No posts yet, but every great writer starts with the first one.
            </p>
            {isOwner && (
              <Button
                onClick={handleClick}
                variant='primary'
                className='flex items-center gap-2 h-12 px-8 py-2 font-semibold'
              >
                <LuPencilLine size={24} className='inline-block' />
                <span>Write Post</span>
              </Button>
            )}
          </div>
        )}
      </TabsPrimitive.Content>

      <TabsPrimitive.Content
        className='flex-grow p-6 bg-neutral-25  outline-none  '
        value='tab2'
        role='tabpanel'
        id='tabpanel-password'
        aria-labelledby='tab-password'
        tabIndex={0}
      >
        <UpdatePasswordForm />
      </TabsPrimitive.Content>
    </TabsPrimitive.Root>
  );
};

export default TabsProfile;
