
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import SkeletonProductCard from '../components/SkeletonProductCard'; // Import skeleton
import Button from '../components/Button'; // Import Button
import { TagIcon } from '../components/Icons'; // Import icon for filter button
import { products, categories, sellers } from '../data/dummyData';
import { Product } from '../types';
import { getAIRecommendations } from '../services/geminiService';

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [aiRecommendedProductNames, setAiRecommendedProductNames] = useState<string[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for Filter Modal
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const query = searchParams.get('q');
  const categoryId = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const minRating = searchParams.get('minRating');
  const showInStock = searchParams.get('showInStock') === 'true';
  const productType = searchParams.get('type');

  const selectedCategory = categories.find(c => c.id === categoryId);

  useEffect(() => {
    // 1. Start with all products and apply all filters sequentially.
    let baseProducts = [...products];

    // Product Type filter
    if (productType) {
      baseProducts = baseProducts.filter(p => p.type === productType);
    }

    // Category filter
    if (categoryId) {
      const categoryName = categories.find(c => c.id === categoryId)?.name;
      if (categoryName) {
        baseProducts = baseProducts.filter(p => p.category === categoryName);
      }
    }

    // Stock filter
    if (showInStock) {
      baseProducts = baseProducts.filter(p => p.stock > 0);
    }

    // Rating filter
    if (minRating) {
      const ratingNum = parseFloat(minRating);
      baseProducts = baseProducts.filter(p => {
        const seller = sellers.find(s => s.id === p.sellerId);
        return seller && seller.rating >= ratingNum;
      });
    }

    // Price range filter
    if (minPrice) {
      baseProducts = baseProducts.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      baseProducts = baseProducts.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    // Final filtering for display, adding the text search query
    let finalProductsForDisplay = [...baseProducts];
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      finalProductsForDisplay = finalProductsForDisplay.filter(p =>
        p.name.toLowerCase().includes(lowercasedQuery) ||
        p.description.toLowerCase().includes(lowercasedQuery)
      );
    }
    setFilteredProducts(finalProductsForDisplay);
    
    // 3. Trigger AI recommendations based on search query OR selected category
    const recommendationQuery = query || selectedCategory?.name;
    if (recommendationQuery) {
      setIsLoadingRecommendations(true);
      setError(null);
      setAiRecommendedProductNames([]);
      
      // Pass the broader category-filtered list to the AI for better context
      let contextProducts = products;
      if(categoryId) {
          const categoryName = categories.find(c => c.id === categoryId)?.name;
          if(categoryName) contextProducts = contextProducts.filter(p => p.category === categoryName);
      }

      getAIRecommendations(recommendationQuery, contextProducts)
        .then(recommendations => {
          setAiRecommendedProductNames(recommendations);
        })
        .catch(err => {
          console.error("Failed to get AI recommendations:", err);
          setError("Gagal mendapatkan rekomendasi AI. Silakan coba lagi.");
        })
        .finally(() => {
          setIsLoadingRecommendations(false);
        });
    } else {
        setAiRecommendedProductNames([]);
        setIsLoadingRecommendations(false);
        setError(null);
    }

  }, [query, categoryId, selectedCategory, minPrice, maxPrice, minRating, showInStock, productType]);

  // Derive display lists from state
  const aiRecommendedProducts = filteredProducts.filter(p => aiRecommendedProductNames.includes(p.name));
  const aiRecommendedIds = new Set(aiRecommendedProducts.map(p => p.id));
  const otherProducts = filteredProducts.filter(p => !aiRecommendedIds.has(p.id));
  
  const noProductsFound = filteredProducts.length === 0 && !isLoadingRecommendations;

  const pageTitle = () => {
    if (query) return `Hasil pencarian: "${query}"`;
    if (selectedCategory) return `Kategori: ${selectedCategory.name}`;
    return 'Semua Produk';
  };

  // Count active filters to show a badge on the button
  const activeFiltersCount = [categoryId, minPrice, maxPrice, minRating, showInStock, productType].filter(Boolean).length;

  return (
    <div className="relative">
      <div className="flex flex-col w-full">
        {/* Header Section */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 dark:text-neutral-100">{pageTitle()}</h1>
            <p className="text-neutral-600 dark:text-neutral-300 mt-1">{filteredProducts.length} produk ditemukan</p>
          </div>
          <Button onClick={() => setIsFilterOpen(true)} variant="outline" className="flex items-center gap-2 whitespace-nowrap">
            <TagIcon className="w-5 h-5" />
            <span>Filter & Kategori</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
        
        {isLoadingRecommendations && (
           <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                <span className="animate-spin text-2xl">✨</span> AI sedang mencari rekomendasi...
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {[...Array(5)].map((_, index) => (
                    <SkeletonProductCard key={index} />
                ))}
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        {!isLoadingRecommendations && aiRecommendedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 text-neutral-800 dark:text-neutral-100">Rekomendasi AI Untuk Anda</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {aiRecommendedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
        
        {otherProducts.length > 0 && (
            <div className="mb-12">
                <h2 className="text-xl font-bold mb-4 text-neutral-800 dark:text-neutral-100">
                    {aiRecommendedProducts.length > 0 ? "Hasil Lainnya" : "Daftar Produk"}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {otherProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        )}

        {noProductsFound && (
           <div className="text-center py-20 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
              <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium">Tidak ada produk yang cocok.</p>
              <p className="text-neutral-400 mt-2">Coba kurangi filter atau gunakan kata kunci lain.</p>
              <Button onClick={() => setIsFilterOpen(true)} variant="outline" className="mt-4">
                Ubah Filter
              </Button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-overlay" onClick={() => setIsFilterOpen(false)}>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-md h-[85vh] overflow-hidden animate-popup-in" onClick={e => e.stopPropagation()}>
            <div className="h-full p-6">
                <FilterSidebar categories={categories} onClose={() => setIsFilterOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
