import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/utils/image';
import { Post } from '@/interfaces/post.interface';
import { AvatarIcon } from './Avatar';
import { LikeButton, CommentButton } from './Buttons';
import { ConfirmDialog } from './ConfirmDialog';
import { useAuth } from '@/hooks/useAuth';
import { useCommentDialog } from '@/context/CommentContext';
import { useAvatarUrl } from '@/hooks/useAvatarUrl';
import { useDeletePost } from '@/hooks/useDeletePost';
import { StatisticDialog } from './StatisticDialog';

const ClientDate = dynamic(() => import('./ClientDate'), { ssr: false });

interface PostCardProps {
  post: Post;
  isSmall?: boolean;
  isEditMode?: boolean;
  commentCount?: number;
}

export const PostCard = ({
  post,
  isSmall = false,
  isEditMode = false,
  commentCount: commentCountProp = 0,
}: PostCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isStatisticOpen, setIsStatisticOpen] = useState(false);
  const {
    id,
    title,
    content,
    tags,
    imageUrl,
    author,
    createdAt,
    likes,
    comments,
  } = post;
  const updatedAt = createdAt;

  const avatarUrl = useAvatarUrl(author);
  const { isLoggedIn } = useAuth();
  const { openModal } = useCommentDialog();
  const handleDeletePost = useDeletePost();
  const handleCommentClick = () => {
    if (isLoggedIn) openModal(String(id));
  };
  const commentCount =
    typeof commentCountProp === 'number'
      ? commentCountProp
      : Array.isArray(comments)
      ? comments.length
      : 0;

  function stripHtmlTags(content: string): import('react').ReactNode {
    if (!content) return '';

    let text = content.replace(/<[^>]+>/g, '');

    text = text.replace(/[\'`\[\]\{\}]/g, '');
    const textarea =
      typeof window !== 'undefined' ? document.createElement('textarea') : null;
    if (textarea) {
      textarea.innerHTML = text;
      return textarea.value;
    }
    return text;
  }
  return (
    <div
      className={`overflow-hidden flex flex-row transition-all duration-100 w-full max-w-5xl py-4`}
    >
      {/* Image Section */}
      {!isSmall && (
        <div className='hidden lg:flex flex-shrink-0 items-center justify-center pr-4 h-auto'>
          {!imageError && imageUrl ? (
            <Link href={`/post/${id}`}>
              <Image
                src={getImageUrl(imageUrl)}
                alt={title}
                width={400}
                height={258}
                style={{
                  width: '100%',
                  height: '100%',
                  minWidth: 400,
                  maxHeight: 258,
                  aspectRatio: '400/258',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  backgroundColor: '#f3f4f6',
                  display: 'block',
                }}
                className='rounded-lg object-cover bg-neutral-100 cursor-pointer hover:opacity-95 transition-all duration-100'
                onError={() => setImageError(true)}
                priority
              />
            </Link>
          ) : (
            <div className='bg-neutral-100 rounded-lg flex items-center justify-center w-[400px] h-[258px] text-xs text-neutral-300'>
              Image failed to load
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div
        className={`flex flex-col flex-1 gap-2  ${
          !isSmall && 'md:px-4 md:gap-2'
        }`}
      >
        {/* Title */}
        <Link href={`/post/${id}`}>
          <div
            className={`${
              isSmall ? 'text-base lg:text-base' : 'text-base lg:text-lg'
            } font-bold text-neutral-900 tracking-tight cursor-pointer hover:text-primary-300 transition-colors`}
          >
            {title}
          </div>
        </Link>
        {/* Tags */}
        {!isSmall && tags.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-1'>
            {tags.map((tag, idx) => {
              const cleanTag = tag.replace(/["'`\[\]\{\}]/g, '');
              return (
                <Link
                  key={idx}
                  href={`/post/search?q=${encodeURIComponent(cleanTag)}`}
                  className='cursor-pointer text-neutral-600 text-xs font-medium px-3 py-1 rounded-md border-1 border-neutral-300 bg-neutral-25 hover:bg-neutral-100 hover:border-neutral-500 hover:text-primary-800'
                  scroll={false}
                >
                  {cleanTag}
                </Link>
              );
            })}
          </div>
        )}
        {/* Content Excerpt */}
        {content && (
          <div
            className='text-xs md:text-sm text-neutral-600 line-clamp-4 mb-1'
            aria-label='Post excerpt'
            aria-describedby={`post-content-${id}`}
            id={`post-content-${id}`}
          >
            {stripHtmlTags(content)}
          </div>
        )}

        {/* Edit Mode Section */}
        {isEditMode ? (
          <div className='flex flex-col gap-2 mt-2'>
            <div className='flex gap-4 text-xs text-neutral-600 mb-1'>
              <span className='border-b-2 border-dotted border-primary-300 pb-0.5'>
                Created{' '}
                {new Date(createdAt).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </span>
              <span className='border-b-2 border-dotted border-neutral-300 pb-0.5'>
                Last updated{' '}
                {new Date(updatedAt).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </span>
            </div>
            <div className='flex gap-4 mt-1'>
              <a
                href='#'
                className='text-primary-300 font-medium underline underline-offset-2 cursor-pointer'
                onClick={(e) => {
                  e.preventDefault();
                  setIsStatisticOpen(true);
                }}
              >
                Statistic
              </a>
              <StatisticDialog
                isOpen={isStatisticOpen}
                onClose={() => setIsStatisticOpen(false)}
                postId={id}
              />
              <Link
                href={`/post/${id}/edit`}
                className='text-primary-300 font-medium underline underline-offset-2 cursor-pointer'
              >
                Edit
              </Link>
              <a
                href='#'
                className='text-red-500 font-medium underline underline-offset-2 cursor-pointer'
                onClick={(e) => {
                  e.preventDefault();
                  setIsDeleteOpen(true);
                }}
              >
                Delete
              </a>
              <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                title='Delete Post'
                message='Are you sure you want to delete this post? This action cannot be undone.'
                actionText='Delete'
                onAction={async () => {
                  await handleDeletePost(id);
                  setIsDeleteOpen(false);
                }}
              />
            </div>
          </div>
        ) : (
          !isSmall && (
            <div
              className='flex items-center gap-3 mt-auto'
              aria-label='Post author and date'
            >
              <AvatarIcon user={{ ...author, avatarUrl }} size={36} />
              <div className='flex items-center gap-2'>
                <Link
                  href={`/profile/${author.id}`}
                  className='text-xs lg:text-sm font-semibold text-neutral-900 cursor-pointer hover:text-primary-300 transition-colors'
                  scroll={false}
                  aria-label={`Go to ${author?.name || 'Unknown'}'s profile`}
                  aria-labelledby={`author-name-${id}`}
                >
                  <span id={`author-name-${id}`}>
                    {author?.name || 'Unknown'}
                  </span>
                </Link>
                <span className='text-neutral-300 text-3xl' aria-hidden='true'>
                  &middot;
                </span>
                <span
                  className='text-xs text-neutral-600'
                  aria-label='Post date'
                >
                  <ClientDate dateString={createdAt} />
                </span>
              </div>
            </div>
          )
        )}
        {/* Like and Comment */}
        {!isEditMode && (
          <div className='flex items-center'>
            <div className='flex items-center gap-1'>
              <LikeButton postId={String(id)} initialLikes={likes} />
            </div>
            <div className='flex items-center gap-1 relative'>
              <CommentButton
                isLoggedIn={isLoggedIn}
                onClick={handleCommentClick}
                commentCount={commentCount}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
