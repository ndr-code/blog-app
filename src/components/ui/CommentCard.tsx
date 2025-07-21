import { CommentData } from '@/interfaces/post.interface';
import { AvatarIcon } from './Avatar';
import ClientDate from './ClientDate';

interface CommentCardProps {
  comment: CommentData;
}

export const CommentCard = ({ comment }: CommentCardProps) => {
  return (
    <div
      className='flex gap-4 border-b border-gray-200 py-3 last:border-b-0'
      aria-label='Comment'
    >
      <AvatarIcon
        user={comment.author}
        size={48}
        aria-label={`Avatar of ${comment?.author?.name || 'Unknown'}`}
      />
      <div className='flex-1'>
        <div>
          <p
            className='font-semibold text-gray-900'
            aria-label='Comment author'
          >
            {comment?.author?.name || 'Unknown'}
          </p>
          <p className='text-sm text-gray-500' aria-label='Comment date'>
            <ClientDate dateString={comment.createdAt} />
          </p>
        </div>
        <p className='mt-2 text-gray-800' aria-label='Comment content'>
          &quot;{comment.content}&quot;
        </p>
      </div>
    </div>
  );
};
