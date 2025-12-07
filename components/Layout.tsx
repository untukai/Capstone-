import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import NotificationPopup from './NotificationPopup';
import SellerDetailModal from './SellerDetailModal'; // Import the new modal
import BackToTopButton from './BackToTopButton'; // Import the BackToTopButton
import { useNotification } from '../hooks/useNotification';
import { useSeller } from '../hooks/useSeller'; // Import the new hook
import { useShare } from '../hooks/useShare';
import ShareModal from './ShareModal';

const Layout: React.FC = () => {
  const { notification, hideNotification } = useNotification();
  const { selectedSeller, hideSellerModal } = useSeller();
  const { shareData } = useShare();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* FIX: Replaced {children} with <Outlet /> for React Router v6 compatibility. */}
        <Outlet />
      </main>
      {notification && <NotificationPopup notification={notification} onClose={hideNotification} />}
      {selectedSeller && <SellerDetailModal seller={selectedSeller} onClose={hideSellerModal} />}
      {shareData && <ShareModal />}
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default Layout;