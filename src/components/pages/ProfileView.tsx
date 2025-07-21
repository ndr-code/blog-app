'use client';

import { useEffect, useState } from 'react';
import { User, Post } from '@/interfaces/post.interface';
import TabsProfile from '../ui/TabsProfile';
import { useAuth } from '@/hooks/useAuth';
import { PostCard } from '../ui/PostCard';
import { motion } from 'framer-motion';
import { Button } from '../ui/Buttons';
import { EditProfileForm } from '../ui/EditProfileForm';
import { useRouter } from 'next/navigation';
import { AvatarDialog } from '../ui/Avatar';

interface ProfileViewProps {
  userId: string;
}

const ProfileView = ({ userId }: ProfileViewProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: loggedInUser, isLoggedIn } = useAuth();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);

  const handleProfileUpdated = (newUser: User) => {
    setUser(newUser);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userRes = await fetch(`/api/users/${userId}`);
        if (!userRes.ok) throw new Error('User not found');
        const userData = await userRes.json();
        setUser(userData);

        const postsRes = await fetch(`/api/posts/by-user/${userId}`);
        if (!postsRes.ok) throw new Error('Failed to fetch user posts');
        const postsData = await postsRes.json();
        setPosts(postsData.data || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[40vh] w-full'>
        <h2 className='text-2xl font-bold mb-4'>Profile</h2>
        <p className='text-gray-500'>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[40vh] w-full'>
        <h2 className='text-2xl font-bold mb-4'>Profile</h2>
        <p className='text-gray-500'>{error || 'User not found.'}</p>
      </div>
    );
  }

  const isOwner = isLoggedIn && loggedInUser?.id === user?.id;

  if (!isOwner) {
    // VisitorMode
    return (
      <div
        className='container mx-auto px-4 py-8'
        role='main'
        aria-label='Profile main content'
      >
        {/* Profile Info */}
        <div className='mx-auto max-w-5xl px-8 rounded border-b border-neutral-300'>
          <div className='flex items-center gap-4'>
            <AvatarDialog
              user={user}
              aria-label={`User avatar: ${user.name}`}
            />
            <div>
              <h1
                className='text-2xl font-bold pb-1'
                tabIndex={0}
                aria-label={`Profile name: ${user?.name}`}
              >
                {user?.name}
              </h1>
              {user?.headline && (
                <p
                  className='text-gray-600'
                  aria-label={`Profile headline: ${user.headline}`}
                >
                  {user.headline}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* CardContainer untuk PostCard dari author */}
        <div className='mx-auto max-w-5xl mt-8'>
          <h2
            className='text-xl font-bold mb-4'
            tabIndex={0}
            aria-label={`Posts by user: ${user?.name}`}
          >
            {posts.length} {posts.length <= 1 ? 'Post' : 'Posts'}
          </h2>
          {posts.length > 0 ? (
            <ul className='space-y-6' aria-label='User posts list'>
              {posts.map((post, idx) => (
                <motion.li
                  key={post.id || idx}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                >
                  <PostCard
                    post={post}
                    isEditMode={isOwner}
                    aria-label={`User post: ${post.title}`}
                  />
                  {idx !== posts.length - 1 && (
                    <div
                      className='mt-4 mb-4 border-b border-gray-300 w-full'
                      role='separator'
                      aria-label='Post divider'
                    />
                  )}
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className='flex flex-col items-center justify-center py-24 rounded-2xl mx-2'>
              <h2
                className='text-lg font-semibold mb-3 text-gray-800 tracking-tight'
                tabIndex={0}
                aria-label='No posts from this user yet'
              >
                No posts from this user yet
              </h2>
              <p
                className='mb-6 text-gray-500'
                aria-label='Stay tuned for future posts'
              >
                Stay tuned for future posts
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  // OwnerMode
  return (
    <div
      className='container mx-auto px-4 py-8'
      role='main'
      aria-label='Profile main content'
    >
      {/* Profile Info + Edit Profile */}
      <div className='mx-auto bg-white max-w-5xl px-8 rounded-xl border border-neutral-300'>
        <div className='flex items-center gap-4'>
          <AvatarDialog user={user} aria-label={`User avatar: ${user.name}`} />
          <div>
            <h1
              className='text-2xl font-bold pb-1'
              tabIndex={0}
              aria-label={`Profile name: ${user?.name}`}
            >
              {user?.name}
            </h1>
            {user?.headline && (
              <p
                className='text-gray-600'
                aria-label={`Profile headline: ${user.headline}`}
              >
                {user.headline}
              </p>
            )}
          </div>
          <div className='ml-auto'>
            <Button
              variant='ghost'
              className='font-semibold px-4 py-2 rounded transition-colors duration-150 '
              onClick={() => setEditOpen(true)}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* TabsProfile: Post List, Empty State, Change Password */}
      <div className='mx-auto max-w-5xl mt-8'>
        <TabsProfile
          posts={posts}
          isOwner={isOwner}
          onWritePost={() => {
            router.push('/post/write');
          }}
          aria-label='Profile tabs'
        />
      </div>
      <EditProfileForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  );
};

export default ProfileView;
