export default function PostLoading() {
  return (
    <div className='flex flex-col min-h-screen bg-white'>
      
      <main className='flex-1'>
        <div className='mx-auto px-4 md:px-0 max-w-4xl mt-4 md:mt-10'>
          {/* Breadcrumb skeleton */}
          <div className='mb-8'>
            <div className='h-4 bg-gray-200 rounded w-24 animate-pulse'></div>
          </div>

          <section className='mb-8'>
            {/* Title skeleton */}
            <div className='h-8 bg-gray-200 rounded w-3/4 mb-6 animate-pulse'></div>

            {/* Tags skeleton */}
            <div className='flex flex-wrap gap-2 mb-6'>
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className='h-6 bg-gray-200 rounded w-16 animate-pulse'
                ></div>
              ))}
            </div>

            {/* Author + Date skeleton */}
            <div className='flex items-center gap-3 mt-auto mb-2 border-b border-neutral-300 pb-4'>
              <div className='w-9 h-9 bg-gray-200 rounded-full animate-pulse'></div>
              <div className='flex items-center gap-2'>
                <div className='h-4 bg-gray-200 rounded w-24 animate-pulse'></div>
                <div className='h-4 bg-gray-200 rounded w-4 animate-pulse'></div>
                <div className='h-4 bg-gray-200 rounded w-20 animate-pulse'></div>
              </div>
            </div>

            {/* Like + Comment Icons skeleton */}
            <div className='flex gap-4 items-center mb-4 py-4 border-b border-neutral-300'>
              <div className='h-6 bg-gray-200 rounded w-16 animate-pulse'></div>
              <div className='h-6 bg-gray-200 rounded w-20 animate-pulse'></div>
            </div>

            {/* Image skeleton */}
            <div className='w-full h-[400px] bg-gray-200 rounded-lg mb-6 animate-pulse'></div>

            {/* Content skeleton */}
            <div className='mt-6 space-y-4'>
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className='h-4 bg-gray-200 rounded animate-pulse'
                ></div>
              ))}
            </div>
          </section>

          {/* Comments Section skeleton */}
          <section className='mt-12'>
            <h3 className='text-xl font-bold mb-6'>Comments</h3>
            <div className='space-y-4'>
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className='bg-gray-50 rounded-lg p-4 animate-pulse'
                >
                  <div className='flex items-center mb-3'>
                    <div className='w-8 h-8 bg-gray-200 rounded-full'></div>
                    <div className='ml-3'>
                      <div className='h-3 bg-gray-200 rounded w-24 mb-1'></div>
                      <div className='h-2 bg-gray-200 rounded w-16'></div>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <div className='h-3 bg-gray-200 rounded w-full'></div>
                    <div className='h-3 bg-gray-200 rounded w-3/4'></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    
    </div>
  );
}
