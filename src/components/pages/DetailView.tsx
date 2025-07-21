'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PostCard } from '../ui/PostCard';
import { CommentCard } from '../ui/CommentCard';
import Image from 'next/image';
import { Post, CommentData, User } from '@/interfaces/post.interface';
import { CommentDialog } from '../ui/CommentDialog';
import { Button } from '../ui/Buttons';
import { useCommentDialog } from '@/context/CommentContext';
import { LikeButton, CommentButton } from '../ui/Buttons';
import { useAuth } from '@/hooks/useAuth';
import { fetchWithAuthHeaders } from '@/utils/apiUtils';
import { AvatarIcon } from '../ui/Avatar';
import { getAvatarUrl } from '@/utils/avatar';
import { getImageUrl } from '@/utils/image';
import dynamic from 'next/dynamic';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface DetailViewProps {
  initialPost: Post | null;
  initialComments: CommentData[];
  initialMostLikedPosts: Post[];
}

const DetailView = ({
  initialPost,
  initialComments,
  initialMostLikedPosts,
}: DetailViewProps) => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [post, setPost] = useState<Post | null>(initialPost);
  const [comments, setComments] = useState<CommentData[]>(
    Array.isArray(initialComments) ? initialComments : []
  );
  const [newComment, setNewComment] = useState('');
  const [anotherPosts, setAnotherPosts] = useState<Post[]>(
    initialMostLikedPosts
  );
  const [user, setUser] = useState<User | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [anotherPostCommentCounts, setAnotherPostCommentCounts] = useState<
    Record<number, number>
  >({});

  const [authorAvatarUrl, setAuthorAvatarUrl] = useState<string | undefined>(
    typeof post?.author?.avatarUrl === 'string'
      ? post.author.avatarUrl
      : undefined
  );
  const authorId = post?.author?.id;

  type WindowWithAvatarCache = Window & {
    __avatarCache?: Map<number, string | undefined>;
  };
  const avatarCache =
    (typeof window !== 'undefined' &&
      (window as WindowWithAvatarCache).__avatarCache) ||
    new Map<number, string | undefined>();
  if (typeof window !== 'undefined')
    (window as WindowWithAvatarCache).__avatarCache = avatarCache;

  useEffect(() => {
    if (!authorId) return;
    if (!post?.author?.avatarUrl && authorId) {
      if (avatarCache.has(authorId)) {
        const cached = avatarCache.get(authorId);
        setAuthorAvatarUrl(
          cached !== null && typeof cached === 'string' ? cached : undefined
        );
      } else {
        fetch(`/api/users/${authorId}`)
          .then((res) => res.json())
          .then((user) => {
            const url =
              user.avatarUrl !== null && typeof user.avatarUrl === 'string'
                ? user.avatarUrl
                : undefined;
            avatarCache.set(authorId, url);
            setAuthorAvatarUrl(url);
          });
      }
    } else if (post?.author?.avatarUrl) {
      setAuthorAvatarUrl(post.author.avatarUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.author?.avatarUrl, authorId]);
  const { isLoggedIn } = useAuth();
  const {
    open,
    postId: modalPostId,
    openModal,
    closeModal,
  } = useCommentDialog();

  const getPostById = async (id: string): Promise<Post> => {
    const apiUrl = `/api/posts/${id}`;

    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error('Failed to fetch post');
    }
    const data = await res.json();
    return data;
  };

  const getMostLikedPosts = async (limit: number = 3): Promise<Post[]> => {
    const res = await fetch(`/api/posts/most-liked?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch most liked posts');
    const data = await res.json();
    return data.data || [];
  };

  const createComment = async (
    postId: string,
    content: string
  ): Promise<CommentData | null> => {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
      if (token && !token.startsWith('Bearer ')) {
        token = `Bearer ${token}`;
      }
    }
    const res = await fetchWithAuthHeaders(`/api/comments/${postId}`, token, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      let errMsg = 'Unknown error';
      try {
        const err = await res.json();
        errMsg = err?.message || JSON.stringify(err);
      } catch {}
      alert('Failed to add comment: ' + errMsg);
      return null;
    }
    const data = await res.json();
    if (data && data.id) return data;
    if (data && data.data) return data.data;
    return null;
  };

  const getCommentsByPostId = async (
    postId: string
  ): Promise<CommentData[]> => {
    const res = await fetch(`/api/comments/${postId}`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    return await res.json();
  };

  const handleLikeToggle = async () => {
    if (!id) return;
    try {
      const updatedPost = await getPostById(id);
      setPost(updatedPost);
    } catch {}
  };

  const sortCommentsByDate = (comments: CommentData[]) => {
    return comments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !id || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const comment = await createComment(id, newComment);
      if (comment) {
        setComments((prev) => [comment, ...prev]);
        setNewComment('');

        const updatedPost = await getPostById(id);
        setPost(updatedPost);
      } else {
        alert('Failed to add comment. Please try again.');
      }
    } catch {
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ClientDate = dynamic(() => import('../ui/ClientDate'), { ssr: false });

  useEffect(() => {
    if (id && !initialPost) {
      const fetchData = async () => {
        try {
          const [postData, commentsData, anotherPostsData] = await Promise.all([
            getPostById(id),
            getCommentsByPostId(id),
            getMostLikedPosts(3),
          ]);

          setPost(postData);
          setComments(sortCommentsByDate(commentsData));
          setAnotherPosts(anotherPostsData);
        } catch {}
      };

      fetchData();
    }
  }, [id, initialPost]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    async function fetchCommentCounts(posts: Post[]) {
      const counts: Record<number, number> = {};
      await Promise.all(
        posts.map(async (p) => {
          try {
            const res = await fetch(`/api/comments/${p.id}`);
            const comments = await res.json();
            counts[p.id] = Array.isArray(comments) ? comments.length : 0;
          } catch {
            counts[p.id] = 0;
          }
        })
      );
      setAnotherPostCommentCounts(counts);
    }
    if (anotherPosts.length > 0) {
      fetchCommentCounts(anotherPosts);
    }
  }, [anotherPosts]);

  function isErrorPostType(
    obj: unknown
  ): obj is { statusCode?: number; message?: string } {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      ('statusCode' in obj || 'message' in obj) &&
      (typeof (obj as { statusCode?: number; message?: string }).statusCode ===
        'number' ||
        typeof (obj as { statusCode?: number; message?: string }).message ===
          'string')
    );
  }

  const isErrorPost = post && isErrorPostType(post);
  if (!post || isErrorPost) {
    return (
      <div className='mx-auto px-4 md:px-0 max-w-4xl md:mt-10'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>
            {isErrorPost ? 'Post Not Found' : 'Loading...'}
          </h1>
          {isErrorPost && (
            <p className='text-neutral-500 mb-2'>
              {(isErrorPostType(post) && post.message) ||
                'The post you are looking for does not exist.'}
            </p>
          )}
        </div>
        {/* Debug: Show raw post data if available */}
        <pre className='text-xs text-left bg-gray-100 p-2 rounded mt-4 overflow-x-auto'>
          {JSON.stringify(post, null, 2)}
        </pre>
        {/* DEBUG: log post to console if debugpost param present */}
        {typeof window !== 'undefined' &&
          window.location.search.includes('debugpost') &&
          (() => {
            console.log('DetailView post:', post);
            return null;
          })()}
        <div className='mt-4 text-center'>
          <Link href='/' className='text-primary-300 hover:underline'>
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className='mx-auto px-4 md:px-0 max-w-4xl mt-4 md:mt-10'
      role='main'
      aria-label='Post detail main content'
    >
      {/* Breadcrumb */}
      <nav className='mb-8'>
        <nav aria-label='Breadcrumb'>
          <Link
            href='/'
            className='text-primary-300 hover:text-primary-300/80 text-sm'
            aria-label='Back to Home'
          >
            ← Back to Home
          </Link>
        </nav>
      </nav>

      <section className='mb-8'>
        {/* Title */}
        <div className='flex items-start justify-between mb-6'>
          <h2
            className='text-2xl md:text-4xl font-bold text-neutral-900'
            tabIndex={0}
            aria-label={`Post title: ${post.title}`}
          >
            {post.title}
          </h2>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div
            className='flex flex-wrap gap-2 mb-6'
            role='list'
            aria-label='Post tags'
          >
            {post.tags.map((tag, idx) => (
              <Link
                key={idx}
                href={`/post/search?q=${encodeURIComponent(
                  tag.replace(/["'`\[\]\{\}]/g, '')
                )}`}
                className='text-xs font-medium px-3 py-1 rounded-md border border-neutral-300 bg-neutral-25 text-neutral-600 cursor-pointer hover:bg-neutral-100 hover:border-neutral-500 hover:text-primary-800'
                scroll={false}
                role='listitem'
                aria-label={`Tag: ${tag.replace(/["'`\[\]\{\}]/g, '')}`}
              >
                {tag.replace(/["'`\[\]\{\}]/g, '')}
              </Link>
            ))}
          </div>
        )}

        {/* Author + Date */}
        <div className='flex items-center gap-3 mt-auto border-b border-neutral-300 pb-4'>
          <AvatarIcon
            user={{
              ...post.author,
              avatarUrl: authorAvatarUrl,
            }}
            size={36}
            className='focus:outline-none focus:ring-2 focus:ring-primary-300'
            aria-label={`Author avatar: ${post?.author?.name || 'Unknown'}`}
          />
          <div className='flex items-center gap-2'>
            <Link
              href={`/post/search?q=author:${post?.author?.id || ''}`}
              className='text-xs lg:text-sm font-semibold text-neutral-900 cursor-pointer hover:text-neutral-400'
              scroll={false}
              aria-label={`Author: ${post?.author?.name || 'Unknown'}`}
            >
              {post?.author?.name || 'Unknown'}
            </Link>
            <span className='text-neutral-300 text-2xl'>&middot;</span>
            <span className='text-xs text-neutral-600'>
              <ClientDate dateString={post.createdAt} />
            </span>
          </div>
        </div>

        {/* Like + Comment Icons */}
        <div className='flex justify-between gap-4 items-center mb-4 py-4 border-b border-neutral-300  w-full'>
          <div className='flex'>
            <LikeButton
              postId={String(id)}
              initialLikes={post.likes}
              onLikeToggle={handleLikeToggle}
              aria-label='Like this post'
            />
            <CommentButton
              isLoggedIn={isLoggedIn}
              onClick={isLoggedIn ? () => openModal(String(id)) : undefined}
              commentCount={comments.length}
              aria-label='Comment on this post'
            />
          </div>
          <div>
            {isLoggedIn && user && user.id === post.author.id && (
              <div className='flex gap-4 ml-4 mt-1'>
                <Link
                  href={`/post/${post.id}/edit`}
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
                    const token = localStorage.getItem('token');
                    await fetch(`/api/posts/${post.id}`, {
                      method: 'DELETE',
                      headers: {
                        Authorization: token ? `Bearer ${token}` : '',
                      },
                    });
                    setIsDeleteOpen(false);
                    window.location.href = '/';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Image */}
        <div className='flex items-center justify-center w-full mb-6'>
          <Image
            src={getImageUrl(post.imageUrl)}
            alt={post.title}
            width={700}
            height={600}
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: 900,
            }}
            className='w-full md:h-[600px] object-cover rounded-lg bg-neutral-100'
            priority
            aria-label='Post cover image'
            role='img'
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== window.location.origin + '/image-post.png') {
                target.src = '/image-post.png';
              }
              target.onerror = null;
            }}
          />
        </div>

        {/* Content */}
        <div className='mt-6'>
          <div className='prose prose-lg max-w-none text-neutral-700 leading-relaxed'>
            {post.content ? (
              <div
                className='whitespace-pre-line text-base leading-7 space-y-4 text-justify'
                dangerouslySetInnerHTML={{
                  __html: (post.content || '')
                    .split('\n')
                    .map((paragraph) => {
                      const trimmed = paragraph.trim();
                      if (!trimmed) return '';

                      const isHeading =
                        !trimmed.includes('. ') && trimmed.length < 80;

                      return `<p class=\"mb-4 text-justify ${
                        isHeading ? 'font-bold text-xl leading-loose' : ''
                      }\" aria-label='${
                        isHeading ? 'Heading' : 'Paragraph'
                      }'>${trimmed}</p>`;
                    })
                    .join(''),
                }}
                aria-label='Post content'
                role='region'
              />
            ) : (
              <p
                className='text-neutral-500 italic'
                aria-label='No content available'
              >
                No content available.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className='mb-8'>
        <h2 className='text-xl md:text-2xl font-bold mb-2 border-t pt-8 border-neutral-300'>
          Comments ({comments.length})
        </h2>

        {isLoggedIn && user ? (
          <div className='mb-8 flex flex-col gap-4'>
            <div className='flex items-center gap-3'>
              <AvatarIcon
                user={{
                  ...user,
                  avatarUrl: getAvatarUrl(user?.avatarUrl),
                }}
                size={40}
                className='w-10 h-10'
              />
              <p className='font-semibold text-gray-800'>{user.name}</p>
            </div>
            <div>
              <label
                htmlFor='comment'
                className='block text-base font-semibold text-gray-900 mb-2'
              >
                Give your Comments
              </label>
              <textarea
                id='comment'
                className='w-full p-4 border border-gray-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 transition shadow-sm'
                rows={4}
                placeholder='Enter your comment'
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className='flex justify-end'>
                <Button
                  type='button'
                  variant='primary'
                  className='mt-4 w-full sm:w-2xs text-base font-bold py-3 px-4 rounded-full flex items-center justify-center'
                  onClick={handleCommentSubmit}
                  disabled={!newComment.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className='text-gray-600 mb-8'>
            Please{' '}
            <Link href='/login' className='text-primary-300 hover:underline'>
              log in
            </Link>{' '}
            to leave a comment.
          </p>
        )}

        <div className='space-y-6'>
          {comments.slice(0, 3).map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
          {comments.length > 3 && (
            <button
              onClick={() => openModal(String(id))}
              className='text-primary-300 font-semibold hover:underline'
            >
              See All Comments
            </button>
          )}
        </div>
      </section>

      {/* Another Post Section */}
      {anotherPosts.length > 0 && (
        <section className='mb-8'>
          <h2 className='text-xl md:text-2xl font-bold text-Primary-400 mb-4'>
            Another Post
          </h2>
          <div
            className='flex flex-col items-center w-full'
            style={{ maxWidth: 807 }}
          >
            {anotherPosts
              .filter((p) => p.id !== post.id)
              .slice(0, 1)
              .map((relatedPost) => (
                <div key={relatedPost.id} className='w-full'>
                  <PostCard
                    post={relatedPost}
                    commentCount={anotherPostCommentCounts[relatedPost.id] ?? 0}
                  />
                </div>
              ))}
          </div>
        </section>
      )}

      <CommentDialog
        postId={String(id)}
        open={open && modalPostId === String(id)}
        onClose={closeModal}
      />
    </div>
  );
};

export default DetailView;
