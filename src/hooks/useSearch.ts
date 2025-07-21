import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/post/search?q=${query}`);
    }
  };

  const clearQuery = () => {
    setQuery('');
  };

  return {
    query,
    setQuery,
    handleSearch,
    clearQuery,
  };
};
