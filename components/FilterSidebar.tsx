
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Category } from '../types';
import { StarIcon, XCircleIcon, XIcon } from './Icons';
import Button from './Button';
import Input from './Input';

interface FilterSidebarProps {
  categories: Category[];
  onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ categories, onClose }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || '',
  });

  const currentCategory = searchParams.get('category');
  const showInStock = searchParams.get('showInStock') === 'true';
  const minRating = searchParams.get('minRating');
  const productType = searchParams.get('type');

  // Sync local price state with URL params
  useEffect(() => {
    setPriceRange({
      min: searchParams.get('minPrice') || '',
      max: searchParams.get('maxPrice') || '',
    });
  }, [searchParams]);

  const updateSearchParams = (updates: Record<string, string | null | boolean>) => {
    setSearchParams(prev => {
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || value === false) {
          prev.delete(key);
        } else {
          prev.set(key, String(value));
        }
      });
      return prev;
    }, { replace: true });
  };

  const handlePriceApply = () => {
    updateSearchParams({ minPrice: priceRange.min, maxPrice: priceRange.max });
  };

  const handleResetFilters = () => {
    updateSearchParams({
      showInStock: null,
      minRating: null,
      minPrice: null,
      maxPrice: null,
      type: null,
    });
    setPriceRange({ min: '', max: '' });
  };
  
  const getCategoryLink = (categoryId: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (categoryId) {
        newParams.set('category', categoryId);
    } else {
        newParams.delete('category');
    }
    return `/products?${newParams.toString()}`;
  }

  const ratingOptions = [4, 3];
  const productTypes = ['Produk Fisik', 'Produk Digital', 'Jasa'];


  return (
    <div className="h-full flex flex-col">
      <div className="pb-4 mb-4 border-b dark:border-neutral-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">Filter & Kategori</h2>
        <button onClick={onClose} className="p-1 text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-neutral-800 dark:text-neutral-200">Kategori</h3>
          <nav className="space-y-1">
            <Link
              to={getCategoryLink(null)}
              className={`block w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                !currentCategory ? 'bg-primary/10 text-primary font-semibold' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              Semua Kategori
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={getCategoryLink(category.id)}
                className={`block w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                  currentCategory === category.id ? 'bg-primary/10 text-primary font-semibold' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">Filter Lainnya</h3>
                <button onClick={handleResetFilters} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  <XCircleIcon className="w-4 h-4" /> Reset
                </button>
              </div>
            </div>

             <div>
              <h4 className="text-sm font-medium mb-2 text-neutral-600 dark:text-neutral-300">Tipe Produk</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateSearchParams({ type: null })}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${!productType ? 'bg-primary text-white border-primary' : 'bg-transparent border-neutral-300 text-neutral-600 dark:border-neutral-600 dark:text-neutral-300 hover:border-primary hover:text-primary'}`}
                >
                  Semua
                </button>
                {productTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => updateSearchParams({ type: type })}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${productType === type ? 'bg-primary text-white border-primary' : 'bg-transparent border-neutral-300 text-neutral-600 dark:border-neutral-600 dark:text-neutral-300 hover:border-primary hover:text-primary'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2 text-neutral-600 dark:text-neutral-300">Ketersediaan</h4>
              <label className="flex items-center gap-2 cursor-pointer p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                <input
                  type="checkbox"
                  checked={showInStock}
                  onChange={(e) => updateSearchParams({ showInStock: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:bg-neutral-700 dark:border-neutral-600"
                />
                <span className="text-sm dark:text-neutral-200 font-medium">Hanya stok tersedia</span>
              </label>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2 text-neutral-600 dark:text-neutral-300">Rating Penjual</h4>
              <div className="space-y-1">
                {ratingOptions.map(rating => (
                    <button
                        key={rating}
                        onClick={() => updateSearchParams({ minRating: String(rating) })}
                        className={`flex items-center gap-2 text-sm p-2 rounded-md w-full text-left transition-colors ${minRating === String(rating) ? 'bg-primary/10 font-semibold text-primary' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200'}`}
                    >
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-neutral-300'}`} fill={i < rating ? 'currentColor' : 'none'} />
                            ))}
                        </div>
                        <span>& Up</span>
                    </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2 text-neutral-600 dark:text-neutral-300">Rentang Harga</h4>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(p => ({ ...p, min: e.target.value }))}
                  className="!text-xs"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(p => ({ ...p, max: e.target.value }))}
                  className="!text-xs"
                />
              </div>
              <Button onClick={handlePriceApply} variant="outline" className="w-full !text-xs !py-1.5">
                Terapkan Harga
              </Button>
            </div>
        </div>
      </div>
      
      <div className="pt-4 mt-4 border-t dark:border-neutral-700">
        <Button onClick={onClose} className="w-full !py-3 !font-bold">Lihat Hasil</Button>
      </div>
    </div>
  );
};

export default FilterSidebar;
