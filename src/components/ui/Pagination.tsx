import React from 'react';
import { Button } from './Buttons';

interface PaginationProps {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  current,
  total,
  onPageChange,
}) => {
  const getPages = () => {
    const pages: (number | string)[] = [];
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current > 2) pages.push(1);
      if (current > 3) pages.push('...');
      for (
        let i = Math.max(1, current - 1);
        i <= Math.min(total, current + 1);
        i++
      ) {
        pages.push(i);
      }
      if (current < total - 2) pages.push('...');
      if (current < total - 1) pages.push(total);
    }
    return pages;
  };

  return (
    <nav
      className='flex justify-center items-center gap-2 sm:gap-4 mt-4 py-6 sm:py-10 h-auto sm:h-16 border-t border-gray-300 '
      role='navigation'
      aria-label='Pagination Navigation'
      aria-live='polite'
    >
      <Button
        type='button'
        className='flex items-center gap-1 text-black disabled:text-black cursor-pointer px-2 sm:px-4 min-w-0'
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        variant='ghost'
        aria-label='Previous page'
        aria-disabled={current === 1}
      >
        <svg
          width='20'
          height='20'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M15 19l-7-7 7-7'
          />
        </svg>
        Previous
      </Button>
      {getPages().map((p, idx) =>
        typeof p === 'number' ? (
          <Button
            key={p + '-' + idx}
            type='button'
            onClick={() => onPageChange(p)}
            className={
              p === current
                ? 'w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-primary-300 text-white font-semibold flex items-center justify-center cursor-pointer text-base sm:text-lg'
                : 'w-8 h-8 sm:w-12 sm:h-12 rounded-full text-gray-800 hover:text-primary-300 font-bold flex items-center justify-center hover:bg-primary-100 cursor-pointer text-base sm:text-lg'
            }
            disabled={p === current}
            variant={p === current ? 'primary' : 'ghost'}
            aria-label={`Go to page ${p}`}
            aria-current={p === current ? 'page' : undefined}
            aria-disabled={p === current}
          >
            {p}
          </Button>
        ) : (
          <span
            key={idx}
            className='w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400'
            aria-hidden='true'
          >
            {p}
          </span>
        )
      )}
      <Button
        type='button'
        className='flex items-center gap-1 text-black disabled:text-black cursor-pointer px-2 sm:px-4 min-w-0'
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
        variant='ghost'
        aria-label='Next page'
        aria-disabled={current === total}
      >
        Next
        <svg
          width='20'
          height='20'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
        </svg>
      </Button>
    </nav>
  );
};
