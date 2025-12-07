import React from 'react';
import { Outlet } from 'react-router-dom';
import SellerSidebar from './SellerSidebar';
import Header from '../Header'; // Using the main header for consistency
import Footer from '../Footer';
import NotificationPopup from '../NotificationPopup';
import SellerDetailModal from '../SellerDetailModal';
import BackToTopButton from '../BackToTopButton';
import { useNotification } from '../../hooks/useNotification';
import { useSeller } from '../../hooks/useSeller';
import { useShare } from '../../hooks/useShare';
import ShareModal from '../ShareModal';

const SellerLayout: React.FC = () => {
  const { notification, hideNotification } = useNotification();
  const { selectedSeller, hideSellerModal } = useSeller();
  const { shareData } = useShare();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Header />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <SellerSidebar />
          <main className="flex-1 w-full min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
      {notification && <NotificationPopup notification={notification} onClose={hideNotification} />}
      {selectedSeller && <SellerDetailModal seller={selectedSeller} onClose={hideSellerModal} />}
      {shareData && <ShareModal />}
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default SellerLayout;