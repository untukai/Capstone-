import React, { useState } from 'react';
import Button from './Button';
import { useAuth } from '../hooks/useAuth';
import { UserIcon } from './Icons';

interface CommentFormProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  buttonLabel?: string;
  autoFocus?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, placeholder = "Tulis komentar...", buttonLabel = "Kirim", autoFocus = false }) => {
  const [text, setText] = useState('');
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex items-start gap-2">
      <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0 mt-1">
        <UserIcon className="w-5 h-5 text-neutral-500" />
      </div>
      <div className="flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          rows={1}
          autoFocus={autoFocus}
        />
        <div className="text-right mt-2">
          <Button type="submit" disabled={!text.trim()} className="!text-xs !py-1 !px-3">
            {buttonLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
