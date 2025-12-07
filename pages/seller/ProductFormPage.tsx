
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Product } from '../../types';
import { products, sellers, categories, addProduct } from '../../data/dummyData';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { PhotoIcon } from '../../components/Icons';

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const isEditing = Boolean(id);
  const imageUrlRef = useRef<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: categories[0]?.name || '',
    description: '',
    stock: '',
    imageUrls: '',
    type: 'Produk Fisik' as Product['type'],
  });

  // Efek untuk membersihkan object URL saat komponen dilepas untuk mencegah kebocoran memori
  useEffect(() => {
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isEditing) {
      const productToEdit = products.find(p => p.id === parseInt(id));
      if (productToEdit) {
        setFormData({
            name: productToEdit.name,
            price: String(productToEdit.price),
            category: productToEdit.category,
            description: productToEdit.description,
            stock: String(productToEdit.stock),
            imageUrls: productToEdit.imageUrls[0],
            type: productToEdit.type,
        });
      } else {
        showNotification("Error", "Produk tidak ditemukan.", "error");
        navigate('/seller/products');
      }
    }
  }, [id, isEditing, navigate, showNotification]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as Product['type'] }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Hapus object URL lama jika ada
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
      // Buat object URL baru untuk pratinjau
      const newImageUrl = URL.createObjectURL(file);
      imageUrlRef.current = newImageUrl;
      setFormData(prev => ({ ...prev, imageUrls: newImageUrl }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrls) {
      showNotification("Error", "Harap unggah gambar produk.", "error");
      return;
    }

    const currentSeller = sellers.find(s => s.email === user?.email);
    if (!currentSeller) {
        showNotification("Error", "Tidak dapat menemukan data penjual. Silakan login ulang.", "error");
        return;
    }

    const submittedProductData = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        stock: parseInt(formData.stock, 10),
        sellerId: currentSeller.id,
        imageUrls: [formData.imageUrls],
        type: formData.type,
    };
    
    if (isEditing) {
      const productIndex = products.findIndex(p => p.id === parseInt(id!));
      if (productIndex !== -1) {
          const originalProduct = products[productIndex];
          // Gabungkan data asli dengan data baru, tetapi pastikan ID tetap
          products[productIndex] = { ...originalProduct, ...submittedProductData, id: parseInt(id!) };
      }
      showNotification("Berhasil", `'${submittedProductData.name}' berhasil diperbarui.`);
    } else {
      addProduct(submittedProductData);
      showNotification("Berhasil", `'${submittedProductData.name}' berhasil ditambahkan.`);
    }

    // Lepaskan object URL dari manajemen komponen ini agar tidak dihapus saat unmount
    if (formData.imageUrls.startsWith('blob:')) {
      imageUrlRef.current = null;
    }

    navigate('/seller/products');
  };

  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 border-b dark:border-neutral-700 pb-4 text-neutral-800 dark:text-neutral-100">
        {isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">Nama Produk</label>
          <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">Harga</label>
                <Input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required className="mt-1" placeholder="Contoh: 50000" />
            </div>
            <div>
                <label htmlFor="stock" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">Stok</label>
                <Input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} required className="mt-1" placeholder="Contoh: 100" />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">Kategori</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white">
                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">Tipe Produk</label>
                <select id="type" name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white">
                    <option value="Produk Fisik">Produk Fisik</option>
                    <option value="Produk Digital">Produk Digital</option>
                    <option value="Jasa">Jasa</option>
                </select>
            </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">Deskripsi</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"></textarea>
        </div>
        
         <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">Gambar Utama Produk</label>
            <div className="mt-2 flex items-center gap-5">
              <div className="w-24 h-24 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center overflow-hidden border dark:border-neutral-600">
                {formData.imageUrls ? (
                  <img src={formData.imageUrls} alt="Pratinjau Produk" className="w-full h-full object-cover" />
                ) : (
                  <PhotoIcon className="w-12 h-12 text-neutral-400" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/gif"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="inline-block px-4 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-transparent border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary dark:text-primary dark:border-primary dark:hover:bg-primary dark:hover:text-white">
                    Unggah Gambar
                  </span>
                </label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">Pilih gambar untuk produk Anda.</p>
              </div>
            </div>
        </div>


        <div className="flex justify-end gap-4 pt-4 border-t dark:border-neutral-700">
          <Button type="button" variant="outline" onClick={() => navigate('/seller/products')}>
            Batal
          </Button>
          <Button type="submit">
            {isEditing ? 'Simpan Perubahan' : 'Simpan Produk'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
