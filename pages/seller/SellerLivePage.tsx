
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { liveSessions, sellers, products, addLiveSession } from '../../data/dummyData';
import { LiveSession, Product } from '../../types';
import Button from '../../components/Button';
import { PlusIcon, VideoCameraIcon, XIcon } from '../../components/Icons';

const LiveSessionCard: React.FC<{ session: LiveSession }> = ({ session }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/live/${session.id}`)}
      className="border dark:border-neutral-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-4">
        <img src={session.thumbnailUrl} alt={session.title} className="w-16 h-16 rounded-md object-cover bg-neutral-200 dark:bg-neutral-700 flex-shrink-0" />
        <div>
          <p className="font-bold text-neutral-800 dark:text-neutral-100">{session.title}</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{session.productIds.length} produk ditampilkan</p>
        </div>
      </div>
      <div className="flex-shrink-0">
        {session.status === 'live' ? (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 animate-pulse">LIVE</span>
        ) : (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">Selesai</span>
        )}
      </div>
    </div>
  );
};

const NewLiveSessionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  sellerProducts: Product[];
}> = ({ isOpen, onClose, sellerProducts }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [title, setTitle] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(new Set());
  const [isStarting, setIsStarting] = useState(false);

  const handleProductToggle = (productId: number) => {
    setSelectedProductIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentSeller = sellers.find(s => s.email === user?.email);
    if (!title.trim() || selectedProductIds.size === 0 || !currentSeller) {
      showNotification('Gagal', 'Judul dan minimal satu produk harus dipilih.', 'error');
      return;
    }
  
    setIsStarting(true);
  
    const newSession = addLiveSession({
      sellerId: currentSeller.id,
      title,
      thumbnailUrl: products.find(p => p.id === Array.from(selectedProductIds)[0])?.imageUrls[0] || '',
      productIds: Array.from(selectedProductIds),
    });

    showNotification('Berhasil!', 'Mengarahkan Anda ke studio live...');
    onClose();
    navigate(`/live/${newSession.id}`);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-overlay" onClick={onClose}>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-lg mx-auto flex flex-col max-h-[90vh] animate-popup-in" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center p-4 border-b dark:border-neutral-700">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">Mulai Sesi Live Baru</h2>
            <button onClick={onClose} className="p-1 text-neutral-500 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-white"><XIcon className="w-6 h-6" /></button>
          </div>
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">Judul Sesi Live</label>
                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Promo Spesial Akhir Bulan!" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:border-neutral-600 dark:text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">Pilih Produk untuk Ditampilkan</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto border dark:border-neutral-700 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-700/50">
                  {sellerProducts.map(product => (
                    <label key={product.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer">
                      <input type="checkbox" checked={selectedProductIds.has(product.id)} onChange={() => handleProductToggle(product.id)} className="h-4 w-4 rounded text-primary focus:ring-primary dark:bg-neutral-600 dark:border-neutral-500" />
                      <img src={product.imageUrls[0]} alt={product.name} className="w-10 h-10 rounded object-cover" />
                      <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{product.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 rounded-b-lg text-right">
              <Button type="submit" disabled={isStarting}>
                {isStarting ? 'Memulai...' : 'Mulai Live Sekarang'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};


const SellerLivePage: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const currentSeller = sellers.find(s => s.email === user?.email);
  const sellerLiveSessions = currentSeller ? liveSessions.filter(s => s.sellerId === currentSeller.id) : [];
  const sellerProducts = currentSeller ? products.filter(p => p.sellerId === currentSeller.id) : [];

  return (
    <>
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 border-b dark:border-neutral-700 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Studio Live Jualan</h1>
            <p className="text-neutral-600 dark:text-neutral-300 mt-1">Atur dan mulai sesi jualan live Anda di sini.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
            <PlusIcon className="w-5 h-5" />
            <span>Mulai Live Baru</span>
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">Riwayat Sesi Live</h2>
          {sellerLiveSessions.length > 0 ? (
            sellerLiveSessions.map(session => <LiveSessionCard key={session.id} session={session} />)
          ) : (
            <div className="text-center py-10 border-2 border-dashed dark:border-neutral-700 rounded-lg">
              <VideoCameraIcon className="w-12 h-12 mx-auto text-neutral-400 dark:text-neutral-500" />
              <p className="text-neutral-500 dark:text-neutral-400 mt-4">Anda belum memiliki riwayat sesi live.</p>
            </div>
          )}
        </div>
      </div>
      <NewLiveSessionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} sellerProducts={sellerProducts} />
    </>
  );
};

export default SellerLivePage;
