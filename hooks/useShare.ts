
import { useContext } from 'react';
import { ShareContext } from '../context/ShareContext';

export const useShare = () => {
  const context = useContext(ShareContext);
  if (context === undefined) {
    throw new Error('useShare must be used within a ShareProvider');
  }
  return context;
};
