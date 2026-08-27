import { createContext, useContext } from 'react';

export const TransitionContext = createContext({
  navigateWithGrid: () => {},
  isTransitioning: false
});

export const useGridTransition = () => useContext(TransitionContext);
