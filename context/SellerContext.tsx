

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Seller } from '../types';
import { sellers, addMessageToConversation } from '../data/dummyData';

interface SellerContextType {
  selectedSeller: Seller | null;
  showSellerModal: (sellerId: number) => void;
  hideSellerModal: () => void;
  unreadChatCount: number;
  markChatsAsRead: () => void;
  simulateNewMessage: () => void;
}

export const SellerContext = createContext<SellerContextType | undefined>(undefined);

export const SellerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(() => {
    const storedCount = localStorage.getItem('kodik-unread-chats');
    return storedCount ? JSON.parse(storedCount) : 0;
  });

  useEffect(() => {
    localStorage.setItem('kodik-unread-chats', JSON.stringify(unreadChatCount));
  }, [unreadChatCount]);

  const showSellerModal = (sellerId: number) => {
    const sellerToShow = sellers.find(s => s.id === sellerId);
    if (sellerToShow) {
      setSelectedSeller(sellerToShow);
    }
  };

  const hideSellerModal = () => {
    setSelectedSeller(null);
  };

  const markChatsAsRead = () => {
    setUnreadChatCount(0);
  };

  const simulateNewMessage = () => {
    const conversationId = 1; // Simulate message in first conversation
    const newMessage = {
      sender: 'pembeli' as const,
      text: 'Halo kak, apakah barangnya sudah siap dikirim?',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    
    addMessageToConversation(conversationId, newMessage);
    setUnreadChatCount(prev => prev + 1);
  };

  return (
    <SellerContext.Provider value={{ selectedSeller, showSellerModal, hideSellerModal, unreadChatCount, markChatsAsRead, simulateNewMessage }}>
      {children}
    </SellerContext.Provider>
  );
};
