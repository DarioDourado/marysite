import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { useIsDesktop } from '@/src/lib/useIsDesktop.ts';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Subtle opacity-only reveal on scroll (max 0.4s). Disabled on mobile.
 */
export const FadeIn = ({ children, className, delay = 0 }: FadeInProps) => {
  const isDesktop = useIsDesktop();

  if (!isDesktop) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};
