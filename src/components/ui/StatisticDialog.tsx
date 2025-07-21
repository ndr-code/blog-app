import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import TabsStatistic from './TabsStatistic';
import { usePostLikes } from '@/hooks/usePostLikes';
import { useComments } from '@/hooks/useComments';
import { Button } from './Buttons';

interface StatisticDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string | number;
}

export const StatisticDialog: React.FC<StatisticDialogProps> = ({
  isOpen,
  onClose,
  postId,
}) => {
  const { likeUsers: rawLikeUsers } = usePostLikes(postId);
  const { comments: rawComments } = useComments({
    postId: String(postId),
    open: isOpen,
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-fadeIn ' />
        <Dialog.Content className='fixed inset-0 z-50 flex items-center justify-center p-4 '>
          <div className='bg-white rounded-lg shadow-lg p-6 min-w-[300px] min-h-[120px] flex flex-col items-center'>
            <div className='w-full max-w-xl relative'>
              <Dialog.Close asChild>
                <Button
                  type='button'
                  variant='ghost'
                  className='absolute top-0 right-0 text-2xl text-gray-400 hover:text-gray-700 cursor-pointer'
                  aria-label='Close statistic dialog'
                >
                  &times;
                </Button>
              </Dialog.Close>
              <div className='flex items-center justify-between mb-2 w-full'>
                <span className='font-bold text-lg'>Statistic</span>
              </div>
              <TabsStatistic likeUsers={rawLikeUsers} comments={rawComments} />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
