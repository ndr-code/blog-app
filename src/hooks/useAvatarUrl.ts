import { useState, useEffect } from 'react';
import { User } from '@/interfaces/post.interface';

const avatarCache = new Map<number, string | undefined>();

export function useAvatarUrl(author: User | undefined): string | undefined {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    author && typeof author.avatarUrl === 'string'
      ? author.avatarUrl
      : undefined
  );

  useEffect(() => {
    if (!author || !author.id) return;
    if (!author.avatarUrl) {
      if (avatarCache.has(author.id)) {
        const cached = avatarCache.get(author.id);
        setAvatarUrl(
          cached !== null && typeof cached === 'string' ? cached : undefined
        );
      } else {
        fetch(`/api/users/${author.id}`)
          .then((res) => res.json())
          .then((user) => {
            const url =
              user.avatarUrl !== null && typeof user.avatarUrl === 'string'
                ? user.avatarUrl
                : undefined;
            setAvatarUrl(url);
            avatarCache.set(author.id, url);
          });
      }
    } else {
      setAvatarUrl(author.avatarUrl);
      avatarCache.set(author.id, author.avatarUrl);
    }
  }, [author]);

  return avatarUrl;
}
