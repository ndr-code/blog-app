'use client';

import { useRef } from 'react';
import { RegisterForm } from '@/components/ui/RegisterForm';
import Link from 'next/link';

const RegisterPage = () => {
  const formRef = useRef<HTMLDivElement>(null);

  return (
    <div className='flex flex-col min-h-screen bg-neutral-25'>
      <main className='flex-1 flex flex-col items-center justify-center pt-20'>
        <nav className='w-full max-w-sm mb-4'>
          <Link
            href='/'
            className='text-primary-300 hover:text-primary-300/80 text-sm block text-left'
          >
            ← Back to Home
          </Link>
        </nav>
        <div ref={formRef} className='w-full max-w-sm'>
          <RegisterForm />
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
