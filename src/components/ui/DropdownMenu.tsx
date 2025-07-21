import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import React from 'react';

type SimpleDropdownMenuProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
};

export function SimpleDropdownMenu({
  trigger,
  children,
  align = 'end',
}: SimpleDropdownMenuProps) {

  let ariaLabel = 'Dropdown menu';
  if (
    React.isValidElement(trigger) &&
    trigger.props &&
    (trigger.props as { 'aria-label'?: string })['aria-label']
  ) {
    ariaLabel = (trigger.props as { 'aria-label'?: string })['aria-label'] ?? 'Dropdown menu';
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} aria-label={ariaLabel}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, 'aria-label': ariaLabel, ...props }, ref) => (
  <DropdownMenuPrimitive.Content
    ref={ref}
    align='end'
    sideOffset={8}
    className={`rounded-xl border border-neutral-200 bg-white shadow-md py-2 z-50 min-w-[140px] ${
      className || ''
    }`}
    role='menu'
    aria-label={ariaLabel || 'Dropdown menu'}
    {...props}
  />
));
DropdownMenuContent.displayName = 'DropdownMenuContent';

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={`px-4 py-2 text-neutral-700 text-sm cursor-pointer hover:bg-neutral-100 focus:bg-neutral-100 outline-none ${
      className || ''
    }`}
    {...props}
  />
));
DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;
export const DropdownMenuLabel = DropdownMenuPrimitive.Label;
