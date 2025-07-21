

export default function Loading() {
  return (
    <div className='flex flex-col min-h-screen bg-neutral-50'>
      <main className='flex-1 mt-6'>
        <div className='container mx-auto px-4 py-1'>
          <div className='grid grid-cols-1 md:grid-cols-12 gap-8 relative'>
            <div className='md:col-span-8 flex flex-col items-center w-full min-w-0 md:min-h-[80vh] md:flex-col md:justify-between'>
              <h2 className='text-2xl font-bold mb-8 self-start'>
                Recommend For You
              </h2>

              <div className='w-full min-h-[400px]'>
                <div className='space-y-4'>
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className='bg-white rounded-lg p-6 shadow-sm animate-pulse'
                    >
                      <div className='flex items-center mb-4'>
                        <div className='w-10 h-10 bg-gray-200 rounded-full'></div>
                        <div className='ml-3'>
                          <div className='h-4 bg-gray-200 rounded w-32 mb-2'></div>
                          <div className='h-3 bg-gray-200 rounded w-24'></div>
                        </div>
                      </div>
                      <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                      <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='md:col-span-4 relative z-10 w-full min-w-0 md:border-l md:border-[#D5D7DA] md:pl-8'>
              <div className='bg-transparent'>
                <h2 className='text-2xl font-bold mb-8'>Most Liked</h2>
                <div className='flex flex-col gap-5'>
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className='bg-white rounded-lg p-4 shadow-sm animate-pulse'
                    >
                      <div className='h-3 bg-gray-200 rounded w-3/4 mb-2'></div>
                      <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
