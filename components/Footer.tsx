import React from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';

const Footer: React.FC = () => {
  const { showNotification } = useNotification();

  const handleComingSoon = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    showNotification('Segera Hadir', 'Halaman ini sedang dalam pengembangan.');
  };

  return (
    <footer className="bg-white dark:bg-neutral-800 border-t dark:border-neutral-700 mt-12">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary">KODIK</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2 max-w-sm">Wadah digital untuk produk UMKM lokal Karawang. Memajukan ekonomi lokal melalui teknologi dan kolaborasi.</p>
          </div>
          <div className="col-span-1">
            <h4 className="font-semibold text-neutral-800 dark:text-neutral-100">Jelajahi</h4>
            <ul className="mt-4 space-y-2">
              <li><Link to="/products" className="text-neutral-600 dark:text-neutral-300 hover:text-primary">Produk</Link></li>
              <li><Link to="/articles" className="text-neutral-600 dark:text-neutral-300 hover:text-primary">Artikel</Link></li>
              <li><Link to="/collaboration" className="text-neutral-600 dark:text-neutral-300 hover:text-primary">Kolaborasi</Link></li>
              <li><Link to="/collaboration" className="text-neutral-600 dark:text-neutral-300 hover:text-primary">Tentang Kami</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-semibold text-neutral-800 dark:text-neutral-100">Bantuan</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#" onClick={handleComingSoon} className="text-neutral-600 dark:text-neutral-300 hover:text-primary">Hubungi Kami</a></li>
              <li><a href="#" onClick={handleComingSoon} className="text-neutral-600 dark:text-neutral-300 hover:text-primary">Kebijakan Privasi</a></li>
              <li><a href="#" onClick={handleComingSoon} className="text-neutral-600 dark:text-neutral-300 hover:text-primary">Syarat & Ketentuan</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t dark:border-neutral-700 pt-6 text-center text-neutral-500 dark:text-neutral-400 text-sm">
          &copy; {new Date().getFullYear()} KODIK (Karawang Online Digital Inovasi Karya). All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;