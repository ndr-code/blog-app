import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Button } from './Buttons';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  footer?: React.ReactNode;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  actionText,
  onAction,
  footer,
}) => {
  const titleId = 'confirm-dialog-title';
  const descId = 'confirm-dialog-desc';
  return (
    <AlertDialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          className='fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 bg-blur-xl'
          aria-hidden='true'
        />
        <AlertDialog.Content className='fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none'>
          <div className='bg-white rounded-xl shadow-lg max-w-sm w-full p-6 pointer-events-auto'>
            <div className='flex items-center justify-center mb-4'>
              {title?.toLowerCase().includes('submit') ||
              title?.toLowerCase().includes('update') ||
              title?.toLowerCase().includes('edit') ||
              actionText?.toLowerCase().includes('submit') ||
              actionText?.toLowerCase().includes('update') ||
              actionText?.toLowerCase().includes('edit') ? (
                <svg
                  className='h-12 w-12'
                  viewBox='0 0 48 48'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  aria-hidden='true'
                  focusable='false'
                >
                  <circle
                    cx='24'
                    cy='24'
                    r='22'
                    fill='#0093dd'
                    stroke='white'
                    strokeWidth='2'
                  />
                  <rect
                    x='22'
                    y='16'
                    width='4'
                    height='14'
                    rx='2'
                    fill='white'
                  />
                  <rect
                    x='22'
                    y='33'
                    width='4'
                    height='4'
                    rx='2'
                    fill='white'
                  />
                </svg>
              ) : (
                <svg
                  className='h-[58px] w-[58px]'
                  viewBox='0 0 58 58'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  aria-hidden='true'
                  focusable='false'
                >
                  <path
                    d='M29 8 L52 49 Q56 55 50 55 L8 55 Q2 55 6 49 Z'
                    fill='#ef4444'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinejoin='round'
                    strokeLinecap='round'
                  />
                  <rect
                    x='27'
                    y='20'
                    width='4'
                    height='18'
                    rx='4'
                    fill='white'
                  />
                  <rect
                    x='27'
                    y='41'
                    width='4'
                    height='6'
                    rx='2'
                    fill='white'
                  />
                </svg>
              )}
            </div>
            {title ? (
              <AlertDialog.Title
                className='text-lg font-semibold text-gray-900 mb-2 text-center'
                id={titleId}
              >
                {title}
              </AlertDialog.Title>
            ) : (
              <AlertDialog.Title id={titleId}>
                {title ? title : <VisuallyHidden>Hidden</VisuallyHidden>}
              </AlertDialog.Title>
            )}
            <AlertDialog.Description
              className='text-sm text-gray-600 text-center mb-6'
              id={descId}
            >
              {message}
            </AlertDialog.Description>
            <div className='flex gap-3'>
              {footer ? (
                footer
              ) : actionText && onAction ? (
                <>
                  <AlertDialog.Cancel asChild>
                    <Button
                      onClick={onClose}
                      variant='secondary'
                      className='flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer'
                      aria-label='Cancel'
                    >
                      Cancel
                    </Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <Button
                      onClick={onAction}
                      className='flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-300 rounded-full hover:bg-primary-400 transition-colors cursor-pointer'
                      aria-label={actionText}
                    >
                      {actionText}
                    </Button>
                  </AlertDialog.Action>
                </>
              ) : (
                <AlertDialog.Action asChild>
                  <Button
                    onClick={onClose}
                    className='w-full px-4 py-2 text-sm font-medium text-white bg-primary-300 rounded-full hover:bg-primary-400 transition-colors cursor-pointer'
                    aria-label='Continue'
                  >
                    Continue
                  </Button>
                </AlertDialog.Action>
              )}
            </div>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
