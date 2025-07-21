'use client';

import { useRouter } from 'next/navigation';
import { useRef, useEffect } from 'react';
import { LoginForm } from '@/components/ui/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
    }
  }, [isLoggedIn, router]);

  return (
    <div className='flex flex-col min-h-screen bg-neutral-25'>
      <main className='flex-1 flex flex-col items-center justify-center pt-20'>
        <nav className='w-full max-w-sm mb-4 pl-10'>
          <Link
            href='/'
            className='text-primary-300 hover:text-primary-300/80 text-sm block text-left'
          >
            ← Back to Home
          </Link>
        </nav>
        <div ref={formRef}>
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
