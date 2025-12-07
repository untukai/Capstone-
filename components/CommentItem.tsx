
import React from 'react';
import { Comment } from '../types';
import { UserIcon } from './Icons';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: Comment;
  allComments: Comment[];
  onReply: (commentId: number) => void;
  activeReplyId: number | null;
  onSubmitReply: (text: string, parentId: number) => void;
  onCancelReply: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  allComments,
  onReply,
  activeReplyId,
  onSubmitReply,
  onCancelReply,
}) => {
  const replies = allComments.filter(c => c.parentId === comment.id);
  const isReplying = activeReplyId === comment.id;

  return (
    <div className="flex items-start gap-2">
      <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0 mt-1">
        <UserIcon className="w-5 h-5 text-neutral-500" />
      </div>
      <div className="flex-1">
        <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-2">
          <p className="font-bold text-sm text-neutral-800 dark:text-neutral-100">{comment.userName}</p>
          <p className="text-sm text-neutral-700 dark:text-neutral-300">{comment.text}</p>
        </div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex gap-2">
          <button onClick={() => onReply(comment.id)} className="font-semibold hover:underline">
            Balas
          </button>
        </div>

        {isReplying && (
          <div className="mt-2">
            <CommentForm
              onSubmit={(text) => onSubmitReply(text, comment.id)}
              placeholder={`Balas kepada ${comment.userName}...`}
              buttonLabel="Balas"
              autoFocus
            />
            <button onClick={onCancelReply} className="text-xs text-neutral-500 hover:underline mt-1">
              Batal
            </button>
          </div>
        )}

        {replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {replies.map(reply => (
              <div key={reply.id} className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <UserIcon className="w-5 h-5 text-neutral-500" />
                </div>
                <div className="flex-1 bg-neutral-100 dark:bg-neutral-700 rounded-lg p-2">
                  <p className="font-bold text-sm text-neutral-800 dark:text-neutral-100">{reply.userName}</p>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">{reply.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
