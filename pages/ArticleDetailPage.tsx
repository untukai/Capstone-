
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { articles } from '../data/dummyData';
import Button from '../components/Button';
import { useNotification } from '../hooks/useNotification';
import { useShare } from '../hooks/useShare';
import { ShareIcon } from '../components/Icons';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showNotification } = useNotification();
  const { showShareModal } = useShare();
  
  // In a real app, you might fetch this from localStorage or an API
  const article = articles.find(a => a.id === parseInt(id || ''));

  if (!article) {
    return (
      <div className="text-center bg-white dark:bg-neutral-800 p-10 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold">Artikel tidak ditemukan</h1>
        <Link to="/articles" className="text-primary hover:underline mt-4 inline-block">
          <Button>Kembali ke Halaman Artikel</Button>
        </Link>
      </div>
    );
  }

  const handleShare = async () => {
    const articleUrl = window.location.href;
    const shareData = {
      title: article.title,
      text: `Baca artikel menarik ini di KODIK: "${article.summary}"`,
      url: articleUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof DOMException && error.name !== 'AbortError') {
          console.error('Error sharing natively:', error);
          showShareModal(shareData);
        }
      }
    } else {
      showShareModal(shareData);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-neutral-800 p-6 md:p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="w-full h-64 md:h-80 bg-neutral-200 dark:bg-neutral-700 rounded-lg mb-6 overflow-hidden">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
      </div>
      
      <div className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
        <span>Oleh <strong className="text-neutral-700 dark:text-neutral-200">{article.author}</strong></span>
        <span className="mx-2">|</span>
        <span>Diterbitkan pada {formatDate(article.publishDate)}</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 leading-tight">{article.title}</h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-300 mt-4 italic border-l-4 border-primary pl-4">{article.summary}</p>
      
      <div className="border-t dark:border-neutral-700 my-8"></div>

      <div className="prose dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap">
        {article.content}
      </div>
      
      <div className="mt-10 pt-6 border-t dark:border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
          <ShareIcon className="w-5 h-5" />
          Bagikan Artikel
        </Button>
        <Link to="/articles">
          <Button variant="outline">Kembali ke Semua Artikel</Button>
        </Link>
      </div>
    </div>
  );
};

export default ArticleDetailPage;