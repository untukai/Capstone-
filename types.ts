
// types.ts (Improved for Backend Architecture)

export type UserRole = 'pembeli' | 'penjual' | 'admin';
export type ProductStatus = 'aktif' | 'habis stok' | 'nonaktif' | 'draft' | 'archived';
export type OrderStatus = 'menunggu pembayaran' | 'dikemas' | 'dikirim' | 'selesai' | 'dibatalkan';
export type ProductType = 'Produk Fisik' | 'Produk Digital' | 'Jasa';

// --- Core Entities ---

export interface User {
  id: number;
  email: string;
  role: UserRole;
  createdAt: string; // ISO 8601
  walletBalance: number; // Saldo KODIK (Real Money)
  coins: number; // Virtual Coins for gifting
  giftBalance: number; // Pendapatan dari Live Gift (belum ditarik ke wallet)
}

export interface Seller {
  id: number;
  name: string;
  description: string;
  rating: number;
  phone?: string;
  email?: string;
  imageUrl?: string;
}

export interface Category {
  id: string; // e.g., 'kuliner'
  name: string;
  parentId?: string | null; // For nested categories
}

export interface Product {
  id: number;
  sellerId: number;
  category: string; 
  name:string;
  description: string;
  status: ProductStatus;
  type: ProductType;
  price: number;
  stock: number;
  discount?: number;
  imageUrls: string[];
}

// --- Transactional Entities ---

export interface CartItem {
  productId: number;
  quantity: number;
  product: Product;
  imageUrls: string[];
  price: number;
  discount?: number;
}

export interface Order {
  id: string;
  customerName: string; 
  items: { product: Product, quantity: number }[]; 
  total: number; // Total bayar (termasuk biaya layanan)
  subtotal: number; // Harga barang saja
  serviceFee: number; // Biaya layanan 2%
  date: string; // ISO 8601
  status: OrderStatus;
  shippingAddress: {
    name: string;
    address: string;
    phone: string;
  };
}

// --- Content & Engagement Entities ---

export interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: string; // ISO 8601
  imageUrl: string;
}

export interface Review {
  id: number;
  productId: number;
  userId: number; 
  userName: string; 
  userEmail: string; 
  rating: number; // 1 to 5
  comment: string;
  date: string; // ISO 8601
}

export interface Post {
  id: number;
  sellerId: number;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  timestamp: string; // ISO 8601
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: number;
  parentId?: number | null;
  userName: string;
  userEmail: string; 
  text: string;
}

export interface LiveSession {
  id: number;
  sellerId: number;
  title: string;
  status: 'live' | 'replay';
  thumbnailUrl: string;
  productIds: number[];
  likes?: number;
  viewers?: number;
}

// --- Seller Specific & Other ---

export interface ChatMessage {
  sender: 'penjual' | 'pembeli';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: number;
  customerId: number;
  customerName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface Promotion {
  id: number;
  sellerId: number;
  type: 'Voucher' | 'Diskon Produk';
  code?: string;
  title: string;
  discountValue: number;
  discountType: 'persen' | 'nominal';
  minPurchase: number;
  startDate: string;
  endDate: string;
  status: 'Aktif' | 'Kadaluarsa' | 'Akan Datang';
}

export interface Influencer {
  id: number;
  name: string;
  category: string;
  followers: {
    instagram: number;
    tiktok: number;
  };
  bio: string;
  profileImageUrl?: string;
}

export interface VirtualGift {
  id: number;
  name: string;
  icon: string;
  price: number; // in coins
}

export interface LiveChatMessage {
  id: number;
  userName: string;
  text: string;
  isGift?: boolean;
  giftIcon?: string;
}

// Updated Financial Transaction for detailed history
export interface FinancialTransaction {
  id: string;
  date: string;
  type: 'Top Up' | 'Penarikan Saldo' | 'Beli Koin' | 'Tukar Koin' | 'Pembayaran' | 'Pendapatan';
  description: string;
  amount: number; // Nominal transaksi utama
  fee?: number;   // Biaya admin
  method?: string; // Metode pembayaran (BCA, GoPay, dll)
  status: 'Selesai' | 'Gagal' | 'Tertunda';
  isCredit: boolean; // true = uang masuk, false = uang keluar
}
