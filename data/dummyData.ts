

import { Product, Category, Article, Seller, Review, Order, Post, LiveSession, VirtualGift, Conversation, ChatMessage, FinancialTransaction, Promotion, Comment, Influencer } from '../types';

export const categories: Category[] = [
  { id: 'kuliner', name: 'Kuliner' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'kerajinan', name: 'Kerajinan' },
  { id: 'pertanian', name: 'Pertanian' },
  { id: 'teknologi', name: 'Teknologi' },
  { id: 'jasa', name: 'Jasa' },
  { id: 'edukasi', name: 'Edukasi' },
];

export const sellers: Seller[] = [
  {
    id: 1,
    name: 'Dapur Emak',
    description: 'Menyediakan aneka kue basah dan jajanan pasar khas Karawang. Dibuat dengan resep turun temurun.',
    rating: 4.8,
    phone: '081234567890',
    email: 'penjual@example.com', // Demo seller email
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=400&h=400&fit=crop',
  },
  {
    id: 2,
    name: 'Batik Karawang',
    description: 'Pengrajin batik tulis dan cap dengan motif padi dan lumbung padi khas Karawang.',
    rating: 4.9,
    phone: '081345678901',
    email: 'batik.krw@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1628140411132-8418520379c3?w=400&h=400&fit=crop',
  },
  {
    id: 3,
    name: 'Distro Karawang',
    description: 'Kaos dan merchandise kekinian dengan desain tema lokal Karawang.',
    rating: 4.7,
    phone: '081456789012',
    email: 'distro.krw@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop',
  },
   {
    id: 4,
    name: 'Tani Makmur',
    description: 'Menjual hasil pertanian organik dan pupuk berkualitas dari petani lokal.',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=400&h=400&fit=crop'
  },
  {
    id: 5,
    name: 'Tech Tani',
    description: 'Solusi IoT dan alat teknologi tepat guna untuk pertanian modern.',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a783?w=400&h=400&fit=crop'
  }
];

export const products: Product[] = [
  {
    id: 1,
    sellerId: 1,
    category: 'Kuliner',
    name: 'Serabi Hijau Khas Karawang',
    description: 'Serabi hijau dengan kuah kinca durian asli. Manis, gurih, dan legit.',
    price: 15000,
    stock: 50,
    status: 'aktif',
    type: 'Produk Fisik',
    imageUrls: ['https://i.ibb.co.com/Cp38p5cT/image.png'],
  },
  {
    id: 2,
    sellerId: 2,
    category: 'Fashion',
    name: 'Batik Karawang Motif Padi',
    description: 'Kain batik tulis bahan katun primisima dengan motif padi menguning.',
    price: 250000,
    stock: 10,
    discount: 10,
    status: 'aktif',
    type: 'Produk Fisik',
    imageUrls: ['https://i.ibb.co.com/qYqRScSF/image.png'],
  },
  {
    id: 3,
    sellerId: 3,
    category: 'Fashion',
    name: 'Kaos Lokal "Karawang Pride"',
    description: 'Kaos cotton combed 30s dengan sablon plastisol desain tipografi Karawang.',
    price: 85000,
    stock: 100,
    status: 'aktif',
    type: 'Produk Fisik',
    imageUrls: ['https://i.ibb.co.com/KpB4kJZF/image.png'],
  },
  {
    id: 4,
    sellerId: 1,
    category: 'Kuliner',
    name: 'Dodol Karawang Premium',
    description: 'Dodol ketan asli dengan rasa original, wijen, dan durian.',
    price: 35000,
    stock: 25,
    status: 'aktif',
    type: 'Produk Fisik',
    imageUrls: ['https://i.ibb.co.com/fzRJqFTb/image.png'],
  },
  {
    id: 5,
    sellerId: 2,
    category: 'Kerajinan',
    name: 'Anyaman Bambu Hias',
    description: 'Tas anyaman bambu handmade, cocok untuk belanja atau souvenir.',
    price: 45000,
    stock: 0, // Out of stock
    status: 'habis stok',
    type: 'Produk Fisik',
    imageUrls: ['https://i.ibb.co.com/TxPPJZhv/image.png'],
  },
   {
    id: 6,
    sellerId: 2,
    category: 'Kerajinan',
    name: 'Gerabah Artistik',
    description: 'Vas bunga dari tanah liat dengan ukiran tangan.',
    price: 60000,
    stock: 15,
    status: 'aktif',
    type: 'Produk Fisik',
    imageUrls: ['https://i.ibb.co.com/CpRcPQsF/image.png'],
  },
  {
    id: 7,
    sellerId: 4,
    category: 'Pertanian',
    name: 'Beras Pandan Wangi Organik',
    description: 'Beras asli Karawang tanpa pestisida, wangi alami dan pulen.',
    price: 95000,
    stock: 200,
    status: 'aktif',
    type: 'Produk Fisik',
    imageUrls: ['https://i.ibb.co.com/Lz1tsx6w/image.png'],
  },
  {
    id: 8,
    sellerId: 4,
    category: 'Pertanian',
    name: 'Pupuk Cair Organik Super',
    description: 'Menyuburkan tanaman dan memperbaiki unsur hara tanah.',
    price: 40000,
    stock: 50,
    status: 'aktif',
    type: 'Produk Fisik',
    imageUrls: ['https://i.ibb.co.com/CpwxXY0x/image.png'],
  },
  {
    id: 9,
    sellerId: 5,
    category: 'Teknologi',
    name: 'IoT Sawah Pintar Kit',
    description: 'Alat monitoring kelembaban tanah dan cuaca berbasis IoT.',
    price: 1500000,
    stock: 5,
    status: 'aktif',
    type: 'Produk Fisik',
    imageUrls: ['https://i.ibb.co.com/9H8XG6Pm/image.png'],
  }
];

