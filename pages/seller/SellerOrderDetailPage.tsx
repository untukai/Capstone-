
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orders, updateOrderStatus } from '../../data/dummyData';
import { Order } from '../../types';
import Button from '../../components/Button';
import { useNotification } from '../../hooks/useNotification';
import { MailIcon, PrinterIcon } from '../../components/Icons'; 
import Input from '../../components/Input'; 

interface ChatMessage {
  sender: 'penjual' | 'pembeli';
  text: string;
  timestamp: string;
}

const SellerOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [statusToConfirm, setStatusToConfirm] = useState<Order['status'] | null>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const foundOrder = orders.find(o => o.id === id);
    if (foundOrder) {
      setOrder(foundOrder);
      // Dummy chat history for demonstration
      setChatMessages([
        { sender: 'pembeli', text: 'Halo, Kak. Pesanan saya sudah diproses?', timestamp: '10:30' },
        { sender: 'penjual', text: 'Halo, Kak. Sudah kami terima ya pesanannya, sedang disiapkan untuk dikemas.', timestamp: '10:31' },
        { sender: 'pembeli', text: 'Baik, terima kasih infonya!', timestamp: '10:32' },
      ]);
    } else {
      showNotification("Error", "Pesanan tidak ditemukan.", "error");
      navigate('/seller/orders');
    }
  }, [id, navigate, showNotification]);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleInitiateStatusChange = (newStatus: Order['status']) => {
    setStatusToConfirm(newStatus);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (order && statusToConfirm) {
      updateOrderStatus(order.id, statusToConfirm);
      setOrder({ ...order, status: statusToConfirm });
      showNotification("Berhasil", `Status pesanan diubah menjadi "${statusToConfirm}".`);
    }
    setIsConfirmModalOpen(false);
    setStatusToConfirm(null);
  };
  
  const handleCancelStatusChange = () => {
    setIsConfirmModalOpen(false);
    setStatusToConfirm(null);
  };
  
  const handlePrintReceipt = () => {
      showNotification("Info", "Fitur cetak resi sedang disiapkan!");
      // In a real app, this would trigger window.print() or generate a PDF.
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    const message: ChatMessage = {
      sender: 'penjual',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusChipClass = (status: Order['status']) => {
    switch (status) {
      case 'menunggu pembayaran': return 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300';
      case 'dikemas': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300';
      case 'dikirim': return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300';
      case 'selesai': return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300';
      default: return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300';
    }
  };

  if (!order) {
    return (
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg text-center">
            Memuat detail pesanan...
        </div>
    );
  }

  const orderStatusSteps: Order['status'][] = ['dikemas', 'dikirim', 'selesai'];
  const nextStatus = orderStatusSteps[orderStatusSteps.indexOf(order.status) + 1];

  return (
    <>
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 border-b dark:border-neutral-700 pb-4 gap-3">
          <div>
              <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Detail Pesanan #{order.id}</h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Tanggal: {formatDate(order.date)} · Pelanggan: {order.customerName}
              </p>
          </div>
          <Link to="/seller/orders">
            <Button variant="outline">&larr; Kembali ke Daftar Pesanan</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Items */}
          <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">Barang Pesanan</h3>
              {order.items.map(item => {
                  const unitPrice = item.product.discount
                    ? item.product.price * (1 - item.product.discount / 100)
                    : item.product.price;
                  const subtotal = unitPrice * item.quantity;
                  
                  return (
                    <div key={item.product.id} className="flex items-center gap-4 p-3 border dark:border-neutral-700 rounded-lg">
                        <img src={item.product.imageUrls[0]} alt={item.product.name} className="w-16 h-16 bg-neutral-200 dark:bg-neutral-700 rounded-md object-cover flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold text-neutral-800 dark:text-neutral-100">{item.product.name}</p>
                            <div className="text-sm text-neutral-600 dark:text-neutral-300 mt-1 flex items-center gap-1">
                              <span>{item.quantity} x</span>
                              {item.product.discount ? (
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-semibold text-primary">{formatRupiah(unitPrice)}</span>
                                  <span className="text-xs text-neutral-500 dark:text-neutral-400 line-through">{formatRupiah(item.product.price)}</span>
                                </div>
                              ) : (
                                <span className="font-semibold">{formatRupiah(unitPrice)}</span>
                              )}
                            </div>
                        </div>
                        <p className="font-bold text-neutral-800 dark:text-neutral-100 text-right">{formatRupiah(subtotal)}</p>
                    </div>
                  );
              })}
          </div>
          
          {/* Right Column: Summary, Shipping & Chat */}
          <div className="space-y-6">
              <div>
                  <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-2">Ringkasan</h3>
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                          <span className="text-neutral-600 dark:text-neutral-300">Status</span>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${getStatusChipClass(order.status)}`}>
                              {order.status}
                          </span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold pt-2 border-t dark:border-neutral-700 mt-2">
                          <span className="text-neutral-800 dark:text-neutral-100">Total</span>
                          <span className="text-primary">{formatRupiah(order.total)}</span>
                      </div>
                  </div>
              </div>

              <div>
                  <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-2">Alamat Pengiriman</h3>
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg text-sm text-neutral-700 dark:text-neutral-200 space-y-1">
                      <p className="font-semibold">{order.shippingAddress.name}</p>
                      <p>{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.phone}</p>
                  </div>
              </div>

              {order.status !== 'selesai' && order.status !== 'menunggu pembayaran' && (
                <div>
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-2">Aksi Pesanan</h3>
                    <div className="space-y-2">
                      {nextStatus ? (
                        <Button 
                            className="w-full !font-bold"
                            onClick={() => handleInitiateStatusChange(nextStatus)}
                        >
                            Ubah Status ke "{nextStatus}"
                        </Button>
                      ) : (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">Pesanan sudah selesai.</p>
                      )}
                      <Button 
                          variant="outline"
                          className="w-full !font-bold flex items-center justify-center gap-2"
                          onClick={handlePrintReceipt}
                      >
                          <PrinterIcon className="w-5 h-5" />
                          Cetak Resi
                      </Button>
                    </div>
                </div>
              )}
              
              {/* Chat with Buyer Section */}
              <div className="border dark:border-neutral-700 rounded-lg overflow-hidden flex flex-col h-96">
                <div className="flex items-center gap-3 p-3 border-b dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700/50">
                    <MailIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">Chat dengan {order.customerName}</h3>
                </div>
                <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-white dark:bg-neutral-800">
                    {chatMessages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'penjual' ? 'justify-end' : 'justify-start'}`}>
                       {msg.sender === 'pembeli' && <div className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-600 flex-shrink-0"></div>}
                        <div className={`max-w-md rounded-lg px-3 py-2 ${msg.sender === 'penjual' ? 'bg-primary text-white rounded-br-none' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 rounded-bl-none'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.sender === 'penjual' ? 'text-white/70 text-right' : 'text-neutral-500 dark:text-neutral-400 text-left'}`}>{msg.timestamp}</p>
                        </div>
                    </div>
                ))}
                    <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-3 border-t dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700/50 flex items-center gap-2">
                    <Input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Ketik pesan..." 
                        className="flex-1"
                        autoComplete="off"
                    />
                    <Button type="submit" className="flex-shrink-0">Kirim</Button>
                </form>
              </div>

          </div>
        </div>
      </div>
      
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in-overlay" onClick={handleCancelStatusChange}>
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 w-full max-w-sm text-center animate-popup-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">Konfirmasi Perubahan Status</h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-6">
              Apakah Anda yakin ingin mengubah status pesanan ini menjadi <strong className="capitalize">{statusToConfirm}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={handleCancelStatusChange}>
                Batal
              </Button>
              <Button onClick={handleConfirmStatusChange}>
                Ya, Ubah Status
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerOrderDetailPage;
