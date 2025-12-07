

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSeller } from '../../hooks/useSeller';
import {
  ChartBarIcon,
  ClipboardListIcon,
  BoxIcon,
  VideoCameraIcon,
  ChatBubbleIcon,
  CurrencyDollarIcon,
  TagIcon,
  StarIcon,
  ChartPieIcon,
  CogIcon,
  UserPlusIcon,
} from '../Icons';

const navLinks = [
  { name: 'Dashboard', path: '/seller', icon: ChartBarIcon, end: true },
  { name: 'Pesanan', path: 'orders', icon: ClipboardListIcon },
  { name: 'Produk', path: 'products', icon: BoxIcon },
  { name: 'Live Jualan', path: 'live', icon: VideoCameraIcon },
  { name: 'Chat', path: 'chat', icon: ChatBubbleIcon },
];

const mainToolsLinks = [
    { name: 'Keuangan', path: 'finance', icon: CurrencyDollarIcon },
    { name: 'Promo & Marketing', path: 'promo', icon: TagIcon },
    { name: 'Kolaborasi', path: 'collaboration', icon: UserPlusIcon },
    { name: 'Rating & Ulasan', path: 'reviews', icon: StarIcon },
];

const improvementLinks = [
    { name: 'Analitik Toko', path: 'analytics', icon: ChartPieIcon },
    { name: 'Pengaturan Toko', path: 'settings', icon: CogIcon },
];

const SellerSidebar: React.FC = () => {
  const { unreadChatCount } = useSeller();
  const activeLinkClass = 'bg-primary text-white';
  const defaultLinkClass = 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700';

  const renderLinks = (links: typeof navLinks | typeof mainToolsLinks) => (
    links.map((link) => (
      <NavLink
        key={link.name}
        to={link.path}
        // @ts-ignore
        end={link.end}
        className={({ isActive }) =>
          `flex items-center justify-between gap-3 w-full text-left px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
            isActive ? activeLinkClass : defaultLinkClass
          }`
        }
      >
        <div className="flex items-center gap-3">
          <link.icon className="w-5 h-5 flex-shrink-0" />
          <span>{link.name}</span>
        </div>
        {link.name === 'Chat' && unreadChatCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadChatCount}
          </span>
        )}
      </NavLink>
    ))
  );

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-lg sticky top-24">
        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4 px-2">Menu Penjual</h2>
        <nav className="space-y-1">
          {renderLinks(navLinks)}
          
          <div className="pt-2 mt-2 border-t dark:border-neutral-700">
            <h3 className="px-3 py-2 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Manajemen Toko</h3>
            {renderLinks(mainToolsLinks)}
          </div>
          
          <div className="pt-2 mt-2 border-t dark:border-neutral-700">
            <h3 className="px-3 py-2 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Peningkatan</h3>
            {renderLinks(improvementLinks)}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default SellerSidebar;