
import React, { useState } from 'react';
import { Post, Comment } from '../types';
// FIX: Import `posts` as `initialPosts` to access the global posts array.
import { sellers, addComment, posts as initialPosts } from '../data/dummyData';
import { useAuth } from '../hooks/useAuth';
import { HeartIcon, ChatBubbleIcon, StoreIcon, ShareIcon } from './Icons';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { useNotification } from '../hooks/useNotification';
import { useShare } from '../hooks/useShare';

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post: initialPost }) => {
    const { user, isAuthenticated } = useAuth();
    const { showNotification } = useNotification();
    const { showShareModal } = useShare();
    const [post, setPost] = useState(initialPost);
    const [comments, setComments] = useState<Comment[]>(initialPost.comments);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);

    const seller = sellers.find(s => s.id === post.sellerId);

    const timeAgo = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " tahun lalu";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " bulan lalu";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " hari lalu";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " jam lalu";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " menit lalu";
        return "Baru saja";
    };
    
    const showLoginNotification = () => {
        showNotification(
            'Login Diperlukan',
            'Anda harus masuk untuk menyukai atau mengomentari postingan.',
            'error',
            { label: 'Masuk Sekarang', path: '/login' }
        );
    };

    const handleLike = () => {
        if (!isAuthenticated) {
            showLoginNotification();
            return;
        }
        setPost(prevPost => ({
            ...prevPost,
            likes: isLiked ? prevPost.likes - 1 : prevPost.likes + 1,
        }));
        setIsLiked(!isLiked);
    };

    const handleToggleComments = () => {
        if (!isAuthenticated) {
            showLoginNotification();
            return;
        }
        setShowComments(!showComments);
    };
    
    const handleSetReplyTo = (commentId: number) => {
        if (!isAuthenticated) {
            showLoginNotification();
            return;
        }
        setReplyingTo(commentId);
    };

    const handleShare = async () => {
        if (!seller) return;
        const postUrl = `${window.location.origin}${window.location.pathname}#/feed`;
        const shareData = {
          title: `Postingan dari ${seller.name} di KODIK`,
          text: `Cek postingan menarik dari ${seller.name} di KODIK Feed!`,
          url: postUrl,
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
    
    const handleCommentSubmit = (text: string, parentId: number | null = null) => {
        if (!user) {
            showLoginNotification();
            return;
        }

        const newCommentData: Omit<Comment, 'id'> = {
            parentId: parentId || undefined,
            userName: user.email.split('@')[0],
            userEmail: user.email,
            text: text,
        };

        addComment(post.id, newCommentData);

        // FIX: Use `initialPosts` (the imported global `posts` array) to get the updated comments.
        const updatedPostComments = initialPosts.find(p => p.id === post.id)!.comments;
        const addedComment = updatedPostComments[updatedPostComments.length - 1];
        
        setComments(prev => [...prev, addedComment]);
        setReplyingTo(null);
    };

    if (!seller) return null;

    const topLevelComments = comments.filter(c => !c.parentId);

    return (
        <div className="bg-white dark:bg-neutral-800 dark:border dark:border-neutral-700 rounded-2xl shadow-md overflow-hidden mb-6">
            <div className="p-4 pb-2">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center overflow-hidden border border-neutral-100 dark:border-neutral-700">
                      {seller.imageUrl ? (
                        <img src={seller.imageUrl} alt={seller.name} className="w-full h-full object-cover" />
                      ) : (
                        <StoreIcon className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                        <p className="font-bold text-neutral-900 dark:text-neutral-100 text-sm leading-tight">{seller.name}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{timeAgo(post.timestamp)}</p>
                    </div>
                </div>
                <p className="text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap text-sm leading-relaxed mb-3">{post.content}</p>
            </div>
            
            {post.mediaUrl && (
                <div className="px-3 pb-3">
                    <div className="p-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-2xl border border-neutral-200 dark:border-neutral-600">
                        {post.mediaType === 'video' ? (
                            <video 
                                src={post.mediaUrl} 
                                controls 
                                className="w-full h-auto max-h-[500px] rounded-xl object-contain bg-black" 
                            />
                        ) : (
                            <img 
                                src={post.mediaUrl} 
                                alt="Post content" 
                                className="w-full h-auto max-h-[500px] rounded-xl object-cover bg-neutral-200 dark:bg-neutral-800" 
                            />
                        )}
                    </div>
                </div>
            )}
            
            <div className="px-4 pb-2 pt-1">
                <div className="flex justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-3">
                    <span className="flex items-center gap-1"><HeartIcon className="w-3.5 h-3.5" /> {post.likes}</span>
                    <span>{comments.length} Komentar</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 border-t dark:border-neutral-700 pt-2 pb-2">
                    <button onClick={handleLike} className={`flex items-center justify-center gap-2 py-1.5 rounded-lg transition-all text-sm font-semibold active:scale-95 ${isLiked ? 'text-red-500 bg-red-50 dark:bg-red-500/10' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>
                        <HeartIcon className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        <span className="hidden sm:inline">Suka</span>
                    </button>
                    <button onClick={handleToggleComments} className="flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-semibold text-sm transition-colors active:scale-95">
                        <ChatBubbleIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Komentar</span>
                    </button>
                     <button onClick={handleShare} className="flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-semibold text-sm transition-colors active:scale-95">
                        <ShareIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Bagikan</span>
                    </button>
                </div>
            </div>
            
            {showComments && (
                <div className="px-4 py-3 border-t dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 animate-fade-in">
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                        {topLevelComments.length > 0 ? (
                            topLevelComments.map(comment => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    allComments={comments}
                                    onReply={handleSetReplyTo}
                                    activeReplyId={replyingTo}
                                    onSubmitReply={handleCommentSubmit}
                                    onCancelReply={() => setReplyingTo(null)}
                                />
                            ))
                        ) : (
                            <div className="text-center py-6 text-neutral-400">
                                <p className="text-sm">Belum ada komentar.</p>
                                <p className="text-xs mt-1">Jadilah yang pertama berkomentar!</p>
                            </div>
                        )}
                    </div>
                    {isAuthenticated && (
                         <CommentForm 
                            onSubmit={(text) => handleCommentSubmit(text, null)}
                            placeholder="Tulis komentar publik..."
                         />
                    )}
                </div>
            )}
        </div>
    );
};

export default PostCard;
