import { useState, useEffect, useCallback } from 'react';
import { Post } from '@/interfaces/post.interface';

interface UsePostsOptions {
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

export const usePosts = (options: UsePostsOptions = {}) => {
  const { page = 1, limit = 5, autoFetch = true } = options;

  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(
    async (pageNum: number = currentPage, postsPerPage: number = limit) => {
      setLoading(true);
      setError(null);
      try {
        // Ambil token dari cookie jika ada (client-side only)
        let token: string | undefined = undefined;
        if (typeof document !== 'undefined') {
          const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
          if (match) {
            token = decodeURIComponent(match[1]);
          }
        }
        const url = `/api/posts/recommended?page=${pageNum}&limit=${postsPerPage}`;
        const res = await fetch(
          url,
          token ? { headers: { Authorization: token } } : undefined
        );
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        setPosts(data.data || []);
        setTotalPages(data.lastPage || 1);
      } catch {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    },
    [currentPage, limit]
  );

  const handleLikeToggle = (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const goToPage = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  // Fetch posts when currentPage changes
  useEffect(() => {
    if (autoFetch) {
      fetchPosts(currentPage);
    }
  }, [currentPage, fetchPosts, autoFetch]);

  return {
    posts,
    currentPage,
    totalPages,
    loading,
    error,
    fetchPosts,
    handleLikeToggle,
    goToPage,
    setPosts,
    setTotalPages,
  };
};

export const useMostLikedPosts = (limit: number = 3) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMostLikedPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/most-liked?limit=${limit}`);
      if (!res.ok) throw new Error('Failed to fetch most liked posts');
      const data = await res.json();

      setPosts(data.data || []);
    } catch {
      setError('Failed to fetch most liked posts');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const handleLikeToggle = (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  return {
    posts,
    loading,
    error,
    fetchMostLikedPosts,
    handleLikeToggle,
    setPosts,
  };
};

export const useSearchPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPostsByQuery = useCallback(async (query: string) => {
    if (!query.trim()) {
      setPosts([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/posts/search?query=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error('Failed to search posts');
      const data = await res.json();
      setPosts(data.data || []);
    } catch {
      setError('Failed to search posts');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    posts,
    loading,
    error,
    searchPostsByQuery,
  };
};
