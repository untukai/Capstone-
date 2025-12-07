
import React, { useState } from 'react';
import { FinancialTransaction } from '../../types';
import Button from '../../components/Button';
import { GiftIcon, XIcon, ChevronDownIcon, CheckCircleIcon } from '../../components/Icons';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../hooks/useAuth';

// --- Reusing Payment Method Components ---
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

// --- Seller Withdraw Modal ---
const SellerWithdrawModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
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
        if (!accountNumber) { showNotification('Gagal', 'Masukkan nomor rekening', 'error'); return; }
        if (totalDeduction > (user?.walletBalance || 0)) { showNotification('Gagal', 'Saldo tidak mencukupi', 'error'); return; }

        withdrawWallet(nominalAmount, selectedProvider, accountNumber);
        showNotification('Berhasil', 'Penarikan dana penjualan berhasil diajukan', 'success');
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
                            {step === 1 ? 'Pilih Tujuan' : step === 2 ? `Pilih ${selectedCategory}` : 'Detail Penarikan'}
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
                                    selected={false} 
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
                                <p className="text-xs text-neutral-500 mt-1">Saldo Toko Tersedia: Rp {user?.walletBalance.toLocaleString()}</p>
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

const SellerFinancePage: React.FC = () => {
  const { showNotification } = useNotification();
  const { user, transactions, withdrawGiftRevenue } = useAuth();
  
  const myTransactions = transactions;
  const mainBalance = user?.walletBalance || 0;
  const giftRevenue = user?.giftBalance || 0;
  
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const formatRupiah = (number: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

  const handleWithdrawGiftRevenue = () => {
    if (giftRevenue <= 0) { showNotification('Gagal', 'Belum ada pendapatan dari gift.', 'error'); return; }
    
    if (withdrawGiftRevenue()) {
        showNotification('Berhasil', 'Pendapatan gift berhasil dipindahkan ke saldo utama.', 'success');
    } else {
        showNotification('Gagal', 'Terjadi kesalahan saat memproses.', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Keuangan Toko</h1>
        <p className="text-neutral-600 mt-1">Kelola saldo penjualan dan pencairan dana.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">Saldo Toko</h3>
          <p className="text-3xl font-bold text-primary my-2">{formatRupiah(mainBalance)}</p>
          <div className="space-y-2 mt-4">
              <Button onClick={() => setIsWithdrawModalOpen(true)} className="w-full">Cairkan Dana</Button>
              <p className="text-xs text-center text-neutral-500">Biaya admin Rp 5.000 per penarikan</p>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg shadow-md border border-purple-100 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
             <GiftIcon className="w-6 h-6 text-purple-600" />
             <h3 className="text-lg font-bold">Pendapatan Gift Live</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600 my-2">{formatRupiah(giftRevenue)}</p>
          <Button onClick={handleWithdrawGiftRevenue} variant="secondary" className="w-full mt-4" disabled={giftRevenue <= 0}>Tarik ke Saldo</Button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4">Riwayat Transaksi</h3>
         <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-700/50">
              <tr>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Tipe</th>
                <th className="px-6 py-3">Deskripsi</th>
                <th className="px-6 py-3 text-right">Jumlah</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {myTransactions.map((trx) => (
                <tr key={trx.id}>
                  <td className="px-6 py-4">{new Date(trx.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium">{trx.type}</td>
                  <td className="px-6 py-4">{trx.description}</td>
                  <td className={`px-6 py-4 text-right font-bold ${trx.isCredit ? 'text-green-600' : 'text-red-500'}`}>
                    {trx.isCredit ? '+' : '-'}{formatRupiah(trx.amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">{trx.status}</span>
                  </td>
                </tr>
              ))}
              {myTransactions.length === 0 && <tr><td colSpan={5} className="text-center py-4 text-neutral-500">Belum ada transaksi</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <SellerWithdrawModal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)} />
    </div>
  );
};

export default SellerFinancePage;
