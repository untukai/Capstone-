
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { reviews, products } from '../../data/dummyData';
import { Review } from '../../types';
import StarRating from '../../components/StarRating';
import Button from '../../components/Button';
import { UserIcon } from '../../components/Icons';

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const product = products.find(p => p.id === review.productId);
  return (
    <div className="border dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-800">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <img src={product?.imageUrls[0]} alt={product?.name} className="w-12 h-12 rounded-md object-cover bg-neutral-200 dark:bg-neutral-700" />
          <div>
            <p className="font-semibold text-neutral-800 dark:text-neutral-100">{product?.name || 'Produk Dihapus'}</p>
            <StarRating rating={review.rating} />
          </div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{new Date(review.date).toLocaleDateString('id-ID')}</p>
      </div>
      <div className="pl-15 mt-2">
        <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            </div>
            <p className="font-semibold text-sm text-neutral-800 dark:text-neutral-100">{review.userName}</p>
        </div>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm italic bg-neutral-50 dark:bg-neutral-700/50 p-3 rounded-md">"{review.comment}"</p>
         <div className="text-right mt-3">
            <Button variant="outline" className="!text-xs !py-1 !px-3">Balas</Button>
        </div>
      </div>
    </div>
  );
};

const SellerReviewsPage: React.FC = () => {
  const { user } = useAuth();
  // In a real app, this would be a proper lookup
  const sellerId = 1; // Assuming seller with email 'penjual@example.com' is ID 1
  
  const sellerProductIds = products.filter(p => p.sellerId === sellerId).map(p => p.id);
  const sellerReviews = reviews.filter(r => sellerProductIds.includes(r.productId));
  
  const averageRating = sellerReviews.length > 0 ? sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Rating & Ulasan</h1>
        <p className="text-neutral-600 dark:text-neutral-300 mt-1">Lihat dan balas ulasan dari pelanggan Anda.</p>
      </div>
      
      {/* Summary */}
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">Ringkasan Ulasan</h3>
        <div className="flex items-center gap-4 mt-3">
          <p className="text-4xl font-bold text-primary">{averageRating.toFixed(2)}</p>
          <div>
            <StarRating rating={averageRating} />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">dari {sellerReviews.length} ulasan</p>
          </div>
        </div>
      </div>
      
      {/* Review List */}
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4">Semua Ulasan</h3>
          <div className="space-y-4">
            {sellerReviews.length > 0 ? (
                sellerReviews.map(review => <ReviewCard key={review.id} review={review} />)
            ) : (
                <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">Belum ada ulasan untuk produk Anda.</p>
            )}
          </div>
      </div>
    </div>
  );
};

export default SellerReviewsPage;
