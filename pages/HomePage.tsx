
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ArticleCard from '../components/ArticleCard'; // Import ArticleCard
import { products, categories, articles } from '../data/dummyData';
import Button from '../components/Button';

const HomePage: React.FC = () => {
  const featuredProducts = products.slice(0, 8);
  const latestArticles = articles.slice(0, 3); // Get latest 3 articles
  const categoryIcons: { [key: string]: string } = {
    Kuliner: '🍔', Fashion: '👕', Kerajinan: '🎨', Pertanian: '🌱', Teknologi: '💻', Jasa: '🛠️', Edukasi: '🎓',
  };

  return (
    <div className="space-y-16">
      <section className="bg-primary rounded-xl shadow-sm p-8 md:p-12 text-left" style={{backgroundImage: `linear-gradient(to right, #03AC0E, #028A0B)`}}>
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">Jelajahi Produk Lokal Karawang</h1>
          <p className="mt-4 text-lg text-white/90">Karya terbaik UMKM, dari tangan lokal untuk Anda.</p>
          <Link to="/products">
            <Button variant="secondary" className="mt-8 bg-white text-primary hover:bg-neutral-100 !font-bold !px-6 !py-3">
              Mulai Belanja
            </Button>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Kategori Pilihan</h2>
        <div className="grid grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((category) => (
            <Link key={category.id} to={`/products?category=${category.id}`} className="block p-3 sm:p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-center hover:shadow-lg hover:border-primary dark:hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
              <span className="text-3xl sm:text-4xl">{categoryIcons[category.name] || '🛍️'}</span>
              <h3 className="font-semibold mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Produk Unggulan Untukmu</h2>
          <Link to="/products">
            <Button variant='outline'>Lihat Semua</Button>
          </Link>
        </div>
        <div className="relative">
          <div className="flex space-x-4 overflow-x-auto pb-4 scroll-snap-x-mandatory scrollbar-hide">
            {featuredProducts.map((product) => (
              <div key={product.id} className="scroll-snap-center flex-shrink-0 w-40 sm:w-48 md:w-1/4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Baca Artikel Terbaru</h2>
          <Link to="/articles">
            <Button variant='outline'>Lihat Semua</Button>
          </Link>
        </div>
        <div className="relative">
          <div className="flex space-x-4 overflow-x-auto pb-4 scroll-snap-x-mandatory scrollbar-hide">
            {latestArticles.map((article) => (
              <div key={article.id} className="scroll-snap-center flex-shrink-0 w-[80vw] sm:w-2/3 md:w-1/2 lg:w-1/3">
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
