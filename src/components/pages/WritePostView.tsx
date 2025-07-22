'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { PostForm } from '../ui/PostForm';
import Link from 'next/link';
import { Button } from '../ui/Buttons';

const WritePostView = () => {
  const { user, isLoggedIn, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    title: '',
    content: '',
    tags: '',
    image: '',
  });
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const [pendingPostData, setPendingPostData] = useState<{
    title: string;
    content: string;
    tags: string[];
    image: File | null;
  } | null>(null);

  const handleSubmit = async (data: {
    title: string;
    content: string;
    tags: string[];
    image: File | null;
  }) => {
    setShowSubmitConfirm(true);
    setPendingPostData(data);
  };

  const handleConfirmedSubmit = async () => {
    setLoading(true);
    setError(null);
    setFieldErrors({ title: '', content: '', tags: '', image: '' });
    const data = pendingPostData;
    if (!data) return;
    let hasError = false;
    const newErrors = { title: '', content: '', tags: '', image: '' };
    if (!data.title.trim()) {
      newErrors.title = 'Please add a title.';
      hasError = true;
    }
    if (!data.content.trim() || data.content === '<p></p>') {
      newErrors.content = 'Please add content.';
      hasError = true;
    }
    if (data.tags.length === 0) {
      newErrors.tags = 'Please add at least one tag.';
      hasError = true;
    }
    if (!data.image) {
      newErrors.image = 'Please upload a cover image.';
      hasError = true;
    }
    setFieldErrors(newErrors);
    if (hasError) {
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('tags', JSON.stringify(data.tags));
      if (data.image) formData.append('image', data.image);
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: formData,
      });
      if (!res.ok) {
        let errMsg = 'Failed to create post';
        try {
          const err = await res.json();
          errMsg = err.message || errMsg;
        } catch {}
        setError(errMsg);
        setLoading(false);
        return;
      }
      window.location.href = '/';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='' role='main' aria-label='Write post main content'>
      <header className='flex items-center justify-between bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-md/10 w-full h-20 px-4 sm:px-8'>
        <div>
          <h1
            className='text-xl font-bold flex items-center gap-2 '
            tabIndex={0}
            aria-label='Write Post'
          >
            <Link href='/'>
              <Button
                type='button'
                className='mr-2 text-xl'
                aria-label='Back to Home'
                variant='ghost'
              >
                &#8592;
              </Button>
            </Link>
            Write Post
          </h1>
        </div>
      </header>
      <PostForm
        mode='create'
        initialValues={{ title: '', content: '', tags: [], imageUrl: '' }}
        onSubmit={handleSubmit}
        loading={loading}
        fieldErrors={fieldErrors}
        user={user ?? undefined}
        isLoggedIn={isLoggedIn}
      />
      {!!error && <div className='text-red-500 text-sm mb-4'>{error}</div>}
      <ConfirmDialog
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        title='Confirm Submit'
        message='Are you sure you want to submit this post?'
        actionText='Submit'
        onAction={() => {
          setShowSubmitConfirm(false);
          handleConfirmedSubmit();
        }}
      />
    </div>
  );
};

export default WritePostView;
