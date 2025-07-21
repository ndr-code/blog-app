import * as ToastPrimitive from '@radix-ui/react-toast';
import React from 'react';

export interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  open,
  onOpenChange,
  title,
  description,
  duration = 3000,
}) => (
  <ToastPrimitive.Provider swipeDirection='right'>
    <ToastPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
      className='fixed bottom-6 right-6 z-[9999] bg-primary-300 rounded-lg shadow-lg px-4 py-3 min-w-[240px] max-w-xs flex flex-col gap-1 animate-in fade-in'
    >
      <ToastPrimitive.Title className='font-semibold text-white text-base'>
        {title}
      </ToastPrimitive.Title>
      {description && (
        <ToastPrimitive.Description className='text-gray-600 text-sm'>
          {description}
        </ToastPrimitive.Description>
      )}
      <ToastPrimitive.Close className='absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-lg cursor-pointer'>
        ×
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
    <ToastPrimitive.Viewport className='fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-[360px] max-w-full z-[9999]' />
  </ToastPrimitive.Provider>
);
