import * as Tabs from '@radix-ui/react-tabs';
import { FaRegMessage } from 'react-icons/fa6';
import { AvatarIcon } from './Avatar';
import { BiLike } from 'react-icons/bi';

import type { User } from '../../interfaces/post.interface';
interface Comment {
  id: number;
  author: User;
  content: string;
  createdAt: string;
}
interface TabsStatisticProps {
  likeUsers: User[];
  comments: Comment[];
}

export default function TabsStatistic({
  likeUsers,
  comments,
}: TabsStatisticProps) {
  return (
    <div className='w-full max-w-xl'>
      <Tabs.Root defaultValue='like'>
        <Tabs.List className='flex gap-2 border-b mb-4'>
          <Tabs.Trigger
            value='like'
            className='flex-1 flex items-center justify-center gap-2 px-4 py-2 font-medium text-primary-600 data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-300 data-[state=active]:border-n-2 data-[state=active]:border-primary-300 border-transparent cursor-pointer'
          >
            <BiLike /> Like
          </Tabs.Trigger>
          <Tabs.Trigger
            value='comment'
            className='flex-1 flex items-center justify-center gap-2 px-4 py-2 font-medium text-primary-600 data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-300 data-[state=active]:border-n-2 data-[state=active]:border-primary-300 border-transparent cursor-pointer'
          >
            <FaRegMessage /> Comment
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value='like'>
          <div className='font-semibold mb-2'>Like ({likeUsers.length})</div>
          <div className='flex flex-col gap-4 max-h-150 min-w-xl overflow-y-auto'>
            {likeUsers.map((user) => (
              <div key={user.id} className='flex items-center gap-3'>
                <AvatarIcon user={user} size={40} />
                <div>
                  <div className='font-semibold'>{user.name}</div>
                  <div className='text-xs text-neutral-500'>
                    {user.headline || 'Frontend Developer'}
                  </div>
                </div>
              </div>
            ))}
            {likeUsers.length === 0 && (
              <div className='text-neutral-400 text-sm'>No likes yet.</div>
            )}
          </div>
        </Tabs.Content>
        <Tabs.Content value='comment'>
          <div className='font-semibold mb-2'>Comment ({comments.length})</div>
          <div className='flex flex-col gap-4 max-h-150 min-w-xl  overflow-y-auto'>
            {comments.map((comment) => (
              <div key={comment.id} className='flex items-start gap-3'>
                <AvatarIcon user={comment.author} size={40} />
                <div>
                  <div className='font-semibold'>{comment.author.name}</div>
                  <div className='text-xs text-neutral-500 mb-1'>
                    {new Date(comment.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  <div className='text-sm text-neutral-700'>
                    {comment.content}
                  </div>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <div className='text-neutral-400 text-sm'>No comments yet.</div>
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
