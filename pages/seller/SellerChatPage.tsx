

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSeller } from '../../hooks/useSeller';
import { conversations as initialConversations, addMessageToConversation } from '../../data/dummyData';
import { Conversation, ChatMessage } from '../../types';
import { UserIcon, SendIcon, ChatBubbleIcon } from '../../components/Icons';

const SellerChatPage: React.FC = () => {
  const { user } = useAuth();
  const { markChatsAsRead } = useSeller();
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0] || null);
  const [newMessage, setNewMessage] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    markChatsAsRead();
    // Reset individual conversation unread counts for the UI list
    const updatedConvos = conversations.map(c => ({ ...c, unreadCount: 0 }));
    setConversations(updatedConvos);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markChatsAsRead]);

  // Auto-scroll to the latest message when a conversation is selected or a new message is added.
  useEffect(() => {
    if (selectedConversation && messagesContainerRef.current) {
      // FIX: Use scrollTop to scroll the container's content, not scrollIntoView which scrolls the page.
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [selectedConversation, selectedConversation?.messages.length]); // Rerun when conversation changes or new message is added.
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedConversation) return;

    const message: ChatMessage = {
      sender: 'penjual',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    // Update state directly for UI reactivity
    const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedConversation.id) {
            const updatedMessages = [...conv.messages, message];
            return { ...conv, messages: updatedMessages, lastMessage: message.text, timestamp: message.timestamp };
        }
        return conv;
    });
    setConversations(updatedConversations);
    setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id) || null);
    
    // In a real app, this would be an API call. Here we mutate dummy data.
    addMessageToConversation(selectedConversation.id, message);

    setNewMessage('');
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg h-[calc(100vh-12rem)] flex overflow-hidden">
      {/* Conversation List */}
      <div className={`w-full md:w-1/3 border-r border-neutral-200 dark:border-neutral-700 flex-col ${selectedConversation && 'hidden md:flex'}`}>
        <div className="p-4 border-b dark:border-neutral-700">
          <h1 className="text-xl font-bold">Pesan Masuk</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${selectedConversation?.id === conv.id ? 'bg-primary/10' : 'hover:bg-neutral-50 dark:hover:bg-neutral-700/50'}`}
            >
              <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-6 h-6 text-neutral-500" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-neutral-800 dark:text-neutral-100 truncate">{conv.customerName}</p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 flex-shrink-0">{conv.timestamp}</p>
                </div>
                <div className="flex justify-between items-start">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{conv.lastMessage}</p>
                  {conv.unreadCount > 0 && <span className="text-xs bg-primary text-white font-bold rounded-full w-5 h-5 flex items-center justify-center">{conv.unreadCount}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`w-full md:w-2/3 flex flex-col ${!selectedConversation && 'hidden md:flex'}`}>
        {selectedConversation ? (
          <>
            <div className="p-4 border-b dark:border-neutral-700 flex items-center gap-3">
              <button onClick={() => setSelectedConversation(null)} className="md:hidden p-1 mr-2">&larr;</button>
              <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-6 h-6 text-neutral-500" />
              </div>
              {/* FIX: Add explicit text color for better contrast */}
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">{selectedConversation.customerName}</h2>
            </div>
            <div ref={messagesContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto bg-neutral-50 dark:bg-neutral-900">
                {selectedConversation.messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'penjual' ? 'justify-end' : 'justify-start'}`}>
                       {msg.sender === 'pembeli' && <div className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-600 flex-shrink-0"></div>}
                        <div className={`max-w-md rounded-lg px-3 py-2 ${msg.sender === 'penjual' ? 'bg-primary text-white rounded-br-none' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 rounded-bl-none'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.sender === 'penjual' ? 'text-white/70 text-right' : 'text-neutral-500 dark:text-neutral-400 text-left'}`}>{msg.timestamp}</p>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white dark:bg-neutral-800 dark:border-neutral-700 flex items-center gap-3">
                <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Ketik balasan Anda..."
                    className="flex-1 w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-neutral-100 dark:bg-neutral-700 dark:text-white"
                    autoComplete="off"
                />
                <button type="submit" className="p-3 bg-primary hover:bg-primary-dark rounded-full text-white transition-colors flex-shrink-0">
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-neutral-50 dark:bg-neutral-900">
             <ChatBubbleIcon className="w-16 h-16 text-neutral-300 dark:text-neutral-700" />
             <h2 className="text-xl font-bold mt-4 text-neutral-800 dark:text-neutral-100">Selamat Datang di Pusat Pesan</h2>
             <p className="text-neutral-500 dark:text-neutral-400 mt-2">Pilih percakapan dari daftar untuk mulai membalas pesan pelanggan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerChatPage;
