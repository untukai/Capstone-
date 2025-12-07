

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products, sellers, reviews as initialReviews } from '../data/dummyData';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import { useSeller } from '../hooks/useSeller';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import { useShare } from '../hooks/useShare';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import { generateProductDescription } from '../services/geminiService';
import { XIcon, HeartIcon, UserIcon, ShareIcon } from '../components/Icons';
import { Review } from '../types';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const { showSellerModal } = useSeller();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const { showShareModal } = useShare();
  const navigate = useNavigate();
  
  const product = products.find(p => p.id === parseInt(id || ''));
  const seller = product ? sellers.find(s => s.id === product.sellerId) : undefined;

  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [isLoadingDescription, setIsLoadingDescription] = useState<boolean>(true);
  
  // --- State untuk Ulasan ---
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  useEffect(() => {
    if (product) {
      setIsLoadingDescription(true);
      setAiDescription(null);
      setSelectedImageIndex(0);
      
      // Load reviews for the product
      setProductReviews(initialReviews.filter(r => r.productId === product.id));

      generateProductDescription(product as any) // Cast for now
        .then(description => {
          setAiDescription(description);
        })
        .catch(error => {
          console.error("Failed to load AI description, falling back to default.", error);
        })
        .finally(() => {
          setIsLoadingDescription(false);
        });
    }
  }, [product]);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id);
      showNotification(
        'Berhasil',
        `'${product.name}' ditambahkan ke keranjang.`,
        'success',
        { label: 'Lihat Keranjang', path: '/cart' }
      );
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product.id);
      showNotification('Berhasil', `'${product.name}' ditambahkan, Anda akan diarahkan ke checkout.`);
      setTimeout(() => {
        navigate('/checkout');
      }, 1500);
    }
  };
  
  const handleSellerClick = () => {
    if (seller) {
      showSellerModal(seller.id);
    }
  };
  
  const handleWishlistToggle = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product as any);
      showNotification(
        'Ditambahkan ke Wishlist',
        `'${product.name}' berhasil disimpan.`,
        'success',
        { label: 'Lihat Wishlist', path: '/wishlist' }
      );
    }
  };

  const handleShare = async () => {
    if (!product || !seller) return;
    const productUrl = window.location.href;
    const shareData = {
      title: `KODIK: ${product.name}`,
      text: `Cek produk keren ini dari ${seller.name} di KODIK!`,
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

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) {
      showNotification("Peringatan", "Harap berikan peringkat bintang.", 'error');
      return;
    }
    if (!user) {
        showNotification("Peringatan", "Anda harus masuk untuk memberikan ulasan.", 'error');
        return;
    }

    const newReview: Review = {
        id: new Date().getTime(), // simple unique id
        productId: product!.id,
        userEmail: user.email,
        userName: user.email.split('@')[0], // simple username from email
        rating: newRating,
        comment: newComment,
        date: new Date().toISOString(),
        userId: user.id,
    };

    setProductReviews(prevReviews => [newReview, ...prevReviews]);
    setNewRating(0);
    setNewComment("");
    showNotification("Berhasil", "Ulasan berhasil dikirim. Terima kasih!");
  };

  if (!product || !seller) {
    return (
      <div className="text-center bg-white dark:bg-neutral-800 p-10 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold">Produk atau Penjual tidak ditemukan</h1>
        <Link to="/products" className="text-primary hover:underline mt-4 inline-block">
          <Button>Kembali ke Halaman Produk</Button>
        </Link>
      </div>
    );
  }

  const productImages = product.imageUrls;

  let relatedProducts = products
    .filter(p => p.sellerId === product.sellerId && p.id !== product.id);
  
  let relatedProductsTitle = "Produk Lain dari Penjual Ini";

  if (relatedProducts.length === 0) {
    relatedProducts = products
      .filter(p => p.category === product.category && p.id !== product.id);
    relatedProductsTitle = "Produk Serupa Lainnya";
  }

  const displayedRelatedProducts = relatedProducts.slice(0, 4);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };
  
  const avgRating = productReviews.length > 0
    ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
    : 0;

  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;

  const renderDescription = () => {
    if (isLoadingDescription) {
      return (
        <div className="min-h-[150px] flex flex-col justify-center">
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
            </div>
            <p className="text-sm text-center text-primary font-semibold pt-6">✨ Asisten AI sedang menulis deskripsi produk yang menarik...</p>
        </div>
      );
    }
    
    if (aiDescription) {
      return (
        <>
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">{aiDescription}</p>
          <div className="text-right text-xs text-neutral-500 dark:text-neutral-400 italic mt-4">
            Deskripsi ini dibuat dengan bantuan AI
          </div>
        </>
      );
    }

    return <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{product.description}</p>;
  };

  return (
    <>
      <div className="space-y-8">
        <div className="bg-white dark:bg-neutral-800 p-6 md:p-8 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <div 
                className="w-full aspect-square bg-neutral-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center overflow-hidden cursor-zoom-in group"
                onClick={() => setIsZoomModalOpen(true)}
              >
                <img 
                  src={productImages[selectedImageIndex]} 
                  alt={`${product.name} - Gambar ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {productImages.map((imgSrc, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${selectedImageIndex === index ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                  >
                    <img src={imgSrc} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50">{product.name}</h1>
                {product.discount && (
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    DISKON {product.discount}%
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-300">
                {productReviews.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-neutral-800 dark:text-neutral-100">{avgRating.toFixed(1)}</span>
                        <StarRating rating={avgRating} />
                        <span className="text-neutral-500 dark:text-neutral-400">({productReviews.length} ulasan)</span>
                    </div>
                )}
                <div className="border-l dark:border-neutral-600 h-5"></div>
                <span>Kategori: <span className="font-semibold text-primary">{product.category}</span></span>
              </div>
              <div className="my-6">
                {product.discount ? (
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl md:text-4xl font-bold text-red-600">
                      {formatRupiah(discountedPrice)}
                    </p>
                    <p className="text-xl md:text-2xl text-neutral-500 dark:text-neutral-400 line-through">
                      {formatRupiah(product.price)}
                    </p>
                  </div>
                ) : (
                  <p className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100">
                    {formatRupiah(product.price)}
                  </p>
                )}
              </div>

              <div className="mt-auto border dark:border-neutral-700 rounded-lg p-6 shadow-sm bg-neutral-50 dark:bg-neutral-700/50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Atur Jumlah</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">Stok: <span className="font-bold">{product.stock}</span></p>
                  </div>
                  <div className="space-y-3">
                    <Button onClick={handleBuyNow} disabled={product.stock === 0} className="w-full !text-base sm:!text-lg !py-3 !font-bold">
                      {product.stock > 0 ? 'Beli Sekarang' : 'Stok Habis'}
                    </Button>
                    <div className="flex items-center gap-3">
                      <Button onClick={handleAddToCart} variant="outline" disabled={product.stock === 0} className="w-full !text-base sm:!text-lg !py-3 !font-bold">
                        + Keranjang
                      </Button>
                      <button 
                        onClick={handleWishlistToggle} 
                        className={`p-3 rounded-lg border-2 transition-colors ${isWishlisted ? 'bg-red-500 border-red-500 text-white' : 'bg-transparent border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-300 hover:border-red-500 hover:text-red-500'}`}
                        aria-label="Tambah ke wishlist"
                      >
                        <HeartIcon className="w-6 h-6" fill={isWishlisted ? 'currentColor' : 'none'} />
                      </button>
                      <button 
                        onClick={handleShare} 
                        className="p-3 rounded-lg border-2 border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-300 hover:border-primary hover:text-primary transition-colors"
                        aria-label="Bagikan produk"
                      >
                        <ShareIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 p-6 md:p-8 rounded-lg shadow-lg">
          <h3 className="font-bold text-xl border-b dark:border-neutral-700 pb-3 mb-4">Deskripsi Produk</h3>
          {renderDescription()}
          <div className="mt-6 border-t dark:border-neutral-700 pt-4">
               <button onClick={handleSellerClick} className="text-lg text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors">
                 Penjual: <span className="font-semibold underline">{seller.name}</span>
               </button>
          </div>
        </div>

        {/* Review Section */}
        <div className="bg-white dark:bg-neutral-800 p-6 md:p-8 rounded-lg shadow-lg">
          <h3 className="font-bold text-xl mb-4">Ulasan Produk ({productReviews.length})</h3>
          
          {/* Review Submission Form */}
          <div className="mb-8 border-b dark:border-neutral-700 pb-8">
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <h4 className="font-semibold">Tulis Ulasan Anda</h4>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">Peringkat Anda</label>
                  <StarRating rating={newRating} onRatingChange={setNewRating} />
                </div>
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">Ulasan Anda</label>
                  <textarea
                    id="comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    placeholder={`Bagaimana pendapat Anda tentang ${product.name}?`}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent dark:bg-neutral-700 dark:text-white"
                  ></textarea>
                </div>
                <Button type="submit">Kirim Ulasan</Button>
              </form>
            ) : (
              <div className="text-center p-4 border dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-700/50">
                <p>Silakan <Link to="/login" className="text-primary font-semibold hover:underline">masuk</Link> untuk menulis ulasan.</p>
              </div>
            )}
          </div>
          
          {/* Review List */}
          <div className="space-y-6">
            {productReviews.length > 0 ? (
              productReviews.map(review => (
                <div key={review.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-6 h-6 text-neutral-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{review.userName}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{new Date(review.date).toLocaleDateString('id-ID')}</p>
                    </div>
                    <StarRating rating={review.rating} />
                    <p className="text-neutral-700 dark:text-neutral-300 mt-2">{review.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-neutral-500 dark:text-neutral-400 text-center py-4">Belum ada ulasan untuk produk ini.</p>
            )}
          </div>
        </div>
        
        {displayedRelatedProducts.length > 0 && (
          <div className="bg-white dark:bg-neutral-800 p-6 md:p-8 rounded-lg shadow-lg">
            <h3 className="font-bold text-xl mb-4">{relatedProductsTitle}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {displayedRelatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {isZoomModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-neutral-300"
            aria-label="Tutup"
          >
            <XIcon className="w-8 h-8"/>
          </button>
          <div className="relative max-w-3xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img 
              src={productImages[selectedImageIndex]} 
              alt={`Zoomed ${product.name}`}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailPage;
