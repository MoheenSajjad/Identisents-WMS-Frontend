// Shake.tsx
import { motion } from 'framer-motion';
import React from 'react';

export const Shake: React.FC<{ shouldShake: boolean; children: React.ReactNode }> = ({
  shouldShake,
  children,
}) => {
  return (
    <motion.div
      initial={{ x: 0 }}
      animate={shouldShake ? { x: [0, -5, 5, -5, 5, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};
