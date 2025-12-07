
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface FollowContextType {
  followedSellerIds: number[];
  followSeller: (sellerId: number) => void;
  unfollowSeller: (sellerId: number) => void;
  isFollowing: (sellerId: number) => boolean;
}

export const FollowContext = createContext<FollowContextType | undefined>(undefined);

export const FollowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [followedSellerIds, setFollowedSellerIds] = useState<number[]>([]);

  useEffect(() => {
    const storedFollows = localStorage.getItem('kodik-followed-sellers');
    if (storedFollows) {
      setFollowedSellerIds(JSON.parse(storedFollows));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kodik-followed-sellers', JSON.stringify(followedSellerIds));
  }, [followedSellerIds]);

  const followSeller = (sellerId: number) => {
    setFollowedSellerIds(prev => {
      if (!prev.includes(sellerId)) {
        return [...prev, sellerId];
      }
      return prev;
    });
  };

  const unfollowSeller = (sellerId: number) => {
    setFollowedSellerIds(prev => prev.filter(id => id !== sellerId));
  };

  const isFollowing = (sellerId: number) => {
    return followedSellerIds.includes(sellerId);
  };

  return (
    <FollowContext.Provider value={{ followedSellerIds, followSeller, unfollowSeller, isFollowing }}>
      {children}
    </FollowContext.Provider>
  );
};
