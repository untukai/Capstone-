
import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <Link to={`/articles/${article.id}`} className="flex flex-col h-full bg-white dark:bg-neutral-800 rounded-lg overflow-hidden transition-shadow duration-300 border border-neutral-200 dark:border-neutral-700 hover:shadow-xl group">
      <div className="w-full h-48 bg-neutral-200 dark:bg-neutral-700 overflow-hidden flex-shrink-0">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 group-hover:text-primary transition-colors line-clamp-2 mb-2">{article.title}</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3 flex-grow">{article.summary}</p>
        <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700">
           <span className="inline-block text-primary font-semibold text-sm">Baca Selengkapnya &rarr;</span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
