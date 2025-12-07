

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSeller } from '../../hooks/useSeller';
import { orders, products, reviews } from '../../data/dummyData';
import SalesChart from '../../components/seller/SalesChart';
import { BoxIcon, StoreIcon, StarIcon, ClipboardListIcon, ChatBubbleIcon, XIcon } from '../../components/Icons';
import Button from '../../components/Button';
import StarRating from '../../components/StarRating';

const SalesSummaryItem = ({ title, value }: { title: string; value: string | React.ReactNode }) => (
    <div className="p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg shadow-sm">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{title}</p>
        <p className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mt-1 truncate">{value}</p>
    </div>
);


const SellerDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { unreadChatCount, simulateNewMessage } = useSeller();
    const [chartView, setChartView] = useState<'harian' | 'mingguan' | 'bulanan'>('harian');
    const [showChatNotification, setShowChatNotification] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (unreadChatCount === 0) {
                simulateNewMessage();
            }
        }, 5000); // 5-second delay

        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    useEffect(() => {
        if (unreadChatCount > 0) {
            setShowChatNotification(true);
        }
    }, [unreadChatCount]);

    // --- Data Calculation ---
    const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();
    const today = new Date('2024-07-28T12:00:00Z');
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const monthlyOrders = orders.filter(o => new Date(o.date).getMonth() === today.getMonth() && new Date(o.date).getFullYear() === today.getFullYear());
    const omzetHariIni = orders.filter(o => isSameDay(new Date(o.date), today)).reduce((sum, o) => sum + o.total, 0);
    const omzetKemarin = orders.filter(o => isSameDay(new Date(o.date), yesterday)).reduce((sum, o) => sum + o.total, 0);
    const totalOmzetBulanIni = monthlyOrders.reduce((sum, o) => sum + o.total, 0);
    const totalPesananBulanIni = monthlyOrders.length;
    
    const productSales = monthlyOrders.flatMap(o => o.items).reduce((acc, item) => {
        acc[item.product.id] = (acc[item.product.id] || 0) + item.quantity;
        return acc;
    }, {} as Record<number, number>);

    const bestSellerId = Object.keys(productSales).length > 0 ? parseInt(Object.keys(productSales).reduce((a, b) => productSales[parseInt(a)] > productSales[parseInt(b)] ? a : b)) : null;
    const produkTerlaris = bestSellerId ? products.find(p => p.id === bestSellerId) : null;
    
    // Data for Quick Action Cards
    const pendingOrders = orders.filter(o => o.status === 'dikemas');
    const lowStockProducts = products.filter(p => p.sellerId === 1 && p.stock > 0 && p.stock < 10); // Assuming sellerId 1 for demo
    const latestReview = reviews.filter(r => products.some(p => p.id === r.productId && p.sellerId === 1)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    // Generate daily sales data for 31 days
    const dailySalesData = Array.from({ length: 31 }, (_, i) => ({
      label: String(i + 1),
      value: Math.floor(Math.random() * (950000 - 250000 + 1)) + 250000,
    }));
    
    const weeklySalesData = [{ label: 'Mgg 1', value: 4250000 }, { label: 'Mgg 2', value: 3800000 }, { label: 'Mgg 3', value: 5100000 }, { label: 'Mgg 4', value: 4750000 }];
    const monthlySalesData = [{ label: 'Jan', value: 15000000 }, { label: 'Feb', value: 12500000 }, { label: 'Mar', value: 18000000 }, { label: 'Apr', value: 16500000 }, { label: 'Mei', value: 21000000 }, { label: 'Jun', value: 19500000 }, { label: 'Jul', value: 25000000 }];
    const getCurrentSalesData = () => {
        if (chartView === 'harian') return dailySalesData;
        if (chartView === 'mingguan') return weeklySalesData;
        return monthlySalesData;
    };
    
    // Calculate a dynamic minimum width for the daily chart to ensure scroll
    const dailyChartMinWidth = dailySalesData.length * 40; // Approx 40px per data point
    
    const formatRupiah = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Dashboard Penjual</h1>
                <p className="text-neutral-600 dark:text-neutral-300 mt-1">Selamat datang, {user?.email}!</p>
            </div>
            
            {showChatNotification && unreadChatCount > 0 && (
                <div className="bg-primary/10 border-l-4 border-primary text-primary-dark p-4 rounded-r-lg flex items-center justify-between gap-4 animate-fade-in">
                    <div className="flex items-center gap-3">
                        <ChatBubbleIcon className="w-6 h-6 flex-shrink-0" />
                        <div>
                            <p className="font-bold">Anda memiliki {unreadChatCount} pesan baru!</p>
                            <Link to="chat" className="text-sm font-semibold underline hover:no-underline">Balas sekarang</Link>
                        </div>
                    </div>
                    <button onClick={() => setShowChatNotification(false)} className="p-1 rounded-full hover:bg-primary/20">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
            )}
            
            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow-md">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-neutral-700 dark:text-neutral-200">Perlu Perhatian</h3>
                        <ClipboardListIcon className="w-6 h-6 text-yellow-500"/>
                    </div>
                    <p className="text-3xl font-bold mt-2"><span className="text-neutral-800 dark:text-neutral-100">{pendingOrders.length}</span> <span className="text-base font-medium text-neutral-500 dark:text-neutral-400">Pesanan</span></p>
                    <Link to="orders"><Button variant="outline" className="w-full mt-4 !text-sm !py-1.5">Proses Pesanan</Button></Link>
                </div>
                 <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow-md">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-neutral-700 dark:text-neutral-200">Stok Segera Habis</h3>
                        <BoxIcon className="w-6 h-6 text-red-500"/>
                    </div>
                    <p className="text-3xl font-bold mt-2"><span className="text-neutral-800 dark:text-neutral-100">{lowStockProducts.length}</span> <span className="text-base font-medium text-neutral-500 dark:text-neutral-400">Produk</span></p>
                    <Link to="products"><Button variant="outline" className="w-full mt-4 !text-sm !py-1.5">Cek Stok</Button></Link>
                </div>
                 <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow-md">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-neutral-700 dark:text-neutral-200">Ulasan Baru</h3>
                        <StarIcon className="w-6 h-6 text-blue-500"/>
                    </div>
                     {latestReview ? (
                        <>
                            <div className="flex items-center gap-2 mt-2">
                                <StarRating rating={latestReview.rating} />
                                <span className="font-bold text-neutral-800 dark:text-neutral-100">{latestReview.rating.toFixed(1)}</span>
                            </div>
                            <Link to="reviews"><Button variant="outline" className="w-full mt-4 !text-sm !py-1.5">Balas Ulasan</Button></Link>
                        </>
                    ) : <p className="mt-2 text-neutral-500 dark:text-neutral-400">Belum ada ulasan.</p>}
                </div>
            </div>

            {/* Sales Summary Section */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-4">Ringkasan Penjualan</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <SalesSummaryItem title="Omzet Hari Ini" value={formatRupiah(omzetHariIni)} />
                    <SalesSummaryItem title="Omzet Kemarin" value={formatRupiah(omzetKemarin)} />
                    <SalesSummaryItem title="Omzet Bulan Ini" value={formatRupiah(totalOmzetBulanIni)} />
                    <SalesSummaryItem title="Total Pesanan (Bulan Ini)" value={totalPesananBulanIni.toString()} />
                    <SalesSummaryItem title="Produk Terlaris" value={produkTerlaris ? produkTerlaris.name : 'N/A'} />
                </div>
            </div>

            {/* Sales Chart */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
                    <h3 className="text-lg font-bold">Grafik Penjualan</h3>
                    <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-700 p-1 rounded-lg">
                        <button onClick={() => setChartView('harian')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${chartView === 'harian' ? 'bg-white dark:bg-primary dark:text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'}`}>Harian</button>
                        <button onClick={() => setChartView('mingguan')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${chartView === 'mingguan' ? 'bg-white dark:bg-primary dark:text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'}`}>Mingguan</button>
                        <button onClick={() => setChartView('bulanan')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${chartView === 'bulanan' ? 'bg-white dark:bg-primary dark:text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'}`}>Bulanan</button>
                    </div>
                </div>
                <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                    <div className="h-64" style={{ minWidth: chartView === 'harian' ? `${dailyChartMinWidth}px` : '100%' }}>
                        <SalesChart data={getCurrentSalesData()} />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SellerDashboardPage;