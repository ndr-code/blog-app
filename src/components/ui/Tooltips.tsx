'use client';
import * as Tooltip from '@radix-ui/react-tooltip';
import React from 'react';

// Generic Tooltip wrapper
export function TooltipWrapper({
  content,
  children,
}: {
  content: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip.Root delayDuration={0}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side='top'
          align='center'
          className='px-3 py-1 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg'
          role='tooltip'
          aria-live='polite'
        >
          {content}
          <Tooltip.Arrow className='fill-gray-800' />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

// LikeTooltip

export function LikeTooltip({ children }: { children: React.ReactNode }) {
  const tooltipId = 'like-tooltip';
  return (
    <Tooltip.Root delayDuration={0}>
      <Tooltip.Trigger asChild aria-describedby={tooltipId}>
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          id={tooltipId}
          side='top'
          align='center'
          className='px-3 py-1 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg'
          role='tooltip'
          aria-live='polite'
        >
          Login to like posts
          <Tooltip.Arrow className='fill-gray-800' />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

// CommentTooltip

export function CommentTooltip({ children }: { children: React.ReactNode }) {
  const tooltipId = 'comment-tooltip';
  return (
    <Tooltip.Root delayDuration={0}>
      <Tooltip.Trigger asChild aria-describedby={tooltipId}>
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          id={tooltipId}
          side='top'
          align='center'
          className='px-3 py-1 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg'
          role='tooltip'
          aria-live='polite'
        >
          Login to give comments
          <Tooltip.Arrow className='fill-gray-800' />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
