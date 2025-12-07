
import React, { useState, useMemo } from 'react';
import { influencers, categories } from '../../data/dummyData';
import { Influencer } from '../../types';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { UserIcon, UserPlusIcon } from '../../components/Icons';
import { useNotification } from '../../hooks/useNotification';

const InfluencerCard: React.FC<{ influencer: Influencer }> = ({ influencer }) => {
  const { showNotification } = useNotification();

  const handleInvite = () => {
    showNotification('Segera Hadir', `Fitur untuk mengundang ${influencer.name} akan segera tersedia.`);
  };

  const formatFollowers = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1).replace('.0', '')}rb`;
    return num.toString();
  };

  return (
    <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-lg p-4 flex flex-col items-center text-center transition-shadow hover:shadow-xl h-full">
      <div className="w-24 h-24 rounded-full bg-neutral-200 dark:bg-neutral-700 mb-3 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {influencer.profileImageUrl ? (
            <img src={influencer.profileImageUrl} alt={influencer.name} className="w-full h-full object-cover" />
        ) : (
            <UserIcon className="w-12 h-12 text-neutral-400 dark:text-neutral-500" />
        )}
      </div>
      <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-100">{influencer.name}</h3>
      <span className="text-xs font-semibold text-primary bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full my-1">{influencer.category}</span>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 my-2 flex-grow">{influencer.bio}</p>
      <div className="flex justify-center gap-4 text-sm w-full my-3 border-t dark:border-neutral-700 pt-3">
        <div>
          <p className="font-bold dark:text-neutral-100">{formatFollowers(influencer.followers.instagram)}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Instagram</p>
        </div>
        <div>
          <p className="font-bold dark:text-neutral-100">{formatFollowers(influencer.followers.tiktok)}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">TikTok</p>
        </div>
      </div>
      <Button onClick={handleInvite} className="w-full mt-auto flex items-center justify-center gap-2">
        <UserPlusIcon className="w-5 h-5" />
        Ajak Kolaborasi
      </Button>
    </div>
  );
};


const SellerCollaborationPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [followerRange, setFollowerRange] = useState('all');

    const followerRanges = {
        'all': [0, Infinity],
        '1k-10k': [1000, 10000],
        '10k-50k': [10001, 50000],
        '50k+': [50001, Infinity],
    };

    const filteredInfluencers = useMemo(() => {
        const [min, max] = followerRanges[followerRange as keyof typeof followerRanges];

        return influencers.filter(inf => {
            const totalFollowers = inf.followers.instagram + inf.followers.tiktok;
            const matchesSearch = inf.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || inf.category === selectedCategory;
            const matchesFollowers = totalFollowers >= min && totalFollowers <= max;

            return matchesSearch && matchesCategory && matchesFollowers;
        });
    }, [searchTerm, selectedCategory, followerRange]);
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Kolaborasi dengan Influencer</h1>
                <p className="text-neutral-600 dark:text-neutral-300 mt-1">Temukan influencer yang tepat untuk mempromosikan produk Anda.</p>
            </div>
            
            <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input 
                        placeholder="Cari nama influencer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white">
                        <option value="all">Semua Kategori</option>
                        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                    <select value={followerRange} onChange={e => setFollowerRange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white">
                        <option value="all">Semua Pengikut</option>
                        <option value="1k-10k">1rb - 10rb</option>
                        <option value="10k-50k">10rb - 50rb</option>
                        <option value="50k+">50rb+</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredInfluencers.length > 0 ? (
                    filteredInfluencers.map(inf => <InfluencerCard key={inf.id} influencer={inf} />)
                ) : (
                    <div className="col-span-full text-center py-12 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
                        <p className="text-neutral-500 dark:text-neutral-400">Tidak ada influencer yang cocok dengan kriteria Anda.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerCollaborationPage;