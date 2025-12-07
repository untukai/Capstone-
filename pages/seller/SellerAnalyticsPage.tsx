
import React from 'react';
import { ChartBarIcon, CurrencyDollarIcon, UserIcon } from '../../components/Icons';
import SalesChart from '../../components/seller/SalesChart';

const StatCard = ({ title, value, icon: Icon }: { title: string; value: string; icon: React.FC<any> }) => (
  <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow-md flex items-center gap-4">
    <div className="p-3 bg-primary/10 rounded-full">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">{title}</p>
      <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">{value}</p>
    </div>
  </div>
);

const SellerAnalyticsPage: React.FC = () => {
    // Dummy data for analytics
    const productPerformanceData = [
        { label: 'Serabi', value: 1250000 },
        { label: 'Kaos', value: 980000 },
        { label: 'Batik', value: 750000 },
        { label: 'Dodol', value: 620000 },
        { label: 'Gerabah', value: 450000 },
    ];

    const trafficSourceData = [
        { source: 'Pencarian KODIK', visitors: 1200, percentage: 48 },
        { source: 'Langsung', visitors: 650, percentage: 26 },
        { source: 'Media Sosial', visitors: 400, percentage: 16 },
        { source: 'Lainnya', visitors: 250, percentage: 10 },
    ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Analitik Toko</h1>
        <p className="text-neutral-600 dark:text-neutral-300 mt-1">Pahami performa toko Anda untuk mengambil keputusan yang lebih baik.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Pengunjung (30 hari)" value="2,500" icon={UserIcon} />
        <StatCard title="Tingkat Konversi" value="3.5%" icon={ChartBarIcon} />
        <StatCard title="Rata-rata Nilai Pesanan" value="Rp125.000" icon={CurrencyDollarIcon} />
      </div>

      {/* Product Performance Chart */}
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4">Performa Produk Terlaris (30 hari)</h3>
        <div className="h-72 w-full">
            <SalesChart data={productPerformanceData} />
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4">Lalu Lintas Pengunjung (30 hari)</h3>
        <div className="space-y-4">
          {trafficSourceData.map(item => (
            <div key={item.source}>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-medium text-neutral-700 dark:text-neutral-200">{item.source}</span>
                <span className="text-neutral-500 dark:text-neutral-400">{item.visitors.toLocaleString('id-ID')} Pengunjung</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-4">
                <div
                  className="bg-primary h-4 rounded-full text-center text-white text-xs flex items-center justify-end pr-2"
                  style={{ width: `${item.percentage}%` }}
                >
                  {item.percentage > 10 ? `${item.percentage}%` : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerAnalyticsPage;
