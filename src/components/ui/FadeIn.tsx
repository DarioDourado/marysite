import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Reveal on scroll: fades in while rising 30px (0.65s), once per element.
 * Skipped when the visitor prefers reduced motion.
 */
export const FadeIn = ({ children, className, delay = 0 }: FadeInProps) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.65, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};
