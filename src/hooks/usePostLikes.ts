import { useEffect, useState } from 'react';
import { User } from '@/interfaces/post.interface';

export function usePostLikes(postId: string | number) {
  const [likeUsers, setLikeUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    fetch(`/api/posts/${postId}/likes`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch likes');
        return res.json();
      })
      .then((data) => {
        setLikeUsers(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError(err.message);
        setLikeUsers([]);
      })
      .finally(() => setLoading(false));
  }, [postId]);

  return { likeUsers, loading, error };
}
