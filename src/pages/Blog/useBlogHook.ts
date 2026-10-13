import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BlogTransporter, type BlogPost } from './BlogTransporter.ts';

export const useBlogHook = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    BlogTransporter.getPosts()
      .then(setPosts)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, []);

  return { t, posts, loading, error };
};
