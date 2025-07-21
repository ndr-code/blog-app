'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Buttons';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {}, [error]);

  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-1 flex flex-col items-center justify-center w-full bg-gradient-to-br from-blue-50 to-white'>
        <div className='bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center max-w-md w-full'>
          {/* Error Illustration */}
          <Image
            src='/no-result.svg'
            alt='Error illustration'
            width={120}
            height={120}
            className='mb-6'
          />
          <h1 className='text-md font-semibold text-red-600 mb-2 text-center'>
            Oops! Something went wrong!
          </h1>
          <p className='text-gray-400 mb-6 text-center text-sm'>
            {error.message ||
              'An unexpected error occurred. Please try again later.'}
          </p>
          <Button
            onClick={reset}
            className='px-12 py-3 rounded-full font-semibold text-base shadow-md'
            variant='primary'
          >
            Try Again
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
