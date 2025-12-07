
import { useContext } from 'react';
import { SellerContext } from '../context/SellerContext';

export const useSeller = () => {
  const context = useContext(SellerContext);
  if (context === undefined) {
    throw new Error('useSeller must be used within a SellerProvider');
  }
  return context;
};