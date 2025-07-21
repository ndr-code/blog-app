import { useState, useEffect, useCallback } from 'react';
import { CommentData } from '@/interfaces/post.interface';

interface UseCommentsProps {
  postId: string;
  open: boolean;
}

export const useComments = ({ postId, open }: UseCommentsProps) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const sortCommentsByDate = (comments: CommentData[]) => {
    return comments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const getCommentsByPostId = async (
    postId: string
  ): Promise<CommentData[]> => {
    const res = await fetch(`/api/comments/${postId}`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    return await res.json();
  };

  const createComment = async (
    postId: string,
    content: string
  ): Promise<CommentData> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/comments/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error('Failed to create comment');
    return await res.json();
  };

  useEffect(() => {
    if (open) {
      setLoading(true);
      getCommentsByPostId(postId)
        .then((fetchedComments) => {
          const sortedComments = sortCommentsByDate(fetchedComments);
          setComments(sortedComments);
        })
        .finally(() => setLoading(false));
    }
  }, [open, postId]);

  const handleCommentSubmit = useCallback(async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      await createComment(postId, newComment);
      setNewComment('');
      const updatedComments = await getCommentsByPostId(postId);
      const sortedComments = sortCommentsByDate(updatedComments);
      setComments(sortedComments);
    } finally {
      setLoading(false);
    }
  }, [postId, newComment]);

  const clearNewComment = useCallback(() => {
    setNewComment('');
  }, []);

  return {
    comments,
    newComment,
    setNewComment,
    loading,
    handleCommentSubmit,
    clearNewComment,
  };
};
