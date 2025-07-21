import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Button } from './Buttons';

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  footer?: React.ReactNode;
}

export const SuccessDialog: React.FC<SuccessDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  footer,
}) => {
  const titleId = 'success-dialog-title';
  const descId = 'success-dialog-desc';
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
              <svg
                className='h-12 w-12 text-green-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
                focusable='false'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <AlertDialog.Title
              className='text-lg font-semibold text-gray-900 mb-2 text-center'
              id={titleId}
            >
              {title}
            </AlertDialog.Title>
            <AlertDialog.Description
              className='text-sm text-gray-600 text-center mb-6'
              id={descId}
            >
              {message}
            </AlertDialog.Description>
            <div className='flex gap-3'>
              {footer ? (
                footer
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
