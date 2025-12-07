import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { SellerProvider } from './context/SellerContext';
import { WishlistProvider } from './context/WishlistContext';
import { FollowProvider } from './context/FollowContext';
import { ShareProvider } from './context/ShareContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { useToast } from './hooks/useToast';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import CollaborationPage from './pages/CollaborationPage';
import WishlistPage from './pages/WishlistPage';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import SellerLayout from './components/seller/SellerLayout'; // Import SellerLayout
import SellerDashboardPage from './pages/seller/SellerDashboardPage';
import MyProductsPage from './pages/seller/MyProductsPage';
import ProductFormPage from './pages/seller/ProductFormPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage'; // Import SellerOrdersPage
import SellerOrderDetailPage from './pages/seller/SellerOrderDetailPage'; // Import SellerOrderDetailPage
import FeedPage from './pages/FeedPage';
import LivePage from './pages/LivePage';
import LiveDetailPage from './pages/LiveDetailPage';
import SellerLivePage from './pages/seller/SellerLivePage';
import SellerChatPage from './pages/seller/SellerChatPage';
import SellerFinancePage from './pages/seller/SellerFinancePage';
import SellerPromoPage from './pages/seller/SellerPromoPage';
import SellerReviewsPage from './pages/seller/SellerReviewsPage';
import SellerAnalyticsPage from './pages/seller/SellerAnalyticsPage';
import SellerSettingsPage from './pages/seller/SellerSettingsPage';
import SellerCollaborationPage from './pages/seller/SellerCollaborationPage';
import Toast from './components/Toast';

const AppContent: React.FC = () => {
  const { toastMessage, hideToast } = useToast();

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes with main Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="articles/:id" element={<ArticleDetailPage />} />
          <Route path="collaboration" element={<CollaborationPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="feed" element={<FeedPage />} />
          <Route path="live" element={<LivePage />} />
        </Route>

        {/* Seller Protected Routes with its own Layout */}
        <Route path="/seller" element={<ProtectedRoute />}>
          <Route element={<SellerLayout />}>
            <Route index element={<SellerDashboardPage />} />
            <Route path="orders" element={<SellerOrdersPage />} />
            <Route path="orders/:id" element={<SellerOrderDetailPage />} />
            <Route path="products" element={<MyProductsPage />} />
            <Route path="products/new" element={<ProductFormPage />} />
            <Route path="products/edit/:id" element={<ProductFormPage />} />
            <Route path="live" element={<SellerLivePage />} />
            <Route path="chat" element={<SellerChatPage />} />
            <Route path="finance" element={<SellerFinancePage />} />
            <Route path="promo" element={<SellerPromoPage />} />
            <Route path="reviews" element={<SellerReviewsPage />} />
            <Route path="analytics" element={<SellerAnalyticsPage />} />
            <Route path="settings" element={<SellerSettingsPage />} />
            <Route path="collaboration" element={<SellerCollaborationPage />} />
          </Route>
        </Route>

        {/* Standalone pages without the main Layout */}
        <Route path="live/:id" element={<LiveDetailPage />} />
      </Routes>
      {toastMessage && <Toast message={toastMessage} onClose={hideToast} />}
    </>
  );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <SellerProvider>
              <WishlistProvider>
                <FollowProvider>
                  <ShareProvider>
                    <ToastProvider>
                      <HashRouter>
                        <AppContent />
                      </HashRouter>
                    </ToastProvider>
                  </ShareProvider>
                </FollowProvider>
              </WishlistProvider>
            </SellerProvider>
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;