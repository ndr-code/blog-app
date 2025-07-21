import ResultView from '@/components/pages/ResultView';

export const revalidate = 120; // 2 minutes

export default function SearchResultPage() {
  return (
    <div className='flex flex-col min-h-screen bg-neutral-25'>
      <main className='flex-1'>
        <ResultView />
      </main>
    </div>
  );
}
