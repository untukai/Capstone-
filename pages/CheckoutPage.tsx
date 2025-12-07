
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import Button from '../components/Button';
import Input from '../components/Input';
import { Order } from '../types';

const CheckoutPage: React.FC = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  // --- Fee Calculation ---
  // Biaya layanan/transaksi 2% dari total harga barang
  const serviceFee = Math.round(totalPrice * 0.02);
  const grandTotal = totalPrice + serviceFee;

  if (!isAuthenticated) {
    return (
      <div className="text-center bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-lg max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Anda Perlu Masuk</h1>
        <Link to="/login?redirect=/checkout"><Button className="mt-6">Masuk untuk Checkout</Button></Link>
      </div>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="text-center bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-lg max-w-lg mx-auto">
        <h1 className="text-2xl font-bold">Keranjang Kosong</h1>
        <Link to="/products"><Button className="mt-6">Mulai Belanja</Button></Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.phone) {
        alert("Harap isi semua informasi pengiriman.");
        return;
    }

    const newOrder: Order = {
      id: new Date().getTime().toString(),
      customerName: user?.email ?? shippingInfo.name,
      items: cartItems,
      total: grandTotal, 
      subtotal: totalPrice,
      serviceFee: serviceFee,
      date: new Date().toISOString(),
      status: 'dikemas',
      shippingAddress: shippingInfo
    };
    
    const existingOrders: Order[] = JSON.parse(localStorage.getItem('kodik-orders') || '[]');
    localStorage.setItem('kodik-orders', JSON.stringify([...existingOrders, newOrder]));

    showNotification('Pesanan Diterima!', 'Terima kasih! Pesanan Anda sedang kami proses.');
    clearCart();
    setTimeout(() => {
        navigate('/profile');
    }, 3000);
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold mb-6 dark:text-neutral-100">Checkout</h1>
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          <div className="w-full lg:w-2/3 bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 border-b dark:border-neutral-700 pb-2">Alamat Pengiriman</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Penerima</label>
                <Input name="name" value={shippingInfo.name} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alamat Lengkap</label>
                <Input name="address" value={shippingInfo.address} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nomor Telepon</label>
                <Input name="phone" value={shippingInfo.phone} onChange={handleInputChange} required />
              </div>
            </div>

            <h2 className="text-xl font-bold mt-8 mb-4 border-b dark:border-neutral-700 pb-2">Metode Pembayaran</h2>
            <label className="flex items-center border p-4 rounded-lg cursor-pointer">
                <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="h-4 w-4 text-primary" />
                <span className="ml-3 font-medium">Cash on Delivery (COD)</span>
            </label>
          </div>

          <div className="w-full lg:w-1/3">
             <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg sticky top-24">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Ringkasan Pesanan</h2>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {cartItems.map(item => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="flex-1">{item.product.name} x{item.quantity}</span>
                      <span className="font-semibold">{formatRupiah(item.price * item.quantity)}</span>
                    </div>
                ))}
              </div>
              <div className="border-t dark:border-neutral-700 my-4 pt-4 space-y-2">
                <div className="flex justify-between text-neutral-600">
                    <span>Subtotal Produk</span>
                    <span>{formatRupiah(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                    <span>Biaya Layanan (2%)</span>
                    <span>{formatRupiah(serviceFee)}</span>
                </div>
              </div>
              <div className="border-t dark:border-neutral-700 my-4 pt-2">
                <div className="flex justify-between font-bold text-lg">
                    <span>Total Bayar</span>
                    <span className="text-primary">{formatRupiah(grandTotal)}</span>
                </div>
              </div>
              <Button type="submit" className="w-full mt-4 font-bold py-3">Bayar Sekarang</Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CheckoutPage;
