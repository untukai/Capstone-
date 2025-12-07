

import React, { useState, useRef, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { posts as initialPosts, addPost, sellers } from '../data/dummyData';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import { Post } from '../types';
import { PhotoIcon, XIcon } from '../components/Icons';

const CreatePostForm: React.FC<{ onAddPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'timestamp'>) => void }> = ({ onAddPost }) => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [media, setMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaUrlRef = useRef<string | null>(null);

    useEffect(() => {
        // This effect manages the lifecycle of the blob URL.
        // It revokes the URL when the component unmounts or when a new file is selected,
        // preventing memory leaks.
        mediaUrlRef.current = media?.url ?? null;
        return () => {
            if (mediaUrlRef.current) {
                URL.revokeObjectURL(mediaUrlRef.current);
            }
        };
    }, [media]);

    const currentSeller = sellers.find(s => s.email === user?.email);

    if (!currentSeller) {
        return null; // Don't show form if not a seller
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const type = file.type.startsWith('video') ? 'video' : 'image';
            setMedia({
                url: URL.createObjectURL(file),
                type: type
            });
        }
    }

    const handleRemoveMedia = () => {
        setMedia(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !media) return;

        // FIX: The object URL from `media.url` is passed to the parent.
        // It must NOT be revoked here. The new PostCard component will now be responsible
        // for displaying it. Our useEffect handles revoking it only if the component
        // unmounts or the media is changed, not on submit.
        onAddPost({
            sellerId: currentSeller.id,
            content: content,
            mediaUrl: media?.url,
            mediaType: media?.type,
        });
        
        // Detach the media from this component's state without revoking the URL,
        // as it is now being used by the newly created post.
        mediaUrlRef.current = null;
        setContent('');
        setMedia(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-md mb-8">
            <h2 className="text-lg font-bold mb-3 dark:text-neutral-100">Buat Postingan Baru</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`Apa yang Anda pikirkan, ${currentSeller.name}?`}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:placeholder-neutral-400"
                ></textarea>

                {media && (
                    <div className="mt-3 relative">
                        <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center">
                            {media.type === 'image' ? (
                                <img src={media.url} alt="Preview" className="max-h-80 w-auto object-contain rounded-lg"/>
                            ) : (
                                <video src={media.url} controls className="max-h-80 w-full object-contain rounded-lg"/>
                            )}
                        </div>
                        <button type="button" onClick={handleRemoveMedia} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/80">
                            <XIcon className="w-4 h-4"/>
                        </button>
                    </div>
                )}

                <div className="flex justify-between items-center mt-3">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*,video/*" 
                        className="hidden" 
                    />
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()} 
                        className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary font-semibold p-2 rounded-lg transition-colors"
                        aria-label="Tambah Foto atau Video"
                    >
                        <PhotoIcon className="w-6 h-6"/>
                        <span>Foto/Video</span>
                    </button>
                    <Button type="submit" disabled={!content.trim() && !media}>Posting</Button>
                </div>
            </form>
        </div>
    );
};


const FeedPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>(initialPosts);

    const handleAddPost = (postData: Omit<Post, 'id' | 'likes' | 'comments' | 'timestamp'>) => {
        addPost(postData);
        // Create a new array from the mutated source to trigger a re-render.
        setPosts([...initialPosts]); 
    };

  return (
    <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Kabar Penjual</h1>
        <CreatePostForm onAddPost={handleAddPost} />
        <div className="space-y-6">
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    </div>
  );
};

export default FeedPage;