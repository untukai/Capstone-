import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Seller } from '../types';
import { XIcon, StarIcon, PhoneIcon, MailIcon, StoreIcon, CheckCircleIcon } from './Icons';
import Button from './Button';
import { products } from '../data/dummyData';

interface SellerDetailModalProps {
  seller: Seller;
  onClose: () => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const totalStars = 5;
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => (
        <StarIcon
          key={index}
          className={`w-5 h-5 ${index < Math.round(rating) ? 'text-yellow-400' : 'text-neutral-300'}`}
          fill={index < Math.round(rating) ? 'currentColor' : 'none'}
        />
      ))}
      <span className="ml-2 text-sm font-semibold text-neutral-600 dark:text-neutral-300">{rating.toFixed(1)}</span>
    </div>
  );
};

const SellerDetailModal: React.FC<SellerDetailModalProps> = ({ seller, onClose }) => {
  const navigate = useNavigate();
  
  const handleProductClick = (productId: number) => {
    onClose(); // Close modal before navigating
    navigate(`/products/${productId}`);
  };

  const sellerProducts = products.filter(p => p.sellerId === seller.id).slice(0, 3);
  
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="seller-modal-title"
    >
      <div
        className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-transform duration-300 animate-fade-in-up flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 relative border-b dark:border-neutral-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-500 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-white transition-colors"
            aria-label="Tutup"
          >
            <XIcon className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 overflow-hidden">
              {seller.imageUrl ? (
                <img src={seller.imageUrl} alt={seller.name} className="w-full h-full object-cover" />
              ) : (
                <StoreIcon className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              )}
            </div>
            <h2 id="seller-modal-title" className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-neutral-100">{seller.name}</h2>
            <div className="flex items-center gap-4 mt-3">
                <StarRating rating={seller.rating} />
                <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-100 dark:bg-green-500/20 dark:text-green-300 px-2.5 py-1 rounded-full">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Terverifikasi</span>
                </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            <div>
                 <h3 className="font-bold text-neutral-800 dark:text-neutral-100 mb-2">Tentang Penjual</h3>
                 <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">{seller.description}</p>
            </div>
            
            {(seller.phone || seller.email) && (
              <div>
                <h3 className="font-bold text-neutral-800 dark:text-neutral-100 mb-3">Informasi Kontak</h3>
                <div className="space-y-2 text-sm">
                  {seller.phone && (
                    <div className="flex items-center text-neutral-600 dark:text-neutral-300">
                      <PhoneIcon className="w-4 h-4 mr-2.5 flex-shrink-0 text-neutral-400" />
                      <a href={`tel:${seller.phone}`} className="hover:text-primary hover:underline">{seller.phone}</a>
                    </div>
                  )}
                  {seller.email && (
                    <div className="flex items-center text-neutral-600 dark:text-neutral-300">
                      <MailIcon className="w-4 h-4 mr-2.5 flex-shrink-0 text-neutral-400" />
                       <a href={`mailto:${seller.email}`} className="hover:text-primary hover:underline">{seller.email}</a>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {sellerProducts.length > 0 && (
              <div>
                <h3 className="font-bold text-neutral-800 dark:text-neutral-100 mb-3">Produk Unggulan</h3>
                <div className="space-y-3">
                  {sellerProducts.map(product => (
                    <div 
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
                    >
                       <img src={product.imageUrls[0]} alt={product.name} className="w-12 h-12 bg-neutral-200 dark:bg-neutral-600 rounded-md flex-shrink-0 object-cover" />
                       <div className="flex-1">
                          <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200 leading-tight">{product.name}</p>
                          <p className="text-sm font-bold text-primary">{formatRupiah(product.price)}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SellerDetailModal;