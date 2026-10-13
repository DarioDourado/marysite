import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls to the #hash target after navigation, or to the top for a new page.
 */
export const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a frame so the target page has rendered.
      const id = decodeURIComponent(hash.slice(1));
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      });
      return;
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
};