export const articles: Article[] = [
  {
    id: 1,
    title: '5 Kuliner Legendaris Karawang yang Wajib Dicoba',
    summary: 'Dari Sorabi Hijau hingga Soto Tangkar, inilah deretan kuliner yang menggoyang lidah.',
    content: 'Karawang tidak hanya dikenal sebagai lumbung padi, tetapi juga surga kuliner...',
    author: 'Budi Santoso',
    publishDate: '2023-10-15',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'Mengenal Batik Khas Karawang: Goresan Canting Penuh Makna dan Sejarah',
    summary: 'Menelusuri sejarah dan filosofi di balik motif-motif batik khas Karawang yang kaya akan nilai budaya.',
    content: 'Batik Karawang memiliki ciri khas motif yang berhubungan dengan padi dan lumbung, melambangkan kemakmuran...',
    author: 'Siti Aminah',
    publishDate: '2023-09-28',
    imageUrl: 'https://i.ibb.co.com/1JLhFwZq/image.png',
  },
  {
    id: 3,
    title: 'Kisah Sukses UMKM: Dari Dapur Rumah ke Pasar Nasional',
    summary: 'Inspirasi dari Bu Ani yang sukses memasarkan keripik singkongnya hingga ke luar pulau.',
    content: 'Berawal dari modal seadanya, Bu Ani kini mempekerjakan 20 tetangganya...',
    author: 'Rina Marlina',
    publishDate: '2023-11-05',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop',
  }
];

// Data untuk review
export const reviews: Review[] = [
  { id: 1, productId: 1, userId: 101, userName: 'Budi S.', userEmail: 'budi@test.com', rating: 5, comment: 'Enak banget serabinya, kuahnya legit!', date: '2023-10-25T10:00:00Z' },
  { id: 2, productId: 1, userId: 102, userName: 'Siti A.', userEmail: 'siti@test.com', rating: 4, comment: 'Rasanya pas, pengiriman cepat.', date: '2023-10-26T14:30:00Z' },
  { id: 3, productId: 2, userId: 103, userName: 'Rina M.', userEmail: 'rina@test.com', rating: 5, comment: 'Batiknya halus, motifnya detail.', date: '2023-10-27T09:15:00Z' },
];

export const orders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Ahmad Yani',
    items: [
      { product: products[0], quantity: 2 }, // 2 Serabi
      { product: products[3], quantity: 1 }  // 1 Dodol
    ],
    total: 66300,
    subtotal: 65000,
    serviceFee: 1300,
    status: 'selesai',
    date: '2023-10-20T08:00:00Z',
    shippingAddress: {
      name: 'Ahmad Yani',
      address: 'Jl. Tuparev No. 123, Karawang',
      phone: '08123456789'
    }
  },
  {
    id: 'ORD-002',
    customerName: 'Budi Santoso', // Logged in user example
    items: [
      { product: products[2], quantity: 1 } // 1 Kaos
    ],
    total: 86700,
    subtotal: 85000,
    serviceFee: 1700,
    status: 'dikirim',
    date: '2023-10-25T13:45:00Z',
    shippingAddress: {
      name: 'Budi Santoso',
      address: 'Perumahan Galuh Mas Blok A, Karawang',
      phone: '08987654321'
    }
  },
   {
    id: 'ORD-003',
    customerName: 'pembeli@example.com', // Matches login email
    items: [
      { product: products[0], quantity: 5 }
    ],
    total: 76500,
    subtotal: 75000,
    serviceFee: 1500,
    status: 'dikemas',
    date: '2023-10-28T09:30:00Z',
    shippingAddress: {
      name: 'Pembeli Setia',
      address: 'Jl. Kertabumi No. 88',
      phone: '08567890123'
    }
  }
];

