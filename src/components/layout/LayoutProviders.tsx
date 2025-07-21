'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CommentProvider } from '@/context/CommentContext';
import { TooltipProvider } from '@/context/TooltipContext';
import { AuthProvider } from '@/context/AuthContext';

export default function LayoutProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideHeader =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/post/write' ||
    (pathname.startsWith('/post/') && pathname.endsWith('/edit'));
  const hideFooter = pathname === '/login' || pathname === '/register';

  return (
    <AuthProvider>
      <TooltipProvider>
        <CommentProvider>
          {!hideHeader && <Header />}
          {children}
          {!hideFooter && <Footer />}
        </CommentProvider>
      </TooltipProvider>
    </AuthProvider>
  );
}
