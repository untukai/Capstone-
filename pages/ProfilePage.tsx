
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { Order, FinancialTransaction } from '../types';
import Button from '../components/Button';
import { 
    BoxIcon, TruckIcon, CheckCircleIcon, ChevronDownIcon, 
    CurrencyDollarIcon, PlusIcon, XIcon, MinusIcon, 
    StoreIcon, WalletIcon, ChartBarIcon
} from '../components/Icons';

// --- Components ---

const PaymentMethodItem: React.FC<{ icon: string, name: string, onClick: () => void, selected: boolean }> = ({ icon, name, onClick, selected }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-3 w-full p-3 rounded-lg border transition-all ${selected ? 'border-primary bg-primary/5' : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700'}`}
    >
        <span className="text-2xl">{icon}</span>
        <span className="font-medium text-neutral-800 dark:text-neutral-100 flex-1 text-left">{name}</span>
        {selected && <CheckCircleIcon className="w-5 h-5 text-primary" />}
    </button>
);

// Payment Categories Data
const paymentMethods = {
    'QRIS': [{ name: 'QRIS (Scan)', icon: '📱' }],
    'Merchant': [
        { name: 'Indomaret', icon: '🏪' }, { name: 'Alfamart', icon: '🏪' }, 
        { name: 'Lawson', icon: '🏪' }, { name: 'Family Mart', icon: '🏪' }, { name: 'DanDan', icon: '🏪' }
    ],
    'Bank': [
        { name: 'BCA', icon: '🏦' }, { name: 'BRI', icon: '🏦' }, { name: 'BTN', icon: '🏦' },
        { name: 'BSI', icon: '🏦' }, { name: 'SeaBank', icon: '🏦' }, { name: 'Neo Bank', icon: '🏦' },
        { name: 'OCBC', icon: '🏦' }, { name: 'BJB', icon: '🏦' }
    ],
    'E-Wallet': [
        { name: 'GoPay', icon: '🟢' }, { name: 'OVO', icon: '🟣' }, { name: 'Dana', icon: '🔵' }
    ]
};

// --- Modals ---

// 1. TOP UP MODAL (Multi-level)
const TopUpModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { topUpWallet } = useAuth();
    const { showNotification } = useNotification();
    
    const [step, setStep] = useState(1); // 1: Category, 2: Provider, 3: Amount
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedProvider, setSelectedProvider] = useState<string>('');
    const [amount, setAmount] = useState<string>('');

    const adminFee = 1000;
    const nominalAmount = parseInt(amount.replace(/\D/g, '')) || 0;
    const totalPayment = nominalAmount + adminFee;

    const reset = () => {
        setStep(1); setSelectedCategory(''); setSelectedProvider(''); setAmount('');
    }

    const handleClose = () => { reset(); onClose(); };

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        if (nominalAmount < 10000) {
            showNotification('Gagal', 'Minimal top up Rp 10.000', 'error');
            return;
        }
        topUpWallet(nominalAmount, selectedProvider);
        showNotification('Berhasil', `Top Up Rp ${nominalAmount.toLocaleString()} via ${selectedProvider} berhasil!`, 'success');
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-overlay" onClick={handleClose}>
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl w-full max-w-md animate-popup-in overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b dark:border-neutral-700">
                    <div className="flex items-center gap-2">
                        {step > 1 && (
                            <button onClick={() => setStep(step - 1)} className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"><ChevronDownIcon className="w-5 h-5 rotate-90" /></button>
                        )}
                        <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-100">
                            {step === 1 ? 'Pilih Metode' : step === 2 ? `Pilih ${selectedCategory}` : 'Isi Nominal'}
                        </h3>
                    </div>
                    <button onClick={handleClose}><XIcon className="w-6 h-6 text-neutral-500" /></button>
                </div>

                {/* Body */}
                <div className="p-4 overflow-y-auto custom-scrollbar">
                    {step === 1 && (
                        <div className="space-y-3">
                            {Object.keys(paymentMethods).map(cat => (
                                <button key={cat} onClick={() => { setSelectedCategory(cat); setStep(2); }} className="w-full p-4 flex justify-between items-center border dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                                    <span className="font-medium text-lg">{cat}</span>
                                    <ChevronDownIcon className="w-5 h-5 -rotate-90 text-neutral-400" />
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-2">
                            {paymentMethods[selectedCategory as keyof typeof paymentMethods].map(provider => (
                                <PaymentMethodItem 
                                    key={provider.name} 
                                    icon={provider.icon} 
                                    name={provider.name} 
                                    onClick={() => { setSelectedProvider(provider.name); setStep(3); }}
                                    selected={selectedProvider === provider.name}
                                />
                            ))}
                        </div>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleConfirm} className="space-y-4">
                            <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg flex items-center gap-3">
                                <span className="text-2xl">
                                    {Object.values(paymentMethods).flat().find(p => p.name === selectedProvider)?.icon}
                                </span>
                                <div>
                                    <p className="text-xs text-neutral-500">Metode Pembayaran</p>
                                    <p className="font-bold">{selectedProvider}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">Nominal Top Up</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-neutral-500 font-bold">Rp</span>
                                    <input 
                                        type="number" 
                                        value={amount} 
                                        onChange={e => setAmount(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                                        placeholder="Min. 10.000"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-lg space-y-2 text-sm">
                                <div className="flex justify-between dark:text-neutral-300">
                                    <span>Nominal</span>
                                    <span>Rp {nominalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between dark:text-neutral-300">
                                    <span>Biaya Layanan</span>
                                    <span>Rp {adminFee.toLocaleString()}</span>
                                </div>
                                <div className="border-t dark:border-neutral-600 my-2"></div>
                                <div className="flex justify-between font-bold text-lg dark:text-white">
                                    <span>Total Bayar</span>
                                    <span className="text-primary">Rp {totalPayment.toLocaleString()}</span>
                                </div>
                            </div>

                            <Button type="submit" className="w-full font-bold py-3">Bayar Sekarang</Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

// 2. WITHDRAW MODAL (Multi-level)
const WithdrawModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { withdrawWallet, user } = useAuth();
    const { showNotification } = useNotification();
    
    const [step, setStep] = useState(1); // 1: Category, 2: Provider, 3: Details
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedProvider, setSelectedProvider] = useState<string>('');
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');

    const adminFee = 5000;
    const nominalAmount = parseInt(amount.replace(/\D/g, '')) || 0;
    const totalDeduction = nominalAmount + adminFee;

    const reset = () => { setStep(1); setSelectedCategory(''); setSelectedProvider(''); setAccountNumber(''); setAmount(''); }
    const handleClose = () => { reset(); onClose(); }

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        if (nominalAmount < 10000) { showNotification('Gagal', 'Minimal penarikan Rp 10.000', 'error'); return; }
        if (!accountNumber) { showNotification('Gagal', 'Masukkan nomor tujuan/rekening', 'error'); return; }
        if (totalDeduction > (user?.walletBalance || 0)) { showNotification('Gagal', 'Saldo tidak mencukupi', 'error'); return; }

        withdrawWallet(nominalAmount, selectedProvider, accountNumber);
        showNotification('Berhasil', 'Penarikan sedang diproses', 'success');
        handleClose();
    };

    const getInputLabel = () => {
        if (selectedCategory === 'E-Wallet' || selectedCategory === 'Merchant') return 'Nomor HP';
        if (selectedCategory === 'QRIS') return 'Nomor Referensi/HP';
        return 'Nomor Rekening';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-overlay" onClick={handleClose}>
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl w-full max-w-md animate-popup-in flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b dark:border-neutral-700">
                    <div className="flex items-center gap-2">
                        {step > 1 && <button onClick={() => setStep(step - 1)} className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"><ChevronDownIcon className="w-5 h-5 rotate-90" /></button>}
                        <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-100">
                            {step === 1 ? 'Tarik Saldo' : step === 2 ? `Pilih ${selectedCategory}` : 'Detail Penarikan'}
                        </h3>
                    </div>
                    <button onClick={handleClose}><XIcon className="w-6 h-6 text-neutral-500" /></button>
                </div>

                <div className="p-4 overflow-y-auto custom-scrollbar">
                    {step === 1 && (
                        <div className="space-y-3">
                            <p className="text-sm text-neutral-500 mb-2">Pilih metode penarikan dana:</p>
                            {Object.keys(paymentMethods).map(cat => (
                                <button key={cat} onClick={() => { setSelectedCategory(cat); setStep(2); }} className="w-full p-4 flex justify-between items-center border dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                                    <span className="font-medium text-lg">{cat}</span>
                                    <ChevronDownIcon className="w-5 h-5 -rotate-90 text-neutral-400" />
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-2">
                            {paymentMethods[selectedCategory as keyof typeof paymentMethods].map(provider => (
                                <PaymentMethodItem 
                                    key={provider.name} icon={provider.icon} name={provider.name} 
                                    onClick={() => { setSelectedProvider(provider.name); setStep(3); }} 
                                    selected={selectedProvider === provider.name} 
                                />
                            ))}
                        </div>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleConfirm} className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                                <span className="text-2xl">
                                    {Object.values(paymentMethods).flat().find(p => p.name === selectedProvider)?.icon}
                                </span>
                                <div><p className="text-xs text-neutral-500">Tujuan Penarikan</p><p className="font-bold">{selectedProvider}</p></div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">{getInputLabel()}</label>
                                <input type="number" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600 dark:text-white" placeholder={`Masukkan ${getInputLabel().toLowerCase()}`} autoFocus />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Nominal Penarikan</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-neutral-500">Rp</span>
                                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600 dark:text-white" placeholder="Min 10.000" />
                                </div>
                                <p className="text-xs text-neutral-500 mt-1">Saldo Tersedia: Rp {user?.walletBalance.toLocaleString()}</p>
                            </div>

                            <div className="bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-lg space-y-2 text-sm">
                                <div className="flex justify-between dark:text-neutral-300"><span>Jumlah Diterima</span><span>Rp {nominalAmount.toLocaleString()}</span></div>
                                <div className="flex justify-between dark:text-neutral-300"><span>Biaya Admin</span><span>Rp {adminFee.toLocaleString()}</span></div>
                                <div className="border-t dark:border-neutral-600 my-2"></div>
                                <div className="flex justify-between font-bold dark:text-white"><span>Total Potongan</span><span className="text-red-500">Rp {totalDeduction.toLocaleString()}</span></div>
                            </div>

                            <Button type="submit" className="w-full font-bold">Konfirmasi Penarikan</Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

// 3. COIN EXCHANGE MODAL (Tabbed)
const CoinExchangeModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { user, buyCoinsWithWallet, exchangeCoinsToWallet } = useAuth();
    const { showNotification } = useNotification();
    const [mode, setMode] = useState<'buy' | 'sell'>('buy');
    const [customAmount, setCustomAmount] = useState('');

    const presets = [10, 20, 50, 100];
    const amount = parseInt(customAmount) || 0;
    
    // Logic: 1 Coin = 1000 IDR
    const totalValue = amount * 1000;

    const handleAction = () => {
        if (amount <= 0) return;
        
        if (mode === 'buy') {
            if (!buyCoinsWithWallet(amount)) {
                showNotification('Gagal', 'Saldo KODIK tidak cukup.', 'error');
            } else {
                showNotification('Berhasil', `Berhasil membeli ${amount} Koin.`, 'success');
                onClose();
            }
        } else {
            if (!exchangeCoinsToWallet(amount)) {
                showNotification('Gagal', 'Koin tidak cukup.', 'error');
            } else {
                showNotification('Berhasil', `Berhasil menukar ${amount} Koin ke Rp ${totalValue.toLocaleString()}.`, 'success');
                onClose();
            }
        }
        setCustomAmount('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-overlay" onClick={onClose}>
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl w-full max-w-sm animate-popup-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b dark:border-neutral-700">
                    <h3 className="font-bold text-lg">Dompet Koin</h3>
                    <button onClick={onClose}><XIcon className="w-6 h-6 text-neutral-500" /></button>
                </div>
                
                <div className="p-1 bg-neutral-100 dark:bg-neutral-700 m-4 rounded-lg flex">
                    <button onClick={() => setMode('buy')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'buy' ? 'bg-white dark:bg-neutral-600 shadow text-primary' : 'text-neutral-500'}`}>Beli Koin</button>
                    <button onClick={() => setMode('sell')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'sell' ? 'bg-white dark:bg-neutral-600 shadow text-primary' : 'text-neutral-500'}`}>Tukar ke Saldo</button>
                </div>

                <div className="p-4 pt-0 space-y-4">
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">Rate Konversi</p>
                        <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">1 Koin = Rp 1.000</p>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {presets.map(val => (
                            <button key={val} onClick={() => setCustomAmount(String(val))} className={`py-2 rounded-lg border text-sm font-semibold transition-colors ${parseInt(customAmount) === val ? 'border-primary bg-primary/10 text-primary' : 'border-neutral-200 dark:border-neutral-600'}`}>
                                {val}
                            </button>
                        ))}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Jumlah Kustom</label>
                        <input type="number" value={customAmount} onChange={e => setCustomAmount(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600" placeholder="0" />
                    </div>

                    <div className="flex justify-between items-center text-sm font-medium">
                        <span>{mode === 'buy' ? 'Total Bayar' : 'Saldo Diterima'}</span>
                        <span className="text-lg font-bold text-primary">Rp {totalValue.toLocaleString()}</span>
                    </div>

                    <Button onClick={handleAction} className="w-full font-bold" disabled={amount <= 0}>
                        {mode === 'buy' ? 'Beli Sekarang' : 'Tukar Sekarang'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// --- Main Page ---

const ProfilePage: React.FC = () => {
  const { user, logout, isAuthenticated, transactions } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // Modal States
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isCoinOpen, setIsCoinOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); } 
    else {
      const storedOrders = JSON.parse(localStorage.getItem('kodik-orders') || '[]');
      const userOrders = storedOrders.filter((o: Order) => o.customerName === user?.email);
      setOrders(userOrders.reverse());
    }
  }, [isAuthenticated, navigate, user?.email]);

  const getStatusChipClass = (status: FinancialTransaction['status']) => {
      if(status === 'Selesai') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      if(status === 'Gagal') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg flex justify-between items-center">
          <div>
             <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Profil Saya</h1>
                {user?.role === 'penjual' && (
                    <span className="px-2 py-1 text-xs font-bold bg-primary/10 text-primary rounded-md">AKUN PENJUAL</span>
                )}
             </div>
             <p className="text-neutral-600 dark:text-neutral-400">{user?.email}</p>
          </div>
          <Button onClick={() => { logout(); navigate('/'); }} variant="outline">Keluar</Button>
      </div>
      
      {/* Seller Dashboard Access */}
      {user?.role === 'penjual' && (
          <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary rounded-full text-white">
                      <StoreIcon className="w-8 h-8" />
                  </div>
                  <div>
                      <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-100">Mode Penjual Aktif</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">Kelola produk, pesanan, dan keuangan toko Anda.</p>
                  </div>
              </div>
              <Link to="/seller" className="w-full sm:w-auto">
                  <Button className="w-full flex items-center gap-2">
                      <ChartBarIcon className="w-5 h-5" />
                      Ke Dashboard Penjual
                  </Button>
              </Link>
          </div>
      )}
      
      {/* Wallet & Coins Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Saldo KODIK */}
            <div className="bg-gradient-to-br from-emerald-600 to-green-700 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -top-4 bg-white/10 w-32 h-32 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-emerald-100 text-sm font-medium mb-1">Saldo KODIK</p>
                        <h2 className="text-3xl font-bold">Rp {user?.walletBalance.toLocaleString()}</h2>
                    </div>
                    <div className="p-2 bg-white/20 rounded-lg"><WalletIcon className="w-6 h-6" /></div>
                </div>
                <div className="flex gap-3 mt-6 relative z-10">
                     <button onClick={() => setIsTopUpOpen(true)} className="flex-1 bg-white text-emerald-700 hover:bg-emerald-50 py-2.5 px-4 rounded-lg font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2">
                        <PlusIcon className="w-4 h-4" /> Isi Saldo
                    </button>
                    <button onClick={() => setIsWithdrawOpen(true)} className="flex-1 bg-emerald-800/50 hover:bg-emerald-800 text-white border border-emerald-500 py-2.5 px-4 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2">
                        <MinusIcon className="w-4 h-4" /> Tarik
                    </button>
                </div>
            </div>

            {/* Koin KODIK */}
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -top-4 bg-white/10 w-32 h-32 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-yellow-100 text-sm font-medium mb-1">Koin Saya</p>
                        <h2 className="text-3xl font-bold flex items-center gap-2">
                            {user?.coins} <span className="text-lg font-normal opacity-80">Koin</span>
                        </h2>
                    </div>
                    <div className="p-2 bg-white/20 rounded-lg"><CurrencyDollarIcon className="w-6 h-6" /></div>
                </div>
                <div className="mt-6 relative z-10">
                     <button onClick={() => setIsCoinOpen(true)} className="w-full bg-white/20 hover:bg-white/30 text-white py-2.5 px-4 rounded-lg font-bold text-sm border border-white/40 flex items-center justify-center gap-2 transition-colors">
                        Tukar / Beli Koin
                    </button>
                </div>
            </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b dark:border-neutral-700">
              <h2 className="text-xl font-bold">Riwayat Transaksi</h2>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-600 dark:text-neutral-300">
                  <thead className="bg-neutral-50 dark:bg-neutral-700/50 text-xs uppercase font-semibold">
                      <tr>
                          <th className="px-6 py-3">Tanggal</th>
                          <th className="px-6 py-3">Tipe</th>
                          <th className="px-6 py-3">Deskripsi</th>
                          <th className="px-6 py-3 text-right">Nominal</th>
                          <th className="px-6 py-3 text-center">Status</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                      {transactions.length > 0 ? transactions.map(trx => (
                          <tr key={trx.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/30">
                              <td className="px-6 py-4 whitespace-nowrap">{new Date(trx.date).toLocaleDateString()}</td>
                              <td className="px-6 py-4 font-medium">{trx.type}</td>
                              <td className="px-6 py-4">{trx.description}</td>
                              <td className={`px-6 py-4 text-right font-bold ${trx.isCredit ? 'text-green-600' : 'text-red-500'}`}>
                                  {trx.isCredit ? '+' : '-'} Rp {trx.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-center">
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusChipClass(trx.status)}`}>{trx.status}</span>
                              </td>
                          </tr>
                      )) : (
                          <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-500">Belum ada transaksi</td></tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>

      {/* Order History (Existing Code Simplified for brevity) */}
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Riwayat Pesanan</h2>
        <div className="space-y-4">
            {orders.length === 0 && <p className="text-neutral-500">Belum ada pesanan.</p>}
            {orders.map(order => (
                <div key={order.id} className="border dark:border-neutral-700 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-bold">Order #{order.id}</p>
                            <p className="text-sm text-neutral-500">{order.status}</p>
                        </div>
                        <p className="font-bold text-primary">Rp {order.total.toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
      
      {/* Modals */}
      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
      <WithdrawModal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} />
      <CoinExchangeModal isOpen={isCoinOpen} onClose={() => setIsCoinOpen(false)} />
    </div>
  );
};

export default ProfilePage;
