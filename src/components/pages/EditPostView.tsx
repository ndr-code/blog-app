'use client';

import { Input } from '../ui/Input';
import { Button } from '../ui/Buttons';
import React from 'react';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { TooltipWrapper } from '../ui/Tooltips';
import { useAuth } from '@/hooks/useAuth';
import { DropdownMenuItem, SimpleDropdownMenu } from '../ui/DropdownMenu';
import { AvatarIcon } from '../ui/Avatar';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  RiAccountCircleLine,
  RiLogoutCircleRLine,
  RiStrikethrough,
  RiItalic,
  RiBold,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiAlignJustify,
  RiLink,
  RiLinkUnlink,
  RiImageFill,
  RiFormatClear,
} from 'react-icons/ri';
import {
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdWrapText,
  MdFullscreen,
} from 'react-icons/md';
import { LuCloudUpload } from 'react-icons/lu';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import TiptapLink from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import Code from '@tiptap/extension-code';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';

import { useParams } from 'next/navigation';

const EditPostView = () => {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState('');
  const [image, setImage] = React.useState<File | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const params = useParams();
  const postId = params?.id;

  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = React.useState(false);

  const { user, isLoggedIn, logout } = useAuth();

  function handleLogout() {
    setShowLogoutConfirm(true);
  }

  function confirmLogout() {
    if (typeof window !== 'undefined' && typeof logout === 'function') {
      logout();
      window.location.href = '/';
    } else {
      window.location.href = '/login';
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (idx: number) => {
    setTags(tags.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      if (title) formData.append('title', title);
      if (content) formData.append('content', content);
      if (tags.length > 0) {
        formData.append('tags', JSON.stringify(tags));
      }
      if (image) formData.append('image', image);

      const token = localStorage.getItem('token');
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: formData,
      });
      if (!res.ok) {
        let errMsg = 'Failed to update post';
        try {
          const err = await res.json();
          errMsg = err.message || errMsg;
        } catch {}
        setError(errMsg);
        setLoading(false);
        return;
      }

      setLoading(false);
      window.location.href = `/post/${postId}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
      setLoading(false);
    }
  };

  React.useEffect(() => {
    async function fetchPost() {
      if (!postId) return;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/posts/${postId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        setTitle(data.title || '');
        setContent(data.content || '');
        setTags(Array.isArray(data.tags) ? data.tags : []);
        setImageUrl(data.imageUrl || '');
      } catch {}
    }
    fetchPost();
  }, [postId]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Strike,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
      TiptapLink,
      Image,
      Paragraph,
      Text,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Code,
      Blockquote,
      HorizontalRule,
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          'min-h-[180px] outline-none px-4 py-3 border-0 focus:outline-none resize-y text-sm',
        placeholder: 'Enter your content',
      },
    },
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
    immediatelyRender: false,
  });

  React.useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <div className='' role='main' aria-label='Edit post main content'>
      <header className='flex items-center justify-between bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-md/10 w-full h-20 px-30'>
        <div>
          <h1
            className='text-xl font-bold flex items-center gap-2 '
            tabIndex={0}
            aria-label='Edit Post'
          >
            <Link href='/'>
              <Button
                type='button'
                className='mr-2 text-xl'
                aria-label='Back to Home'
                variant='ghost'
              >
                &#8592;
              </Button>
            </Link>
            Edit Post
          </h1>
        </div>
        <div>
          {isLoggedIn && user && (
            <SimpleDropdownMenu
              trigger={
                <div
                  className='flex items-center gap-2 cursor-pointer min-w-[182px] h-12 justify-center'
                  role='button'
                  aria-label='User menu'
                  tabIndex={0}
                >
                  <AvatarIcon
                    user={user}
                    size={32}
                    aria-label={`User avatar: ${user.name}`}
                  />
                  <span className='text-neutral-900 text-base font-medium ml-2 hover:underline hover:text-primary-300 hover:underline-offset-2'>
                    {user.name}
                  </span>
                </div>
              }
            >
              <DropdownMenuItem asChild>
                <Link
                  href={`/profile/${user.id}`}
                  className='flex items-center gap-2'
                >
                  <RiAccountCircleLine className='w-6 h-6' />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleLogout}
                className='flex items-center gap-2'
              >
                <RiLogoutCircleRLine className='w-6 h-6' />
                Logout
              </DropdownMenuItem>
            </SimpleDropdownMenu>
          )}
        </div>
      </header>
      <form
        className='space-y-6 max-w-3xl mx-auto py-8'
        aria-label='Edit post form'
        onSubmit={(e) => {
          e.preventDefault();
          setShowUpdateConfirm(true);
        }}
        encType='multipart/form-data'
      >
        {/* Title */}
        <div>
          <label className='block mb-2 text-md font-semibold'>Title</label>
          <Input
            type='text'
            placeholder={title ? title : 'Enter your title'}
            className='w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            aria-label='Post title input'
          />
        </div>
        {/* Content */}
        <div>
          <label className='block text-md font-semibold mb-2'>Content</label>
          <div
            className='border border-neutral-300 rounded-xl '
            role='region'
            aria-label='Post content editor'
          >
            {/* Toolbar placeholder */}
            <div className='flex items-center px-2 py-1 border-b border-neutral-300 gap-1 bg-gray-50 text-sm rounded-t-xl'>
              <select className='border px-2 py-0.5 border-neutral-300 rounded-sm text-sm'>
                <option aria-label='Heading 1'>Heading 1</option>
                <option aria-label='Heading 2'>Heading 2</option>
                <option aria-label='Normal'>Normal</option>
              </select>
              |
              <TooltipWrapper content='Bold'>
                <Button
                  type='button'
                  className='px-1 font-bold'
                  variant='phantom'
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  disabled={!editor}
                >
                  <RiBold />
                </Button>
              </TooltipWrapper>
              <TooltipWrapper content='Strikethrough'>
                <Button
                  type='button'
                  className='px-1'
                  variant='phantom'
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                  disabled={!editor}
                >
                  <RiStrikethrough />
                </Button>
              </TooltipWrapper>
              <TooltipWrapper content='Italic'>
                <Button
                  type='button'
                  className='px-1 italic'
                  variant='phantom'
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  disabled={!editor}
                >
                  <RiItalic />
                </Button>
              </TooltipWrapper>
              |
              <TooltipWrapper content='Bulleted List'>
                <Button
                  type='button'
                  className='px-1'
                  variant='phantom'
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                  disabled={!editor}
                >
                  <MdFormatListBulleted />
                </Button>
              </TooltipWrapper>
              <TooltipWrapper content='Numbered List'>
                <Button
                  type='button'
                  className='px-1'
                  variant='phantom'
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                  disabled={!editor}
                >
                  <MdFormatListNumbered />
                </Button>
              </TooltipWrapper>
              |
              <TooltipWrapper content='Align Left'>
                <Button
                  type='button'
                  className='px-1'
                  variant='phantom'
                  onClick={() =>
                    editor?.chain().focus().setTextAlign('left').run()
                  }
                  disabled={!editor}
                >
                  <RiAlignLeft />
                </Button>
              </TooltipWrapper>
              <TooltipWrapper content='Align Center'>
                <Button
                  type='button'
                  className='px-1'
                  variant='phantom'
                  onClick={() =>
                    editor?.chain().focus().setTextAlign('center').run()
                  }
                  disabled={!editor}
                >
                  <RiAlignCenter />
                </Button>
              </TooltipWrapper>
              <TooltipWrapper content='Align Right'>
                <Button
                  type='button'
                  className='px-1'
                  variant='phantom'
                  onClick={() =>
                    editor?.chain().focus().setTextAlign('right').run()
                  }
                  disabled={!editor}
                >
                  <RiAlignRight />
                </Button>
              </TooltipWrapper>
              <TooltipWrapper content='Justify'>
                <Button
                  type='button'
                  className='px-1'
                  variant='phantom'
                  onClick={() =>
                    editor?.chain().focus().setTextAlign('justify').run()
                  }
                  disabled={!editor}
                >
                  <RiAlignJustify />
                </Button>
              </TooltipWrapper>
              |
              <TooltipWrapper content='Link'>
                <Button
                  type='button'
                  className='px-1'
                  variant='phantom'
                  onClick={() => {
                    if (!editor) return;
                    const url = window.prompt('Enter URL');
                    if (url)
                      editor.chain().focus().setLink({ href: url }).run();
                  }}
                  disabled={!editor}
                >
                  <RiLink />
                </Button>
              </TooltipWrapper>
              <TooltipWrapper content='Unlink'>
                <Button
                  type='button'
                  className='px-1'
                  variant='phantom'
                  onClick={() => editor?.chain().focus().unsetLink().run()}
                  disabled={!editor}
                >
                  <RiLinkUnlink />
                </Button>
              </TooltipWrapper>
              <TooltipWrapper content='Image'>
                <Button
                  type='button'
                  className='px-1'
                  variant='phantom'
                  onClick={() => {
                    if (!editor) return;
                    const url = window.prompt('Enter image URL');
                    if (url)
                      editor.chain().focus().setImage({ src: url }).run();
                  }}
                  disabled={!editor}
                >
                  <RiImageFill />
                </Button>
              </TooltipWrapper>
              |
              <TooltipWrapper content='Wrap Text'>
                <Button
                  type='button'
                  className='px-1'
                  variant='phantom'
                  onClick={() => editor?.chain().focus().setHardBreak().run()}
                  disabled={!editor}
                >
                  <MdWrapText />
                </Button>
              </TooltipWrapper>
              <TooltipWrapper content='Clear Format'>
                <Button
                  type='button'
                  className='px-1'
                  variant='phantom'
                  onClick={() =>
                    editor?.chain().focus().unsetAllMarks().clearNodes().run()
                  }
                  disabled={!editor}
                >
                  <RiFormatClear />
                </Button>
              </TooltipWrapper>
              |
              <TooltipWrapper content='Fullscreen'>
                <Button
                  type='button'
                  className='px-1'
                  variant='phantom'
                  disabled
                >
                  <MdFullscreen />
                </Button>
              </TooltipWrapper>
            </div>
            <EditorContent editor={editor} />
          </div>
        </div>
        {/* Cover Image */}
        <div>
          <label className='block text-md font-semibold mb-2'>
            Cover Image
          </label>
          <div
            className='border-2 border-dashed border-neutral-300 bg-neutral-100 rounded-xl flex flex-col items-center justify-center py-8 cursor-pointer hover:border-blue-400 transition-colors  text-sm'
            onClick={() =>
              document.getElementById('cover-image-upload')?.click()
            }
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (
                file &&
                (file.type === 'image/png' || file.type === 'image/jpeg') &&
                file.size <= 5 * 1024 * 1024
              ) {
                setImage(file);
                setImageUrl(URL.createObjectURL(file));
              }
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <span className='text-2xl mb-2 border border-neutral-300 rounded-xl p-2'>
              <LuCloudUpload />
            </span>
            {imageUrl && (
              <NextImage
                src={imageUrl}
                alt='Current Cover'
                width={320}
                height={160}
                className='rounded-lg mb-2 max-h-40 object-cover border border-neutral-200'
                style={{ width: '100%', maxWidth: '320px' }}
              />
            )}
            <span>
              <span className='text-primary-300 font-medium cursor-pointer'>
                Click to upload
              </span>
              <span className='mx-1 text-neutral-500'>or</span>
              <span className='text-neutral-700'>drag and drop</span>
            </span>
            <span className='text-sm text-neutral-400 mt-1'>
              PNG or JPG (max. 5mb, required)
            </span>
            <input
              type='file'
              accept='image/png, image/jpeg'
              className='hidden'
              id='cover-image-upload'
              onChange={handleImageChange}
            />
          </div>
        </div>
        {/* Tags */}
        <div>
          <label className='block text-md font-semibold mb-2'>Tags</label>
          <div className='w-full border rounded px-2 py-2 flex flex-wrap items-center min-h-[44px] bg-white'>
            {tags.map((tag, idx) => (
              <div
                key={tag}
                className='flex items-center bg-gray-200 rounded px-2 py-1 text-sm'
              >
                <span>{tag}</span>
                <button
                  type='button'
                  className='ml-1 text-gray-500 hover:text-red-500 focus:outline-none'
                  aria-label='Remove tag'
                  onClick={() => removeTag(idx)}
                >
                  ✕
                </button>
              </div>
            ))}
            <input
              type='text'
              className='flex-1 min-w-[120px] border-none outline-none bg-transparent py-1 px-2 text-base'
              placeholder={tags.length === 0 ? 'Enter your tags' : ''}
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
            />
          </div>
        </div>
        {/* Error Message */}
        {!!error && <div className='text-red-500 text-sm mb-4'>{error}</div>}

        {/* Confirm Logout Dialog */}
        <ConfirmDialog
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          title='Confirm Logout'
          message='Are you sure you want to log out?'
          actionText='Logout'
          onAction={confirmLogout}
        />
        {/* Finish Button */}
        <div className='flex justify-end mt-8'>
          <Button
            type='submit'
            variant='primary'
            className='px-30 py-3'
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Finish'}
          </Button>
        </div>
        {/* Confirm Update Dialog */}
        <ConfirmDialog
          isOpen={showUpdateConfirm}
          onClose={() => setShowUpdateConfirm(false)}
          title='Confirm Update'
          message='Are you sure you want to update this post?'
          actionText='Update'
          onAction={() => {
            setShowUpdateConfirm(false);
            handleSubmit();
          }}
        />
      </form>
    </div>
  );
};

export default EditPostView;
