

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import Button from './Button';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import { useSeller } from '../hooks/useSeller';
import { useWishlist } from '../hooks/useWishlist';
import { useShare } from '../hooks/useShare';
import { sellers, reviews } from '../data/dummyData';
import { StoreIcon, HeartIcon, ShareIcon, StarIcon } from './Icons';
import StarRating from './StarRating'; // Import StarRating

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const { showSellerModal } = useSeller();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { showShareModal } = useShare();
  const navigate = useNavigate();
  
  const seller = sellers.find(s => s.id === product.sellerId);
  const isWishlisted = isInWishlist(product.id);
  const imageUrl = product.imageUrls?.[0]; // Safely access the first image URL

  // Calculate average rating
  const productReviews = reviews.filter(r => r.productId === product.id);
  const avgRating = productReviews.length > 0
    ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
    : 0;

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product.id);
    showNotification(
      'Berhasil Ditambahkan',
      `'${product.name}' ditambahkan ke keranjang.`,
      'success',
      { label: 'Lihat Keranjang', path: '/cart' }
    );
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product.id);
    showNotification('Berhasil', `'${product.name}' ditambahkan, Anda akan diarahkan ke checkout.`);
    setTimeout(() => {
      navigate('/checkout');
    }, 1500);
  };

  const handleSellerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showSellerModal(product.sellerId);
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product as any); // Casting since dummy product might not match new type perfectly
      showNotification(
        'Ditambahkan ke Wishlist',
        `'${product.name}' berhasil disimpan.`,
        'success',
        { label: 'Lihat Wishlist', path: '/wishlist' }
      );
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productUrl = `${window.location.origin}${window.location.pathname}#/products/${product.id}`;
    const shareData = {
      title: `KODIK: ${product.name}`,
      text: `Cek produk keren ini dari ${seller?.name} di KODIK!`,
      url: productUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof DOMException && error.name !== 'AbortError') {
          console.error('Error sharing natively:', error);
          showShareModal(shareData);
        }
      }
    } else {
      showShareModal(shareData);
    }
  };

  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;

  return (
    <div className="bg-white rounded-lg overflow-hidden transition-shadow duration-300 border border-neutral-200 hover:shadow-xl flex flex-col relative h-full dark:bg-neutral-800 dark:border-neutral-700">
      {product.discount && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
          -{product.discount}%
        </div>
      )}
      <button 
        onClick={handleWishlistToggle} 
        className="absolute top-2 right-2 z-10 p-1.5 bg-white/70 dark:bg-neutral-800/70 rounded-full text-neutral-600 dark:text-neutral-300 hover:text-red-500 backdrop-blur-sm transition-colors" 
        aria-label="Tambah ke wishlist"
      >
        <HeartIcon className={`w-6 h-6 ${isWishlisted ? 'text-red-500' : ''}`} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      <Link to={`/products/${product.id}`} className="block flex-grow">
        <div className="w-full aspect-square bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <StoreIcon className="w-12 h-12 text-neutral-400 dark:text-neutral-500" />
          )}
        </div>
        <div className="p-3">
          <h3 className="text-sm font-normal text-neutral-700 dark:text-neutral-200 h-10 overflow-hidden">{product.name}</h3>
          <div className="mt-2 h-12 flex items-center">
            {product.discount ? (
              <div className="flex items-baseline gap-2 flex-wrap">
                <p className="text-base sm:text-lg font-bold text-red-600">
                  {formatRupiah(discountedPrice)}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 line-through">
                  {formatRupiah(product.price)}
                </p>
              </div>
            ) : (
              <p className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-50">{formatRupiah(product.price)}</p>
            )}
          </div>
          <div className="mt-2 space-y-1">
            <button onClick={handleSellerClick} className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 hover:text-primary transition-colors w-full text-left group">
                <div className="flex items-center truncate">
                    <StoreIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    <span className="truncate group-hover:underline font-medium">{seller?.name || 'Penjual tidak ditemukan'}</span>
                </div>
                {seller && (
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        <StarIcon className="w-4 h-4 text-yellow-400" fill="currentColor" />
                        <span className="font-semibold text-neutral-600 dark:text-neutral-300">{seller.rating.toFixed(1)}</span>
                    </div>
                )}
            </button>
            {productReviews.length > 0 && (
                <div className="flex items-center gap-1">
                    <StarRating rating={avgRating} />
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">({productReviews.length})</span>
                </div>
            )}
          </div>
        </div>
      </Link>
      <div className="p-3 pt-0 mt-auto">
        <div className="space-y-2">
          <Button onClick={handleBuyNow} className="w-full !font-bold !text-sm" disabled={product.stock === 0}>
            {product.stock > 0 ? 'Beli Sekarang' : 'Stok Habis'}
          </Button>
          <div className="flex items-center gap-2">
            <Button onClick={handleAddToCart} variant="outline" className="flex-grow !font-bold !text-sm" disabled={product.stock === 0}>
              Tambah Keranjang
            </Button>
            <button
              onClick={handleShare}
              className="p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary transition-colors flex-shrink-0"
              aria-label="Bagikan produk"
              title="Bagikan Produk"
            >
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
