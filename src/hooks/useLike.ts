import { useState, useEffect, useCallback } from 'react';
import { Post, User } from '@/interfaces/post.interface';

interface UseLikeProps {
  postId: string;
  initialLikes: number;
  onLikeToggle?: (updatedPost: Post) => void;
  currentUserId?: number | null;
}

export const useLike = ({
  postId,
  initialLikes,
  onLikeToggle,
  currentUserId,
}: UseLikeProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getLikesForPost = async (postId: string): Promise<User[]> => {
    const res = await fetch(`/api/posts/${postId}/likes`);
    if (!res.ok) throw new Error('Failed to fetch likes');
    return await res.json();
  };

  useEffect(() => {
    const fetchLikes = async () => {
      if (!currentUserId) {
        setIsLiked(false);
        return;
      }
      try {
        const users = await getLikesForPost(postId);
        setIsLiked(users.some((user) => user.id === currentUserId));
      } catch {
        setIsLiked(false);
      }
    };
    fetchLikes();
  }, [postId, currentUserId]);

  const toggleLikePost = async (postId: string): Promise<Post> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/posts/${postId}/like`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error('Failed to toggle like');
    return await res.json();
  };

  const handleLikeClick = useCallback(async () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    // Optimistically update isLiked
    setIsLiked((prev) => !prev);

    try {
      const updatedPost = await toggleLikePost(postId);
      setLikes(updatedPost.likes);
      // Re-fetch likes to ensure accuracy
      if (currentUserId) {
        const users = await getLikesForPost(postId);
        setIsLiked(users.some((user) => user.id === currentUserId));
      }
      if (onLikeToggle) {
        onLikeToggle(updatedPost);
      }
    } catch {
      // Revert optimistic update on error
      setIsLiked((prev) => !prev);
    } finally {
      setIsLoading(false);
    }
  }, [postId, isLoading, onLikeToggle, currentUserId]);

  return {
    likes,
    isLiked,
    isLoading,
    handleLikeClick,
  };
};
