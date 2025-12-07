
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useTheme } from '../hooks/useTheme';
import { SearchIcon, ShoppingCartIcon, UserIcon, MenuIcon, XIcon, HeartIcon, SunIcon, MoonIcon, ArrowLeftIcon } from './Icons';
import { kodikLogo } from '../assets/logo';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { cartCount, isCartAnimating } = useCart();
  const { wishlistCount, isWishlistAnimating } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;

    // Preserve existing search params like 'category' or 'seller'
    const currentParams = new URLSearchParams(location.search);
    if (query) {
      currentParams.set('q', query);
    } else {
      currentParams.delete('q');
    }
    
    navigate(`/products?${currentParams.toString()}`);
    setIsMenuOpen(false); // Close menu after search
  };

  const navLinks = [
    { name: 'Kategori', path: '/products' },
    { name: 'Feed', path: '/feed' },
    { name: 'Live', path: '/live' },
    { name: 'Artikel Lokal', path: '/articles' },
    { name: 'Kolaborasi', path: '/collaboration' },
  ];

  const MobileMenu = () => (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[calc(100%-3rem)] max-w-xs bg-white dark:bg-neutral-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        {/* Header inside Panel */}
        <div className="flex items-center justify-between p-4 border-b dark:border-neutral-700">
           <Link to="/" className="flex items-center">
            <img src={kodikLogo} alt="KODIK Logo" className="h-10 w-10 rounded-full object-contain border-2 border-neutral-100 dark:border-neutral-700 p-1" />
          </Link>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors" aria-label="Tutup menu">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Body of Panel */}
        <div className="p-4 flex flex-col h-[calc(100%-65px)] overflow-y-auto">
          <form onSubmit={handleSearch} className="w-full mb-2">
            <div className="relative">
              <input type="search" name="search" className="w-full border border-neutral-300 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:border-neutral-600 dark:text-white" placeholder="Cari produk..." />
              <button type="submit" className="absolute right-0 top-0 mt-1.5 mr-3" aria-label="Cari">
                <SearchIcon className="h-5 w-5 text-neutral-400" />
              </button>
            </div>
          </form>
          
          <nav className="flex flex-col space-y-2 mt-4">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="block px-3 py-3 rounded-md text-base font-medium text-neutral-700 dark:text-neutral-200 hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                {link.name}
              </Link>
            ))}
             {user?.role === 'penjual' && (
              <Link to="/seller" className="block px-3 py-3 rounded-md text-base font-medium text-primary hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                Dashboard Penjual
              </Link>
            )}
          </nav>
          
          {/* User Actions at the bottom */}
          <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-700">
             <nav className="flex flex-col space-y-2">
                <Link to={isAuthenticated ? "/profile" : "/login"} className="flex items-center px-3 py-3 rounded-md text-base font-medium text-neutral-700 dark:text-neutral-200 hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                    <UserIcon className="h-6 w-6 mr-3 text-neutral-500" />
                    <span>{isAuthenticated ? 'Profil Saya' : 'Masuk / Daftar'}</span>
                </Link>
                 <button onClick={toggleTheme} className="flex items-center px-3 py-3 rounded-md text-base font-medium text-neutral-700 dark:text-neutral-200 hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                    {theme === 'light' ? <MoonIcon className="h-6 w-6 mr-3 text-neutral-500" /> : <SunIcon className="h-6 w-6 mr-3 text-neutral-500" />}
                    <span>Ganti ke Mode {theme === 'light' ? 'Gelap' : 'Terang'}</span>
                </button>
             </nav>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-30 dark:bg-neutral-800 dark:border-b dark:border-neutral-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back Button + Logo + Desktop Nav */}
            <div className="flex items-center gap-x-4">
              {/* Back Button for non-home pages */}
              {!isHome && (
                <button 
                  onClick={() => navigate(-1)} 
                  className="p-2 -ml-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors lg:hidden"
                  aria-label="Kembali"
                >
                  <ArrowLeftIcon className="h-6 w-6" />
                </button>
              )}

              <Link to="/" className="flex-shrink-0 flex items-center">
                <img src={kodikLogo} alt="KODIK Logo" className="h-12 w-12 rounded-full object-contain border-2 border-neutral-100 dark:border-neutral-700 p-1" />
              </Link>
              <nav className="hidden lg:flex items-center space-x-6 ml-4">
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path} className="text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                ))}
                {user?.role === 'penjual' && (
                  <Link to="/seller" className="text-primary hover:underline transition-colors text-sm font-bold">
                    Dashboard Penjual
                  </Link>
                )}
              </nav>
            </div>

            {/* Right: User Actions */}
            <div className="flex items-center gap-x-2 sm:gap-x-4">
              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="hidden lg:block">
                <div className="relative">
                  <input
                    type="search"
                    name="search"
                    className="border border-neutral-300 bg-neutral-100 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-primary-dark text-sm transition-all duration-300 w-48 focus:w-64 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:placeholder-neutral-400"
                    placeholder="Cari produk..."
                  />
                  <button type="submit" className="absolute right-0 top-0 mt-1.5 mr-3" aria-label="Cari">
                    <SearchIcon className="h-5 w-5 text-neutral-400" />
                  </button>
                </div>
              </form>
              
              {/* Desktop Icons */}
              <div className="hidden lg:flex items-center gap-x-2">
                 <button onClick={toggleTheme} title="Ganti Tema" className="text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors p-2">
                    {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                 </button>
                <Link to="/wishlist" title="Wishlist" className={`relative text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors p-2 ${isWishlistAnimating ? 'animate-heart-pop' : ''}`}>
                  <HeartIcon className="h-6 w-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{wishlistCount}</span>
                  )}
                </Link>
                <Link to={isAuthenticated ? "/profile" : "/login"} title="Profil Pengguna" className="text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors p-2">
                  <UserIcon className="h-6 w-6" />
                </Link>
              </div>

              {/* Mobile Wishlist Icon */}
              <Link to="/wishlist" title="Wishlist" className={`lg:hidden relative text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors p-2 ${isWishlistAnimating ? 'animate-heart-pop' : ''}`}>
                <HeartIcon className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{wishlistCount}</span>
                )}
              </Link>

              {/* Cart (Always Visible) */}
              <Link to="/cart" title="Keranjang Belanja" className={`relative text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors p-2 ${isCartAnimating ? 'animate-cart-pop' : ''}`}>
                <ShoppingCartIcon className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{cartCount}</span>
                )}
              </Link>

              {/* Hamburger Button (Mobile Only) */}
              <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:text-primary" aria-label="Buka menu">
                <MenuIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu />
    </>
  );
};

export default Header;
