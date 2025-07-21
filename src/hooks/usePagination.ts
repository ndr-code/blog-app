import { useMemo } from 'react';

interface UsePaginationProps {
  current: number;
  total: number;
  maxVisible?: number;
}

export const usePagination = ({
  current,
  total,
  maxVisible = 5,
}: UsePaginationProps) => {
  const pages = useMemo(() => {
    const pageNumbers: (number | string)[] = [];

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (current > 2) {
        pageNumbers.push(1);
      }

      if (current > 3) {
        pageNumbers.push('...');
      }

      const start = Math.max(1, current - 1);
      const end = Math.min(total, current + 1);

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (current < total - 2) {
        pageNumbers.push('...');
      }

      if (current < total - 1) {
        pageNumbers.push(total);
      }
    }

    return pageNumbers;
  }, [current, total, maxVisible]);

  const canGoPrevious = current > 1;
  const canGoNext = current < total;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= total) {
      return page;
    }
    return current;
  };

  const goToPrevious = () => {
    return canGoPrevious ? current - 1 : current;
  };

  const goToNext = () => {
    return canGoNext ? current + 1 : current;
  };

  return {
    pages,
    canGoPrevious,
    canGoNext,
    goToPage,
    goToPrevious,
    goToNext,
  };
};
