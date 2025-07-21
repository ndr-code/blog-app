import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-1 flex flex-col items-center justify-center w-full'>
        <h1 className='text-3xl font-bold text-gray-700 mb-4'>
          404 - Page Not Found
        </h1>
        <p className='text-gray-500 mb-6'>
          Sorry, the page you are looking for does not exist.
        </p>
        <Link
          href='/'
          className='text-primary-300 hover:underline font-semibold cursor-pointer'
        >
          Go back home
        </Link>
      </main>
    </div>
  );
}