export const liveSessions: LiveSession[] = [
    {
        id: 1,
        sellerId: 1,
        title: "Pesta Jajanan Pasar: Diskon Kilat!",
        status: "live",
        thumbnailUrl: "https://i.ibb.co.com/Cp38p5cT/image.png",
        productIds: [1, 4],
        likes: 1240,
        viewers: 350
    },
    {
        id: 2,
        sellerId: 2,
        title: "Proses Membatik Langsung dari Studio",
        status: "replay",
        thumbnailUrl: "https://i.ibb.co.com/qYqRScSF/image.png",
        productIds: [2, 5, 6],
        likes: 850,
        viewers: 0
    },
     {
        id: 3,
        sellerId: 3,
        title: "Review Koleksi Kaos Terbaru",
        status: "replay",
        thumbnailUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop",
        productIds: [3],
        likes: 500,
        viewers: 0
    }
];

export const posts: Post[] = [
    {
        id: 1,
        sellerId: 1,
        content: 'Baru mateng nih! Serabi hijau kuah kinca durian. Siapa mau? Langsung order ya kak sebelum kehabisan 🤤 #kulinertradisional #karawang',
        mediaUrl: 'https://i.ibb.co.com/Cp38p5cT/image.png',
        mediaType: 'image',
        timestamp: '2023-10-28T08:00:00Z',
        likes: 24,
        comments: [
             { id: 101, userName: 'Susi', userEmail: 'susi@mail.com', text: 'Ongkir ke Telukjambe berapa teh?' }
        ]
    },
    {
        id: 2,
        sellerId: 4, // Tani Makmur
        content: '🍚 BERAS PANDAN WANGI ORGANIK ASLI KARAWANG! 🍚\n\nIbu-ibu bingung cari beras yang pulen, wangi, dan sehat buat keluarga? 🤔\n\nCobain deh Beras Pandan Wangi Organik dari Tani Makmur! Ditanam langsung sama petani lokal kita tanpa pestisida, jadi 100% aman dan alami. Rasanya? Wah, jangan ditanya! Wanginya bikin laper, pulennya bikin nambah terus! 😋\n\n✅ Bebas Kimia\n✅ Wangi Alami\n✅ Dukung Petani Lokal\n\nYuk, ganti beras di rumah sama yang lebih sehat! Stok terbatas lho, langsung klik keranjang kuning atau DM ya! 🌾📦 #BerasSehat #PandanWangi #KarawangPunya',
        mediaUrl: 'https://i.ibb.co.com/zTx7y56M/image.png',
        mediaType: 'image',
        timestamp: '2023-10-27T10:30:00Z',
        likes: 56,
        comments: []
    },
    {
        id: 3,
        sellerId: 3,
        content: 'Kaos "Karawang Pride" restock lagi nih! Bahan combad 30s adem, sablon plastisol awet. Sikat sebelum kehabisan!',
        mediaUrl: 'https://i.ibb.co.com/KpB4kJZF/image.png',
        mediaType: 'image',
        timestamp: '2023-10-26T14:15:00Z',
        likes: 45,
        comments: [
            { id: 102, userName: 'Rudi', userEmail: 'rudi@mail.com', text: 'Ada warna hitam ga bang?' },
            { id: 103, parentId: 102, userName: 'Distro Karawang', userEmail: 'distro.krw@example.com', text: 'Ada bang, cek katalog ya.' }
        ]
    }
];

export const conversations: Conversation[] = [
    {
        id: 1,
        customerId: 101,
        customerName: 'Budi Santoso',
        lastMessage: 'Barangnya ready stok gan?',
        timestamp: '10:30',
        unreadCount: 2,
        messages: [
            { sender: 'pembeli', text: 'Halo gan', timestamp: '10:28' },
            { sender: 'pembeli', text: 'Barangnya ready stok gan?', timestamp: '10:30' }
        ]
    },
    {
        id: 2,
        customerId: 102,
        customerName: 'Siti Aminah',
        lastMessage: 'Terima kasih kak, sudah sampai.',
        timestamp: 'Kemarin',
        unreadCount: 0,
        messages: [
            { sender: 'penjual', text: 'Sudah dikirim ya kak', timestamp: '09:00' },
            { sender: 'pembeli', text: 'Terima kasih kak, sudah sampai.', timestamp: '15:00' }
        ]
    }
];

