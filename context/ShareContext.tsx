
import React, { createContext, useState, ReactNode } from 'react';

interface ShareData {
  url: string;
  title: string;
  text: string;
}

interface ShareContextType {
  shareData: ShareData | null;
  showShareModal: (data: ShareData) => void;
  hideShareModal: () => void;
}

export const ShareContext = createContext<ShareContextType | undefined>(undefined);

export const ShareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shareData, setShareData] = useState<ShareData | null>(null);

  const showShareModal = (data: ShareData) => {
    setShareData(data);
  };

  const hideShareModal = () => {
    setShareData(null);
  };

  return (
    <ShareContext.Provider value={{ shareData, showShareModal, hideShareModal }}>
      {children}
    </ShareContext.Provider>
  );
};
