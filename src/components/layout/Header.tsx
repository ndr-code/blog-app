'use client';

import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { RiAccountCircleLine, RiLogoutCircleRLine } from 'react-icons/ri';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/interfaces/post.interface';

import { SearchBar } from '../ui/SearchBar';
import { IconButton } from '../ui/Buttons';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { SimpleDropdownMenu, DropdownMenuItem } from '../ui/DropdownMenu';
import { Button } from '../ui/Buttons';
import { AvatarIcon } from '../ui/Avatar';
import { LuPencilLine } from 'react-icons/lu';

type DesktopActionsProps = {
  user: User | null;
  handleLogout: () => void;
};

// Desktop Actions component
const DesktopActions = ({ user, handleLogout }: DesktopActionsProps) => {
  const { isLoggedIn } = useAuth();
  function onWritePost(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();
    window.location.href = '/post/write';
  }
  return (
    <div className='hidden lg:flex items-center gap-4'>
      {!isLoggedIn ? (
        <div className='flex items-center gap-4'>
          <Button
            asChild
            variant='ghost'
            className='min-w-35 text-md px-4 py-2'
          >
            <Link href='/login'>Login</Link>
          </Button>
          <Button
            asChild
            variant='primary'
            className='min-w-45 h-12 text-md px-4 py-2'
          >
            <Link href='/register'>Register</Link>
          </Button>
        </div>
      ) : user ? (
        <>
          {isLoggedIn && (
            <Button
              variant='ghost'
              className='rounded-full px-6 py-2 min-w-45 text-base font-semibold flex items-center gap-2'
              onClick={onWritePost}
            >
              <LuPencilLine size={20} className='inline-block mr-2' />
              Write Post
            </Button>
          )}
          <SimpleDropdownMenu
            trigger={
              <div className='flex items-center gap-2 cursor-pointer min-w-[182px] h-12 justify-center'>
                <AvatarIcon user={user} size={32} />
                <span className='text-neutral-900 text-base font-medium ml-2 hover:underline hover:text-primary-300 hover:underline-offset-2'>
                  {user.name}
                </span>
              </div>
            }
          >
            <DropdownMenuItem asChild>
              <Link
                href={user ? `/profile/${user.id}` : '/profile'}
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
        </>
      ) : null}
    </div>
  );
};

// Mobile Actions component

type MobileActionsProps = {
  setShowMobileSearch: (show: boolean) => void;
  setShowMobileMenu: (show: boolean) => void;
  user?: User | null;
  isLoggedIn?: boolean;
};

const MobileActions = ({
  setShowMobileSearch,
  setShowMobileMenu,
  user,
  isLoggedIn,
}: MobileActionsProps) => (
  <div className='flex items-center gap-2 lg:hidden'>
    <IconButton
      aria-label='Search'
      onClick={() => setShowMobileSearch(true)}
      size='md'
      className='text-neutral-600'
    >
      <FiSearch className='w-6 h-6' />
    </IconButton>
    {isLoggedIn && user ? (
      <span onClick={() => setShowMobileMenu(true)} className='cursor-pointer'>
        <AvatarIcon user={user} size={32} />
      </span>
    ) : (
      <IconButton
        aria-label='Open menu'
        onClick={() => setShowMobileMenu(true)}
        size='md'
        className='text-neutral-700'
      >
        {/* Hamburger icon */}
        <svg
          className='w-7 h-7'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 6h16M4 12h16M4 18h16'
          />
        </svg>
      </IconButton>
    )}
  </div>
);

// Mobile Menu component

