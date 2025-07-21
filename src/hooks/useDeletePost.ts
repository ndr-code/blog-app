import { useCallback } from 'react';

export function useDeletePost() {
  const handleDeletePost = useCallback(async (id: number) => {
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || 'Failed to delete post');
        return false;
      }
      window.location.reload();
      return true;
    } catch {
      alert('Failed to delete post');
      return false;
    }
  }, []);

  return handleDeletePost;
}
