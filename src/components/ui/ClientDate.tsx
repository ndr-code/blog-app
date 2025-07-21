'use client';
import { useEffect, useState } from 'react';

interface ClientDateProps {
  dateString: string;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}

export default function ClientDate({ dateString }: ClientDateProps) {
  const [formatted, setFormatted] = useState('');
  useEffect(() => {
    setFormatted(formatDate(dateString));
  }, [dateString]);
  return (
    <time
      dateTime={dateString}
      aria-label={`Date: ${formatted}`}
      role='text'
      suppressHydrationWarning
    >
      {formatted}
    </time>
  );
}
