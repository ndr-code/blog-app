import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Input } from './Input';
import { Button } from './Buttons';
import { TooltipWrapper } from './Tooltips';
import {
  RiStrikethrough,
  RiItalic,
  RiBold,
  RiLink,
  RiFormatClear,
} from 'react-icons/ri';
import { MdFormatListBulleted, MdFormatListNumbered } from 'react-icons/md';
import { LuCloudUpload } from 'react-icons/lu';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import TiptapLink from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Code from '@tiptap/extension-code';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';

export interface PostFormProps {
  mode: 'create' | 'edit';
  initialValues: {
    title: string;
    content: string;
    tags: string[];
    imageUrl?: string;
  };
  onSubmit: (data: {
    title: string;
    content: string;
    tags: string[];
    image: File | null;
  }) => void;
  loading: boolean;
  fieldErrors: { title: string; content: string; tags: string; image: string };
  user?: object | null;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export const PostForm: React.FC<PostFormProps> = ({
  mode,
  initialValues,
  onSubmit,
  loading,
  fieldErrors,
}) => {
  const [title, setTitle] = useState(initialValues.title || '');
  const [content, setContent] = useState(initialValues.content || '');
  const [tags, setTags] = useState<string[]>(initialValues.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initialValues.imageUrl || '');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Strike,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      OrderedList,
      ListItem,
      TiptapLink.configure({
        openOnClick: false,
      }),
      ImageExtension,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Code,
      Blockquote,
      HorizontalRule,
    ],
    content: initialValues.content || '<p></p>',
    editorProps: {
      attributes: {
        class: 'outline-none focus:outline-none text-sm',
        'data-placeholder': 'Enter your content...',
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    setTitle(initialValues.title || '');
    setTags(initialValues.tags || []);
    setImageUrl(initialValues.imageUrl || '');

    // Only update content if editor exists and content is different
    if (
      editor &&
      initialValues.content &&
      initialValues.content !== editor.getHTML()
    ) {
      editor.commands.setContent(initialValues.content);
      setContent(initialValues.content);
    }
  }, [initialValues, editor]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageUrl('');
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === 'Enter' || e.key === ',' || e.key === ' ') &&
      tagInput.trim()
    ) {
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      tags,
      image,
    });
  };

  return (
    <form
      className='space-y-6 w-full max-w-3xl mx-auto py-8 px-4 sm:px-6'
      onSubmit={handleFormSubmit}
      encType='multipart/form-data'
      aria-label={mode === 'edit' ? 'Edit post form' : 'Write post form'}
    >
      {/* Title */}
      <div>
        <label className='block mb-2 text-md font-semibold'>Title</label>
        <Input
          type='text'
          placeholder={
            mode === 'edit' && initialValues.title
              ? initialValues.title
              : 'Enter your title'
          }
          className='w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-300 text-sm'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label='Post title input'
        />
        {fieldErrors.title && (
          <div className='text-xs text-red-500 italic mt-1'>
            {fieldErrors.title}
          </div>
        )}
      </div>
      {/* Content */}
      <div>
        <label className='block text-md font-semibold mb-2'>Content</label>
        <div
          className='border border-neutral-300 rounded-xl '
          role='region'
          aria-label='Post content editor'
        >
          <div className='flex flex-wrap items-center px-2 py-1 border-b border-neutral-300 gap-1 sm:gap-2 bg-gray-50 text-sm rounded-t-xl'>
            <select
              className='border px-2 py-0.5 border-neutral-300 rounded-sm text-sm'
              onChange={(e) => {
                if (!editor) return;
                const value = e.target.value;
                if (value === 'h1') {
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
                } else if (value === 'h2') {
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
                } else if (value === 'h3') {
                  editor.chain().focus().toggleHeading({ level: 3 }).run();
                } else {
                  editor.chain().focus().setParagraph().run();
                }
              }}
              value={
                editor?.isActive('heading', { level: 1 })
                  ? 'h1'
                  : editor?.isActive('heading', { level: 2 })
                  ? 'h2'
                  : editor?.isActive('heading', { level: 3 })
                  ? 'h3'
                  : 'p'
              }
            >
              <option value='p'>Normal</option>
              <option value='h1'>Heading 1</option>
              <option value='h2'>Heading 2</option>
              <option value='h3'>Heading 3</option>
            </select>
            |
            <TooltipWrapper content='Bold'>
              <Button
                type='button'
                className={`px-1 font-bold ${
                  editor?.isActive('bold') ? 'bg-gray-200' : ''
                }`}
                variant='phantom'
                onClick={() =>
                  editor && editor.chain().focus().toggleBold().run()
                }
                disabled={!editor}
              >
                <RiBold />
              </Button>
            </TooltipWrapper>
            <TooltipWrapper content='Italic'>
              <Button
                type='button'
                className={`px-1 italic ${
                  editor?.isActive('italic') ? 'bg-gray-200' : ''
                }`}
                variant='phantom'
                onClick={() =>
                  editor && editor.chain().focus().toggleItalic().run()
                }
                disabled={!editor}
              >
                <RiItalic />
              </Button>
            </TooltipWrapper>
            <TooltipWrapper content='Strikethrough'>
              <Button
                type='button'
                className={`px-1 ${
                  editor?.isActive('strike') ? 'bg-gray-200' : ''
                }`}
                variant='phantom'
                onClick={() =>
                  editor && editor.chain().focus().toggleStrike().run()
                }
                disabled={!editor}
              >
                <RiStrikethrough />
              </Button>
            </TooltipWrapper>
            |
            <TooltipWrapper content='Bulleted List'>
              <Button
                type='button'
                className={`px-1 ${
                  editor?.isActive('bulletList') ? 'bg-gray-200' : ''
                }`}
                variant='phantom'
                onClick={() =>
                  editor && editor.chain().focus().toggleBulletList().run()
                }
                disabled={!editor}
              >
                <MdFormatListBulleted />
              </Button>
            </TooltipWrapper>
            <TooltipWrapper content='Numbered List'>
              <Button
                type='button'
                className={`px-1 ${
                  editor?.isActive('orderedList') ? 'bg-gray-200' : ''
                }`}
                variant='phantom'
                onClick={() =>
                  editor && editor.chain().focus().toggleOrderedList().run()
                }
                disabled={!editor}
              >
                <MdFormatListNumbered />
              </Button>
            </TooltipWrapper>
            |
            <TooltipWrapper content='Link'>
              <Button
                type='button'
                className={`px-1 ${
                  editor?.isActive('link') ? 'bg-gray-200' : ''
                }`}
                variant='phantom'
                onClick={() => {
                  if (!editor) return;
                  const previousUrl = editor.getAttributes('link').href;
                  const url = window.prompt('Enter URL', previousUrl);

                  if (url === null) return;

                  if (url === '') {
                    editor
                      .chain()
                      .focus()
                      .extendMarkRange('link')
                      .unsetLink()
                      .run();
                    return;
                  }

                  editor
                    .chain()
                    .focus()
                    .extendMarkRange('link')
                    .setLink({ href: url })
                    .run();
                }}
                disabled={!editor}
              >
                <RiLink />
              </Button>
            </TooltipWrapper>
            <TooltipWrapper content='Clear Format'>
              <Button
                type='button'
                className='px-1'
                variant='phantom'
                onClick={() =>
                  editor &&
                  editor.chain().focus().unsetAllMarks().clearNodes().run()
                }
                disabled={!editor}
              >
                <RiFormatClear />
              </Button>
            </TooltipWrapper>
          </div>
          <div className='min-h-[180px] p-0'>
            <EditorContent
              editor={editor}
              className='prose prose-sm max-w-none min-h-[180px] focus-within:outline-none'
            />
          </div>
        </div>
        {fieldErrors.content && (
          <div className='text-xs text-red-500 italic mt-1'>
            {fieldErrors.content}
          </div>
        )}
      </div>
      {/* Cover Image */}
      <div>
        <label className='block text-md font-semibold mb-2'>Cover Image</label>
        <div
          className='border-2 border-dashed border-neutral-300 bg-neutral-100 rounded-xl flex flex-col items-center justify-center py-8 cursor-pointer hover:border-blue-400 transition-colors  text-sm w-full max-w-full'
          onClick={() => document.getElementById('cover-image-upload')?.click()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (
              file &&
              (file.type === 'image/png' || file.type === 'image/jpeg') &&
              file.size <= 5 * 1024 * 1024
            ) {
              setImage(file);
              setImageUrl('');
            }
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          {!imageUrl && (
            <span className='text-2xl mb-2 border border-neutral-300 rounded-xl p-2'>
              <LuCloudUpload />
            </span>
          )}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt='Current Cover'
              width={320}
              height={160}
              className='rounded-lg mb-2 max-h-120 object-cover border border-neutral-200 w-full max-w-xs sm:max-w-sm md:max-w-md'
              style={{ width: '100%', maxWidth: '640px' }}
            />
          )}

          {!imageUrl ? (
            <span>
              <span className='text-primary-300 font-medium cursor-pointer'>
                Click to upload
              </span>
              <span className='mx-1 text-neutral-500'>or</span>
              <span className='text-neutral-700'>drag and drop</span>
            </span>
          ) : (
            <span>
              <span className='text-primary-300 font-medium cursor-pointer'>
                Click to change image
              </span>
              <span className='mx-1 text-neutral-500'>or</span>
              <span className='text-neutral-700'>drag and drop</span>
            </span>
          )}
          <span className='text-sm text-neutral-400 mt-1'>
            PNG or JPG (max. 5mb)
          </span>
          <input
            type='file'
            accept='image/png, image/jpeg'
            className='hidden'
            id='cover-image-upload'
            onChange={handleImageChange}
          />
          {image && (
            <span className='text-sm text-green-600 mt-2 break-all w-full text-center'>
              Selected: {image.name}
            </span>
          )}
        </div>
        {fieldErrors.image && (
          <div className='text-xs text-red-500 italic mt-1'>
            {fieldErrors.image}
          </div>
        )}
      </div>
      {/* Tags */}
      <div>
        <label className='block text-md font-semibold mb-2'>Tags</label>
        <div className='w-full border border-neutral-300 rounded-xl px-2 py-2 flex flex-wrap items-center min-h-[44px] bg-white gap-2'>
          {tags.map((tag, idx) => (
            <div
              key={tag}
              className='flex items-center bg-gray-200 rounded px-2 py-1 text-sm mb-1'
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
            className='flex-1 min-w-[120px] border-none outline-none bg-transparent py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 focus:ring-offset-white rounded'
            placeholder={tags.length === 0 ? 'Enter your tags' : ''}
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleTagInputKeyDown}
          />
        </div>
        {fieldErrors.tags && (
          <div className='text-xs text-red-500 italic mt-1'>
            {fieldErrors.tags}
          </div>
        )}
      </div>
      {/* Finish Button */}
      <div className='flex flex-col sm:flex-row justify-end mt-8 gap-2'>
        <Button
          type='submit'
          variant='primary'
          className='px-8 py-3 w-full sm:w-60'
          disabled={loading}
          aria-label={mode === 'edit' ? 'Update post' : 'Submit post'}
        >
          {loading
            ? mode === 'edit'
              ? 'Updating...'
              : 'Submitting...'
            : mode === 'edit'
            ? 'Update'
            : 'Finish'}
        </Button>
      </div>
    </form>
  );
};
