import { useRef, useEffect } from 'react';
import React from 'react';
import { Button } from './Buttons';
import { useComments } from '@/hooks/useComments';
import { AvatarIcon } from './Avatar';
import { Toast } from './Toast';
import * as Dialog from '@radix-ui/react-dialog';
interface CommentDialogProps {
  postId: string;
  open: boolean;
  onClose: () => void;
  onCommentSubmitted?: () => void;
}

export const CommentDialog = ({
  postId,
  open,
  onClose,
  onCommentSubmitted,
}: CommentDialogProps) => {
  const { comments, newComment, setNewComment, loading, handleCommentSubmit } =
    useComments({ postId, open });
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMsg, setToastMsg] = React.useState('');
  const newCommentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && newCommentRef.current) {
      newCommentRef.current.focus();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await handleCommentSubmit();
      setToastMsg('Comment submitted!');
      setToastOpen(true);
      if (typeof onCommentSubmitted === 'function') {
        onCommentSubmitted();
      }
    } catch {}
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={(open) => !open && onClose()}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-fadeIn' />
          <Dialog.Content className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <div
              className='bg-white rounded-2xl shadow-xl w-full max-w-md md:max-w-2xl mx-auto p-6 relative flex flex-col max-h-[90vh]'
              role='dialog'
              aria-modal='true'
              aria-labelledby={`comments-title-${postId}`}
              aria-describedby={`comments-desc-${postId}`}
            >
              <Dialog.Close asChild>
                <Button
                  type='button'
                  variant='ghost'
                  className='absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700 cursor-pointer'
                  aria-label='Close comments modal'
                >
                  &times;
                </Button>
              </Dialog.Close>
              <Dialog.Title
                className='text-lg font-bold mb-2'
                id={`comments-title-${postId}`}
              >
                Comments({comments.length})
              </Dialog.Title>
              <label
                className='block text-sm font-semibold mb-2'
                id={`comments-desc-${postId}`}
                htmlFor={`comment-textarea-${postId}`}
              >
                Give your Comments
              </label>
              <form onSubmit={handleSubmit} aria-label='Comment form'>
                <textarea
                  ref={newCommentRef}
                  className='w-full p-3 border border-gray-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 transition shadow-sm mb-2'
                  rows={3}
                  placeholder='Enter your comment'
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={loading}
                  id={`comment-textarea-${postId}`}
                  aria-label='Comment textarea'
                  aria-required='true'
                />
                <Button
                  type='submit'
                  className='w-full bg-primary-300 hover:bg-primary-300/90 text-white font-bold cursor-pointer py-2 rounded-full text-base mb-4 transition-all disabled:opacity-60'
                  disabled={loading || !newComment.trim()}
                  aria-label='Send comment'
                >
                  Send
                </Button>
              </form>
              <div
                className='overflow-y-auto flex-1 space-y-6 pr-2'
                aria-label='Comments list'
              >
                {loading ? (
                  <div className='text-center text-gray-400' aria-live='polite'>
                    Loading...
                  </div>
                ) : comments.length === 0 ? (
                  <div className='text-center text-gray-400' aria-live='polite'>
                    No comments yet.
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className='flex gap-4 border-b border-gray-200 pb-4 last:border-b-0'
                      aria-label='Comment'
                    >
                      <AvatarIcon
                        user={comment.author}
                        size={40}
                        className='w-10 h-10'
                        aria-label={`Avatar of ${comment.author.name}`}
                      />
                      <div className='flex-1'>
                        <div>
                          <p
                            className='font-semibold text-gray-900'
                            aria-label='Comment author'
                          >
                            {comment.author.name}
                          </p>
                          <p
                            className='text-xs text-gray-500'
                            aria-label='Comment date'
                          >
                            {new Date(comment.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              }
                            )}
                          </p>
                        </div>
                        <p
                          className='mt-1 text-gray-800'
                          aria-label='Comment content'
                        >
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Toast
        open={toastOpen}
        onOpenChange={setToastOpen}
        title={toastMsg}
        duration={2200}
      />
    </>
  );
};
