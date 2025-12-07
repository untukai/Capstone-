
import { useContext } from 'react';
import { FollowContext } from '../context/FollowContext';

export const useFollow = () => {
  const context = useContext(FollowContext);
  if (context === undefined) {
    throw new Error('useFollow must be used within a FollowProvider');
  }
  return context;
};
