
import React, { useState, useEffect } from 'react';
import { useShare } from '../hooks/useShare';
import { useNotification } from '../hooks/useNotification';
import { XIcon, CopyIcon, WhatsAppIcon, FacebookIcon, TelegramIcon, TwitterIcon } from './Icons';

const ShareModal: React.FC = () => {
  const { shareData, hideShareModal } = useShare();
  const { showNotification } = useNotification();
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (shareData) {
      setIsCopied(false); // Reset copied state when modal opens with new data
    }
  }, [shareData]);

  if (!shareData) {
    return null;
  }

  const { url, title, text } = shareData;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      showNotification('Berhasil Disalin', 'Tautan berhasil disalin ke clipboard!');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }, (err) => {
      showNotification('Gagal', 'Gagal menyalin tautan.', 'error');
      console.error('Could not copy text: ', err);
    });
  };

  const socialPlatforms = [
    { name: 'WhatsApp', icon: WhatsAppIcon, url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text}\n${url}`)}`, color: 'text-green-500' },
    { name: 'Facebook', icon: FacebookIcon, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, color: 'text-blue-600' },
    { name: 'Twitter', icon: TwitterIcon, url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, color: 'text-sky-500' },
    { name: 'Telegram', icon: TelegramIcon, url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, color: 'text-sky-400' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-overlay"
      onClick={hideShareModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-transform duration-300 animate-popup-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <h2 id="share-modal-title" className="text-lg font-bold">Bagikan</h2>
          <button onClick={hideShareModal} className="text-neutral-500 hover:text-neutral-800" aria-label="Tutup"><XIcon className="w-6 h-6" /></button>
        </div>
        <div className="p-6">
          <p className="text-sm text-neutral-600 mb-4">Bagikan tautan ini melalui:</p>
          <div className="grid grid-cols-4 gap-4 text-center">
            {socialPlatforms.map(platform => (
              <a key={platform.name} href={platform.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 text-neutral-700 hover:text-primary transition-colors">
                <platform.icon className={`w-10 h-10 ${platform.color}`} />
                <span className="text-xs">{platform.name}</span>
              </a>
            ))}
          </div>
          <div className="mt-6">
            <label htmlFor="share-url" className="text-sm font-medium text-neutral-700">Atau salin tautan</label>
            <div className="flex items-center gap-2 mt-1">
              <input id="share-url" type="text" readOnly value={url} className="w-full bg-neutral-100 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-600" />
              <button onClick={handleCopyLink} className="p-2 border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-primary transition-colors flex-shrink-0">
                <CopyIcon className="w-5 h-5" />
              </button>
            </div>
            {isCopied && <p className="text-green-600 text-sm mt-2 text-center">Tautan disalin!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
