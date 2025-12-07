
import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

const WishlistPage: React.FC = () => {
  const { wishlistItems } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Wishlist Anda Kosong</h1>
        <p className="text-neutral-600 dark:text-neutral-300 mt-4">Simpan produk yang Anda suka agar tidak lupa!</p>
        <Link to="/products">
          <Button className="mt-6 !font-bold">Cari Produk</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Wishlist Saya</h1>
        <p className="text-neutral-600 dark:text-neutral-300 mt-2">{wishlistItems.length} produk disimpan</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {wishlistItems.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
