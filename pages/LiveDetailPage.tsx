import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { liveSessions, sellers, products, endLiveSession, virtualGifts } from '../data/dummyData';
import { LiveChatMessage, Product, VirtualGift } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import { useFollow } from '../hooks/useFollow';
import { useShare } from '../hooks/useShare';
import Button from '../components/Button';
import { ShoppingCartIcon, XIcon, ShareIcon, StoreIcon, EyeIcon, HeartIcon, GiftIcon, CurrencyDollarIcon } from '../components/Icons';

let heartCounter = 0;
let giftCounter = 0;

const GiftPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSendGift: (gift: VirtualGift) => void;
}> = ({ isOpen, onClose, onSendGift }) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/50 z-40 flex flex-col justify-end" onClick={onClose}>
      <div className="bg-neutral-800 p-4 rounded-t-2xl animate-popup-in" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Kirim Hadiah</h3>
          <Link to="/profile" className="bg-yellow-400/20 text-yellow-300 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-2 hover:bg-yellow-400/30 transition-colors">
            <CurrencyDollarIcon className="w-4 h-4" />
            <span>{user?.coins || 0}</span>
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4 text-center">
          {virtualGifts.map(gift => (
            <div key={gift.id} onClick={() => onSendGift(gift)} className="p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
              <span className="text-4xl drop-shadow-lg">{gift.icon}</span>
              <p className="text-xs mt-1 truncate">{gift.name}</p>
              <p className="text-xs font-bold text-yellow-400 flex items-center justify-center gap-1">
                <CurrencyDollarIcon className="w-3 h-3" />
                {gift.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const LiveDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, spendCoins } = useAuth();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const { isFollowing, followSeller, unfollowSeller } = useFollow();
  const { showShareModal } = useShare();
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [session, setSession] = useState(() => liveSessions.find(s => s.id === parseInt(id || '')));
  const [isLoading, setIsLoading] = useState(!session);

  const seller = useMemo(() => session ? sellers.find(s => s.id === session.sellerId) : null, [session]);
  const sessionProducts = useMemo(() => session ? products.filter(p => session.productIds.includes(p.id)) : [], [session]);
  
  const currentSeller = useMemo(() => user ? sellers.find(s => s.email === user.email) : null, [user]);
  const isHost = useMemo(() => session?.status === 'live' && currentSeller?.id === seller?.id, [session, currentSeller, seller]);

  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEndLiveModal, setShowEndLiveModal] = useState(false);
  const [pinnedProductId, setPinnedProductId] = useState<number | null>(null);

  const [likes, setLikes] = useState(session?.likes || 0);
  const [viewers, setViewers] = useState(session?.viewers || 0);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [isGiftPanelOpen, setIsGiftPanelOpen] = useState(false);
  const [floatingGifts, setFloatingGifts] = useState<{ id: number; icon: string; x: number }[]>([]);

  const pinnedProduct = useMemo(() => {
    if (!pinnedProductId) return null;
    return products.find(p => p.id === pinnedProductId) || null;
  }, [pinnedProductId]);
  
  const jitsiUrl = useMemo(() => {
    if (!session || !seller) return '';

    const roomName = `KODIK-Live-Session-${session.id}`;
    const baseUrl = `https://meet.jit.si/${roomName}`;
    let configString = '#config.prejoinPageEnabled=false';
    configString += '&interfaceConfig.SHOW_JITSI_WATERMARK=false';
    configString += '&interfaceConfig.SHOW_WATERMARK_FOR_GUESTS=false';
    configString += '&interfaceConfig.SHOW_BRAND_WATERMARK=false';
    configString += '&interfaceConfig.SHOW_POWERED_BY=false';
    configString += '&interfaceConfig.DISABLE_JOIN_LEAVE_NOTIFICATIONS=true';


    if (isHost) {
        configString += `&userInfo.displayName="${encodeURIComponent(seller.name)}"`;
        configString += '&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","hangup"]';
    } else {
        const displayName = user?.email?.split('@')[0] || 'Penonton';
        configString += `&userInfo.displayName="${encodeURIComponent(displayName)}"`;
        configString += '&interfaceConfig.TOOLBAR_BUTTONS=[]';
        configString += '&config.startWithVideoMuted=true';
        configString += '&config.startWithAudioMuted=true';
    }

    return `${baseUrl}${configString}`;
  }, [session, seller, isHost, user]);

  useEffect(() => {
    const currentSession = liveSessions.find(s => s.id === parseInt(id || ''));
    if (currentSession) {
      setSession(currentSession);
      setIsLoading(false);
      if (currentSession.status === 'replay' && videoRef.current) {
        videoRef.current.src = 'https://videos.pexels.com/video-files/855352/855352-hd_720_1366_25fps.mp4';
        videoRef.current.muted = false;
        videoRef.current.loop = true;
        videoRef.current.play().catch(e => console.error("Replay autoplay failed", e));
      }
    } else {
        setIsLoading(false); // Session not found
    }
  }, [id]);

  const sampleChats: Omit<LiveChatMessage, 'id'>[] = [
    { userName: 'Andi', text: 'Keren banget produknya!' }, { userName: 'Sari', text: 'Diskonnya sampai kapan kak?' }, { userName: 'Rina', text: 'Baru join, lagi bahas apa nih?' }, { userName: 'Budi', text: '💚', isGift: true, giftIcon: '💚' }, { userName: 'Joko', text: 'Pengirimannya aman kan?' }, { userName: 'Wati', text: 'Langsung checkout ah! 👍' },
  ];

  useEffect(() => {
    if (isHost || session?.status !== 'live') return;
    const viewersInterval = setInterval(() => setViewers(v => Math.max(50, v + Math.floor(Math.random() * 5) - 2)), 3000);
    const likesInterval = setInterval(() => setLikes(l => l + Math.floor(Math.random() * 10)), 1500);
    const chatInterval = setInterval(() => {
      const randomMsg = sampleChats[Math.floor(Math.random() * sampleChats.length)];
      setChatMessages(prev => [...prev, { ...randomMsg, id: Date.now() }]);
    }, 2500);
    setChatMessages([ { id: 1, userName: 'Budi', text: 'Wah, serabinya kelihatan enak banget!' }, { id: 2, userName: 'Citra', text: 'Ada promo apa aja nih, kak?' }, ]);
    return () => { clearInterval(viewersInterval); clearInterval(likesInterval); clearInterval(chatInterval); };
  }, [isHost, session?.status]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => { e.preventDefault(); if (!newMessage.trim()) return; if (!isAuthenticated) { showNotification('Gagal', 'Anda harus masuk untuk mengirim komentar.', 'error', { label: 'Masuk', path: '/login' }); return; } const msg: LiveChatMessage = { id: Date.now(), userName: 'Anda', text: newMessage }; setChatMessages(prev => [...prev, msg]); setNewMessage(''); };
  const handleAddToCart = (product: Product) => { addToCart(product.id); showNotification('Berhasil', `'${product.name}' ditambahkan ke keranjang.`, 'success', { label: 'Lihat Keranjang', path: '/cart' }); };
  const handleCloseClick = () => { if (isHost) { setShowEndLiveModal(true); } else { navigate('/live'); } };
  const handleEndLive = () => { if (session) { endLiveSession(session.id); showNotification('Berhasil', 'Sesi live telah diakhiri.'); navigate('/seller/live'); } setShowEndLiveModal(false); };
  const handleAddHeart = () => { setLikes(l => l + 1); const newHeart = { id: heartCounter++, x: Math.random() * 50 + 25 }; setFloatingHearts(prev => [...prev, newHeart]); setTimeout(() => setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id)), 2000); };

  const handleSendGift = (gift: VirtualGift) => {
    if (!isAuthenticated) {
      showNotification('Gagal', 'Anda harus masuk untuk mengirim hadiah.', 'error', { label: 'Masuk', path: '/login' });
      return;
    }

    if (spendCoins(gift.price)) {
      const msg: LiveChatMessage = {
        id: Date.now(),
        userName: user?.email?.split('@')[0] || 'Anda',
        text: `mengirimkan ${gift.name}`,
        isGift: true,
        giftIcon: gift.icon,
      };
      setChatMessages(prev => [...prev, msg]);

      const newGiftAnimation = { id: giftCounter++, icon: gift.icon, x: Math.random() * 50 + 25 };
      setFloatingGifts(prev => [...prev, newGiftAnimation]);
      setTimeout(() => {
        setFloatingGifts(prev => prev.filter(g => g.id !== newGiftAnimation.id));
      }, 2000);

      setIsGiftPanelOpen(false);
    } else {
      showNotification('Koin Tidak Cukup', 'Koin Anda tidak cukup untuk mengirim hadiah ini.', 'error', { label: 'Isi Ulang', path: '/profile' });
    }
  };

  const handlePinProduct = (productId: number) => {
    if (isHost) {
      setPinnedProductId(productId);
    }
  };
  
  const handleUnpinProduct = () => {
    if (isHost) {
      setPinnedProductId(null);
    }
  };

  const handleShare = async () => {
    if (!session || !seller) return;

    const shareUrl = window.location.href;
    const shareData = {
      title: `${seller.name} sedang live di KODIK!`,
      text: `Tonton keseruan live shopping dari ${seller.name} dan dapatkan promo spesial!`,
      url: shareUrl,
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
  
  if (isLoading) {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-neutral-900 text-white text-center p-4">
            <h1 className="text-2xl font-bold animate-pulse">Menyambungkan ke Sesi Live...</h1>
            <p className="mt-2 text-neutral-300">Harap tunggu sebentar.</p>
        </div>
    );
  }

  if (!session || !seller) { return <div className="h-screen w-screen flex flex-col items-center justify-center bg-neutral-100 text-center p-4"><h1 className="text-2xl font-bold">Sesi live tidak ditemukan atau telah berakhir.</h1><Button onClick={() => navigate('/live')} className="mt-4">Kembali ke Live</Button></div>; }

  const following = isFollowing(seller.id);
  const handleFollowToggle = () => { if (!isAuthenticated) { showNotification('Gagal', 'Anda harus masuk untuk mengikuti toko.', 'error', { label: 'Masuk', path: '/login' }); return; } if (following) { unfollowSeller(seller.id); } else { followSeller(seller.id); } };

  const formatRupiah = (number: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  const formatNumber = (num: number) => { if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'jt'; if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k'; return num.toString(); };
  
  const renderHostFooter = () => (
    <div className="flex items-center gap-3 w-full">
      <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg flex-1 max-w-sm">
        <p className="text-xs font-bold mb-2">Sematkan Produk</p>
        <div className="max-h-24 overflow-y-auto space-y-1 pr-1 scrollbar-hide">
          {sessionProducts.map(product => (
            <div key={product.id} className={`flex items-center gap-2 p-1 rounded-md text-xs transition-colors ${pinnedProductId === product.id ? 'bg-primary/80' : 'bg-black/30'}`}>
              <img src={product.imageUrls[0]} alt={product.name} className="w-8 h-8 rounded object-cover flex-shrink-0" />
              <p className="flex-1 truncate">{product.name}</p>
              <button
                onClick={() => handlePinProduct(product.id)}
                className="bg-white/20 hover:bg-white/40 px-2 py-1 rounded-md text-xs font-semibold disabled:opacity-50"
                disabled={pinnedProductId === product.id}
              >
                {pinnedProductId === product.id ? 'Tersemat' : 'Pin'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBuyerFooter = () => (
    <form onSubmit={handleSendMessage} className="flex-1">
      <input
        type="text"
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
        placeholder="Tambah komentar..."
        className="w-full bg-neutral-800/60 backdrop-blur-sm placeholder-neutral-300 text-white rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        autoComplete="off"
      />
    </form>
  );

  return (
    <>
      <div className="h-screen w-screen bg-black text-white relative flex flex-col font-sans overflow-hidden">
        {session.status === 'live' ? (
          <iframe
            allow="camera; microphone; display-capture"
            src={jitsiUrl}
            className="absolute inset-0 w-full h-full object-cover z-0 border-0"
          ></iframe>
        ) : (
          <video ref={videoRef} autoPlay playsInline controls className="absolute inset-0 w-full h-full object-cover z-0" poster={session.thumbnailUrl} />
        )}

        {isSessionEnded && (
          <div className="absolute inset-0 bg-black/70 z-30 flex flex-col items-center justify-center text-center p-4 animate-fade-in">
            <h2 className="text-2xl font-bold">Siaran Langsung Telah Berakhir</h2>
            <p className="mt-2 text-neutral-300">Terima kasih telah menonton. Anda akan diarahkan kembali.</p>
          </div>
        )}
        <div className="absolute bottom-20 right-4 h-64 w-20 pointer-events-none z-20">
          {floatingGifts.map(gift => (
            <div key={gift.id} className="absolute bottom-0 animate-float-up" style={{ left: `${gift.x}%` }}>
              <span className="text-4xl drop-shadow-md">{gift.icon}</span>
            </div>
          ))}
          {floatingHearts.map(heart => (<div key={heart.id} className="absolute bottom-0 animate-float-up" style={{ left: `${heart.x}%` }}><HeartIcon className="w-8 h-8 text-red-500" fill="currentColor" style={{ filter: `hue-rotate(${Math.random() * 360}deg)` }} /></div>))}
        </div>
        <header className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 bg-neutral-900/60 backdrop-blur-sm p-1.5 pr-3 rounded-full">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
                {seller.imageUrl ? (
                    <img src={seller.imageUrl} alt={seller.name} className="w-full h-full object-cover" />
                ) : (
                    <StoreIcon className="w-5 h-5 text-white" />
                )}
            </div>
            <div>
              <div className="flex items-center gap-2"><p className="font-bold text-sm truncate">{seller.name}</p>{!isHost && (<button onClick={handleFollowToggle} className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${following ? 'bg-white/20 text-white' : 'bg-primary text-white'}`}>{following ? 'Diikuti' : 'Ikuti'}</button>)}</div>
              <div className="flex items-center gap-3 text-xs text-white/80 mt-1"><div className="flex items-center gap-1"><EyeIcon className="w-4 h-4" /><span>{formatNumber(viewers)}</span></div><div className="flex items-center gap-1"><HeartIcon className="w-3 h-3" /><span>{formatNumber(likes)}</span></div></div>
            </div>
          </div>
          <button onClick={handleCloseClick} className="p-2.5 bg-neutral-900/60 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"><XIcon className="w-5 h-5" /></button>
        </header>

        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 mt-auto flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent">
          <div className="w-full max-h-48 overflow-y-auto text-sm space-y-2 mb-4 scrollbar-hide">
            {chatMessages.map(msg => (
              <div key={msg.id} className="drop-shadow-md animate-fade-in text-sm">
                {msg.isGift ? (
                    <div className="bg-yellow-400/20 text-yellow-300 p-2 rounded-lg inline-flex items-center gap-2">
                        <span className="font-bold opacity-90">{msg.userName}</span>
                        <span className="opacity-80">{msg.text}</span>
                        <span className="text-lg">{msg.giftIcon}</span>
                    </div>
                ) : (
                    <p>
                        <span className="font-bold mr-1.5 opacity-80">{msg.userName}:</span>
                        <span>{msg.text}</span>
                    </p>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          {pinnedProduct && (
            <div className="bg-white/95 backdrop-blur-sm text-black p-2 rounded-lg flex items-center gap-3 animate-fade-in shadow-lg mb-4">
              <img src={pinnedProduct.imageUrls[0]} alt={pinnedProduct.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0"/>
              <div className="flex-1 min-w-0"><p className="font-bold text-sm truncate">{pinnedProduct.name}</p><p className="font-semibold text-primary">{formatRupiah(pinnedProduct.price)}</p></div>
              <Button onClick={() => handleAddToCart(pinnedProduct)} className="!px-5 !py-2 !font-bold !text-sm flex-shrink-0">Beli</Button>
              {isHost && <button onClick={handleUnpinProduct} className="p-1 text-neutral-500 hover:text-black"><XIcon className="w-4 h-4"/></button>}
            </div>
          )}

          <footer className="flex items-center gap-3">
            {isHost ? renderHostFooter() : renderBuyerFooter()}
            <div className="flex items-center gap-3 ml-auto">
              {!isHost && (
                <button onClick={() => setIsGiftPanelOpen(true)} className="p-2.5 bg-neutral-800/60 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors">
                  <GiftIcon className="w-6 h-6 text-yellow-300" />
                </button>
              )}
              <button className="p-2.5 bg-neutral-800/60 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"><ShoppingCartIcon className="w-6 h-6" /></button>
              {!isHost && <button onClick={handleAddHeart} className="p-2.5 bg-neutral-800/60 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"><HeartIcon className="w-6 h-6 text-red-400" /></button>}
              <button onClick={handleShare} className="p-2.5 bg-neutral-800/60 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"><ShareIcon className="w-6 h-6" /></button>
            </div>
          </footer>
        </div>

        {showEndLiveModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-overlay" onClick={() => setShowEndLiveModal(false)}>
            <div className="bg-white text-black p-6 rounded-lg text-center w-full max-w-sm animate-popup-in" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-2">Akhiri Sesi Live?</h2>
              <p className="text-neutral-600 mb-6">Apakah Anda yakin ingin mengakhiri siaran langsung ini?</p>
              <div className="flex justify-center gap-4"><Button variant="outline" onClick={() => setShowEndLiveModal(false)} className="flex-1">Batal</Button><Button onClick={handleEndLive} className="flex-1">Ya, Akhiri</Button></div>
            </div>
          </div>
        )}
      </div>
      <GiftPanel
        isOpen={isGiftPanelOpen}
        onClose={() => setIsGiftPanelOpen(false)}
        onSendGift={handleSendGift}
      />
    </>
  );
};

export default LiveDetailPage;