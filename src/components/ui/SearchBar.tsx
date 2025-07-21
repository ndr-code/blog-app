'use client';
import React from 'react';
import { useSearch } from '@/hooks/useSearch';
import { FiSearch } from 'react-icons/fi';
import { Input } from './Input';

interface SearchBarProps {
  onSearchComplete?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearchComplete }) => {
  const { query, setQuery, handleSearch: baseHandleSearch } = useSearch();

  const handleSearch = (e: React.FormEvent) => {
    baseHandleSearch(e);
    if (onSearchComplete && query.trim()) {
      onSearchComplete();
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className='relative w-full'
      role='search'
      aria-label='Site search'
    >
      <Input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search'
        leftIcon={<FiSearch className='h-5 w-5 text-gray-400' />}
        className='pr-4'
        aria-label='Search query'
        autoComplete='off'
      />
    </form>
  );
};
