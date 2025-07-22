'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { PostForm } from '../ui/PostForm';
import Link from 'next/link';
import { Button } from '../ui/Buttons';
import { useParams } from 'next/navigation';

const EditPostView = () => {
  const { user, isLoggedIn } = useAuth();
  const params = useParams();
  const postId = params?.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    title: '',
    content: '',
    tags: '',
    image: '',
  });
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: '',
    content: '',
    tags: [],
    imageUrl: '',
  });

  useEffect(() => {
    async function fetchPost() {
      if (!postId) return;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/posts/${postId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        setInitialValues({
          title: data.title || '',
          content: data.content || '',
          tags: Array.isArray(data.tags) ? data.tags : [],
          imageUrl: data.imageUrl || '',
        });
      } catch {}
    }
    fetchPost();
  }, [postId]);

  const [pendingEditPostData, setPendingEditPostData] = useState<{
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
    setShowUpdateConfirm(true);
    setPendingEditPostData(data);
  };

  const handleConfirmedUpdate = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setFieldErrors({ title: '', content: '', tags: '', image: '' });
    if (!pendingEditPostData) {
      setLoading(false);
      setError('No post data to update.');
      return;
    }
    const data = pendingEditPostData;
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
    if (!data.image && !initialValues.imageUrl) {
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
      if (data.title) formData.append('title', data.title);
      if (data.content) formData.append('content', data.content);
      data.tags.forEach((tag) => formData.append('tags[]', tag));
      if (data.image) formData.append('image', data.image);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: formData,
      });
      if (!res.ok) {
        let errMsg = 'Failed to update post';
        try {
          const err = await res.json();
          errMsg = err.message || errMsg;
        } catch {}
        setError(errMsg);
        setLoading(false);
        return;
      }
      setLoading(false);
      window.location.href = `/post/${postId}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
      setLoading(false);
    }
  };

  return (
    <div className='' role='main' aria-label='Edit post main content'>
      <header className='flex items-center justify-between bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-md/10 w-full h-20 px-4 sm:px-8'>
        <div>
          <h1
            className='text-xl font-bold flex items-center gap-2 '
            tabIndex={0}
            aria-label='Edit Post'
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
            Edit Post
          </h1>
        </div>
      </header>
      <PostForm
        mode='edit'
        initialValues={initialValues}
        onSubmit={handleSubmit}
        loading={loading}
        fieldErrors={fieldErrors}
        user={user ?? undefined}
        isLoggedIn={isLoggedIn}
      />
      {!!error && <div className='text-red-500 text-sm mb-4'>{error}</div>}
      <ConfirmDialog
        isOpen={showUpdateConfirm}
        onClose={() => setShowUpdateConfirm(false)}
        title='Confirm Update'
        message='Are you sure you want to update this post?'
        actionText='Update'
        onAction={() => {
          setShowUpdateConfirm(false);
          handleConfirmedUpdate();
        }}
      />
    </div>
  );
};

export default EditPostView;