const MobileMenu = ({
  user,
  showMobileMenu,
  setShowMobileMenu,
  handleLogout,
  isLoggedIn,
}: {
  user: User | null;
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  handleLogout: () => void;
  isLoggedIn: boolean;
}) => {
  if (!showMobileMenu) return null;
  return (
    <div className='fixed inset-0 z-50 lg:hidden'>
      <div
        className='absolute inset-0 bg-white/70 backdrop-blur-sm'
        onClick={() => setShowMobileMenu(false)}
      />
      <div className='absolute right-0 top-0 h-full w-full bg-white shadow-lg'>
        <div className='flex flex-col h-full'>
          {/* Header */}
          <div className='flex items-center justify-between p-4 border-b border-neutral-200'>
            <Link href='/' className='flex items-center gap-2'>
              <Image
                src='/yourlogo.svg'
                alt='Logo'
                width={32}
                height={32}
                style={{ width: 32, height: 32 }}
              />
              <span className='font-bold px-2 sm:px-4 text-lg md:text-2xl text-neutral-900'>
                Blog
              </span>
            </Link>
            <IconButton
              aria-label='Close menu'
              onClick={() => setShowMobileMenu(false)}
              className='p-2 text-neutral-600 hover:text-neutral-900'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </IconButton>
          </div>
          {/* Menu Items */}
          <div className='flex-1 p-4'>
            {isLoggedIn && user ? (
              <>
                <div className='flex items-center gap-3 px-4 py-2 mb-2'>
                  <AvatarIcon user={user} size={32} />
                  <span className='text-neutral-900 text-base font-medium'>
                    {user.name}
                  </span>
                </div>

                <Link
                  href='/post/write'
                  className='flex items-center gap-2 px-4 py-3 hover:bg-neutral-100  text-neutral-700 text-base rounded cursor-pointer w-full text-left'
                  onClick={() => setShowMobileMenu(false)}
                >
                  <LuPencilLine size={20} className='inline-block' />
                  Write Post
                </Link>
                <Link
                  href={user ? `/profile/${user.id}` : '/profile'}
                  className='flex items-center gap-2 px-4 py-3 hover:bg-neutral-100 text-neutral-700 text-base rounded cursor-pointer'
                  onClick={() => setShowMobileMenu(false)}
                >
                  <RiAccountCircleLine className='w-6 h-6 ' />
                  Profile
                </Link>
                <Button
                  type='button'
                  className='flex items-center gap-2 px-4 py-3 text-neutral-700 text-base rounded cursor-pointer w-full text-left'
                  variant='primary'
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className='flex flex-col justify-center items-center gap-4'>
                <Button
                  asChild
                  variant='ghost'
                  className='max-w-60 flex items-center gap-2 px-4 py-2 text-neutral-700 text-base rounded cursor-pointer w-full text-left'
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Link href='/login'>Login</Link>
                </Button>
                <Button
                  asChild
                  variant='primary'
                  className='max-w-60 flex items-center gap-2 px-4 py-2 text-neutral-700 text-base rounded cursor-pointer w-full text-left'
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Link href='/register'>Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile Search component

type MobileSearchProps = {
  showMobileSearch: boolean;
  setShowMobileSearch: (show: boolean) => void;
};

const MobileSearch = ({
  showMobileSearch,
  setShowMobileSearch,
}: MobileSearchProps) => {
  if (!showMobileSearch) return null;
  return (
    <div className='fixed inset-0 z-50 bg-white flex items-start justify-center pt-20'>
      <div className='bg-neutral-25 w-full max-w-md mx-4 rounded-xl shadow-lg p-4 flex flex-col'>
        <div className='flex justify-between items-center mb-4'>
          <span className='font-bold text-neutral-900'>Search</span>
          <IconButton
            aria-label='Close search'
            onClick={() => setShowMobileSearch(false)}
            className='text-2xl text-neutral-600 hover:text-neutral-900 cursor-pointer px-2 py-0 h-auto min-w-0 bg-transparent'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </IconButton>
        </div>
        <SearchBar onSearchComplete={() => setShowMobileSearch(false)} />
      </div>
    </div>
  );
};

// Main component for Header

const Header = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };
  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    window.location.reload();
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      if (window.scrollY > 0) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      } else {
        e.preventDefault();
        window.location.reload();
      }
    }
  };

  return (
    <>
      <header className='bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-md/10'>
        <div className='container mx-auto px-4 py-2 '>
          <div className='flex items-center justify-between h-16'>
            {/* Logo */}
            <Link
              href='/'
              className='flex items-center gap-2'
              onClick={handleLogoClick}
            >
              <Image
                src='/yourlogo.svg'
                alt='Logo'
                width={32}
                height={32}
                style={{ width: 32, height: 32 }}
              />
              <span className='font-bold px-2 sm:px-4 text-lg md:text-2xl text-neutral-900'>
                Blog
              </span>
            </Link>

            {/* Desktop Search */}
            <div className='hidden lg:block flex-1 max-w-md mx-8'>
              <SearchBar />
            </div>

            {/* Desktop Actions */}
            <DesktopActions user={user} handleLogout={handleLogout} />

            {/* Mobile Actions */}
            <MobileActions
              setShowMobileSearch={setShowMobileSearch}
              setShowMobileMenu={setShowMobileMenu}
              user={user}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </header>

      <MobileSearch
        showMobileSearch={showMobileSearch}
        setShowMobileSearch={setShowMobileSearch}
      />

      <MobileMenu
        user={user}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        handleLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />
      {showLogoutModal && (
        <ConfirmDialog
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          title='Confirm Logout'
          message='Are you sure you want to log out?'
          actionText='Logout'
          onAction={handleLogoutConfirm}
        />
      )}
    </>
  );
};

export default Header;
