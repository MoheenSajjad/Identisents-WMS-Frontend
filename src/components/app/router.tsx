import { AnimatePresence } from 'framer-motion';
import { Main } from './main';

export const Router = () => {
  return (
    <AnimatePresence mode="wait">
      <Main />
    </AnimatePresence>
  );
};
