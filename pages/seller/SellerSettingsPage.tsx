
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { sellers, updateSellerDetails } from '../../data/dummyData';
import { Seller } from '../../types';
import Button from '../../components/Button';
import Input from '../../components/Input';

const SellerSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    const currentSeller = sellers.find(s => s.email === user?.email);
    if (currentSeller) {
      setSeller(currentSeller);
      setFormData({
        name: currentSeller.name,
        description: currentSeller.description,
        phone: currentSeller.phone || '',
        email: currentSeller.email || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSave = () => {
    if (seller) {
      updateSellerDetails(seller.id, formData);
      showNotification('Berhasil', 'Informasi toko berhasil diperbarui.');
    }
    setIsConfirmModalOpen(false);
  };

  if (!seller) {
    return <div>Memuat data toko...</div>;
  }

  return (
    <>
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-6 border-b dark:border-neutral-700 pb-4">Pengaturan Toko</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">Nama Toko</label>
            <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">Deskripsi Toko</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">Nomor Telepon</label>
              <Input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">Email</label>
              <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1" />
            </div>
          </div>
          <div className="text-right pt-4 border-t dark:border-neutral-700">
            <Button type="submit">Simpan Perubahan</Button>
          </div>
        </form>
      </div>

      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in-overlay" onClick={() => setIsConfirmModalOpen(false)}>
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 w-full max-w-sm text-center animate-popup-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">Konfirmasi Perubahan</h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-6">
              Apakah Anda yakin ingin menyimpan perubahan pada informasi toko Anda?
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleConfirmSave}>
                Ya, Simpan
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerSettingsPage;
