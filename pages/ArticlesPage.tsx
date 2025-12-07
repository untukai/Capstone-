
import React, { useState } from 'react';
import { Article } from '../types';
import { articles as initialArticles } from '../data/dummyData';
import ArticleCard from '../components/ArticleCard';

const ArticlesPage: React.FC = () => {
  const [articles] = useState<Article[]>(initialArticles);
  
  return (
    <div className="space-y-10">
      <div className="bg-white dark:bg-neutral-800 p-6 md:p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center">Inspirasi Lokal Karawang</h1>
        <p className="text-center text-neutral-600 dark:text-neutral-300 mt-2 max-w-2xl mx-auto">
          Temukan cerita, inovasi, dan potensi UMKM di Karawang melalui artikel-artikel pilihan kami.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Semua Artikel</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