export const financialTransactions: FinancialTransaction[] = [
    { id: 'TRX-001', date: '2023-10-25', type: 'Pendapatan', description: 'Pendapatan dari pesanan #ORD-001', amount: 65000, status: 'Selesai', isCredit: true },
    { id: 'TRX-002', date: '2023-10-26', type: 'Penarikan Saldo', description: 'Pencairan ke Bank BCA', amount: -50000, status: 'Selesai', isCredit: false },
    { id: 'TRX-003', date: '2023-10-28', type: 'Pendapatan', description: 'Pendapatan dari pesanan #ORD-003', amount: 75000, status: 'Tertunda', isCredit: true },
];

export const promotions: Promotion[] = [
    { id: 1, sellerId: 1, type: 'Voucher', title: 'Diskon Awal Bulan', code: 'SERABI10', discountType: 'persen', discountValue: 10, minPurchase: 50000, startDate: '2023-11-01', endDate: '2023-11-05', status: 'Akan Datang' },
    { id: 2, sellerId: 1, type: 'Diskon Produk', title: 'Cuci Gudang', discountType: 'nominal', discountValue: 5000, minPurchase: 0, startDate: '2023-10-01', endDate: '2023-10-31', status: 'Aktif' },
];

export const influencers: Influencer[] = [
    { id: 1, name: 'Neng Geulis', category: 'Kuliner', followers: { instagram: 15000, tiktok: 25000 }, bio: 'Hobby makan dan review jajanan pasar Karawang.', profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop' },
    { id: 2, name: 'Kang Asep', category: 'Fashion', followers: { instagram: 8000, tiktok: 5000 }, bio: 'OOTD lokal pride, cinta produk dalam negeri.', profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
    { id: 3, name: 'Tani Milenial', category: 'Pertanian', followers: { instagram: 12000, tiktok: 40000 }, bio: 'Edukasi pertanian modern untuk anak muda.', profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' },
];

export const virtualGifts: VirtualGift[] = [
    { id: 1, name: 'Kopi', icon: '☕', price: 10 },
    { id: 2, name: 'Bunga', icon: '🌹', price: 25 },
    { id: 3, name: 'Nasi Tumpeng', icon: '🍚', price: 100 },
    { id: 4, name: 'Traktor', icon: '🚜', price: 500 },
];

// Helper functions to simulate database operations
export const addPost = (post: Omit<Post, 'id' | 'likes' | 'comments' | 'timestamp'>) => {
    const newPost: Post = {
        id: posts.length + 1,
        ...post,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: []
    };
    posts.unshift(newPost); // Add to beginning
    return newPost;
};

export const addComment = (postId: number, comment: Omit<Comment, 'id'>) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
        const newComment: Comment = {
            id: Math.floor(Math.random() * 10000), // Random ID
            ...comment
        };
        post.comments.push(newComment);
        return newComment;
    }
    return null;
};

export const addMessageToConversation = (conversationId: number, message: ChatMessage) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
        conversation.messages.push(message);
        conversation.lastMessage = message.text;
        conversation.timestamp = message.timestamp;
        if (message.sender === 'pembeli') {
            conversation.unreadCount += 1;
        }
    }
};

export const addProduct = (product: Omit<Product, 'id' | 'status'>) => {
    const newProduct: Product = {
        id: products.length + 1,
        status: 'aktif',
        ...product
    };
    products.push(newProduct);
    return newProduct;
}

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
    }
}

export const updateSellerDetails = (sellerId: number, details: Partial<Seller>) => {
    const sellerIndex = sellers.findIndex(s => s.id === sellerId);
    if (sellerIndex !== -1) {
        sellers[sellerIndex] = { ...sellers[sellerIndex], ...details };
    }
}

export const addPromotion = (promotion: Omit<Promotion, 'id'>) => {
    const newPromotion: Promotion = {
        id: promotions.length + 1,
        ...promotion
    };
    promotions.push(newPromotion);
    return newPromotion;
}

export const addLiveSession = (session: Omit<LiveSession, 'id' | 'status' | 'likes' | 'viewers'>) => {
    const newSession: LiveSession = {
        id: liveSessions.length + 1,
        status: 'live',
        likes: 0,
        viewers: 0,
        ...session
    };
    liveSessions.unshift(newSession);
    return newSession;
}

export const endLiveSession = (sessionId: number) => {
    const session = liveSessions.find(s => s.id === sessionId);
    if (session) {
        session.status = 'replay';
    }
}