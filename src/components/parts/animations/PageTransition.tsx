import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

type AnimationType = 'slide' | 'fade' | 'scale' | 'slideUp' | 'slideDown';

interface PageTransitionProps {
  children: ReactNode;
  animation?: AnimationType;
  duration?: number;
  className?: string;
}

const animationVariants: Record<AnimationType, Variants> = {
  slide: {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 },
  },
  fade: {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.98 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.02 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: 20 },
  },
};

export const PageTransition = ({
  children,
  animation = 'slideUp',
  duration = 0.6,
  className,
}: PageTransitionProps) => {
  const pageTransition = {
    type: 'tween' as const,
    ease: 'anticipate' as const,
    duration,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={animationVariants[animation]}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
};
