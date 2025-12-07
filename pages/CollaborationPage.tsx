
import React from 'react';
import { UserIcon, MailIcon, LinkedInIcon, TwitterIcon } from '../components/Icons';

const helixData = [
  { name: 'Akademisi', role: 'Penelitian, inovasi, dan pelatihan untuk meningkatkan kapasitas UMKM.' },
  { name: 'Pemerintah', role: 'Dukungan regulasi, perizinan, dan program pendampingan untuk menciptakan ekosistem yang kondusif.' },
  { name: 'Bisnis', role: 'Pendanaan, investasi, kemitraan strategis, dan akses pasar yang lebih luas.' },
  { name: 'Komunitas & Media', role: 'Promosi, advokasi, dan penyebaran informasi untuk membangun jaringan dan meningkatkan visibilitas UMKM.' },
  { name: 'Lingkungan', role: 'Mendorong praktik bisnis berkelanjutan dan penggunaan bahan baku ramah lingkungan untuk UMKM yang lebih hijau.' },
];

const founders = [
    { name: 'Surya Agung Perkasa', image: 'https://i.ibb.co.com/YFcgMVsw/Screenshot-2025-12-07-170359.png', contact: { email: '#', linkedin: '#', twitter: '#' } }
];


const CollaborationPage: React.FC = () => {
  return (
    <div className="space-y-16">
      <div className="bg-white dark:bg-neutral-800 p-6 md:p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-4 text-neutral-800 dark:text-neutral-100">Kolaborasi Quintuple Helix</h1>
        <p className="text-center text-neutral-600 dark:text-neutral-300 mb-10 max-w-3xl mx-auto">
          KODIK dibangun atas dasar sinergi lima pilar utama untuk memajukan ekosistem UMKM di Karawang.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helixData.map(item => (
            <div key={item.name} className="border border-primary/20 dark:border-primary/40 p-6 rounded-lg bg-primary/5 dark:bg-primary/10 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold text-primary-dark dark:text-primary">{item.name}</h2>
              <p className="text-neutral-700 dark:text-neutral-200 mt-3 leading-relaxed">{item.role}</p>
            </div>
          ))}
        </div>
      </div>

       <div className="bg-white dark:bg-neutral-800 p-6 md:p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-4 text-neutral-800 dark:text-neutral-100">Tentang Kami</h1>
            <p className="text-center text-neutral-600 dark:text-neutral-300 mb-10 max-w-3xl mx-auto">
              KODIK (Karawang Online Digital Inovasi Karya) adalah inisiatif digital yang lahir dari semangat kolaborasi untuk memberdayakan Usaha Mikro, Kecil, dan Menengah (UMKM) di Karawang. Kami percaya bahwa teknologi adalah jembatan untuk menghubungkan karya lokal dengan pasar yang lebih luas, menciptakan ekosistem ekonomi yang kuat dan mandiri.
            </p>

            <h2 className="text-2xl font-bold text-center mb-8 text-neutral-800 dark:text-neutral-100">Tim Pendiri</h2>
            <div className="flex justify-center flex-wrap gap-8">
              {founders.map(founder => (
                <div key={founder.name} className="flex flex-col items-center text-center max-w-xs">
                  <div className="w-32 h-32 rounded-full bg-neutral-200 dark:bg-neutral-700 mb-4 flex items-center justify-center overflow-hidden border-4 border-white dark:border-neutral-600 shadow-md">
                    {founder.image ? (
                        <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                    ) : (
                        <UserIcon className="w-16 h-16 text-neutral-400 dark:text-neutral-500" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">{founder.name}</h3>
                  <div className="flex items-center gap-4 mt-3">
                    <a href={founder.contact.email} className="text-neutral-500 dark:text-neutral-400 hover:text-primary transition-colors" aria-label={`Email ${founder.name}`}>
                      <MailIcon className="w-6 h-6" />
                    </a>
                    <a href={founder.contact.linkedin} className="text-neutral-500 dark:text-neutral-400 hover:text-primary transition-colors" aria-label={`LinkedIn ${founder.name}`}>
                      <LinkedInIcon className="w-6 h-6" />
                    </a>
                    <a href={founder.contact.twitter} className="text-neutral-500 dark:text-neutral-400 hover:text-primary transition-colors" aria-label={`Twitter ${founder.name}`}>
                      <TwitterIcon className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
        </div>

    </div>
  );
};

export default CollaborationPage;
