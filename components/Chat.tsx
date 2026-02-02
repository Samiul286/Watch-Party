import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '@/types';
import NeoCard from './NeoCard';

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentUserId: string;
}

export default function Chat({ messages, onSendMessage, currentUserId }: ChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
      const lastMessage = messages[messages.length - 1];
      const isMe = lastMessage?.userId === currentUserId;

      if (isNearBottom || isMe) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages, currentUserId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <NeoCard variant="playful" className="flex flex-col h-full min-h-0 bg-white p-0 overflow-hidden" animateOnHover={false}>
      {/* Chat Header */}
      <div className="px-6 py-4 border-b-4 border-black bg-neo-purple text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neo-yellow border-4 border-black flex items-center justify-center -rotate-3">
            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
          </div>
          <div>
            <h3 className="font-black text-lg uppercase tracking-tighter">Banter Box</h3>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 smooth-scroll bg-[#F9FAFB]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-neo-cyan border-4 border-black flex items-center justify-center mb-6 animate-float rotate-6">
              <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M7.5 12c.83 0 1.5-.67 1.5-1.5S8.33 9 7.5 9 6 9.67 6 10.5 6.67 12 7.5 12zM16.5 12c.83 0 1.5-.67 1.5-1.5S17.17 9 16.5 9s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
            </div>
            <h4 className="font-black uppercase text-black/40">Silence is boring...</h4>
          </div>
        ) : (
          messages.map((message, idx) => {
            const isMe = message.userId === currentUserId;
            const prevMsg = idx > 0 ? messages[idx - 1] : null;
            const sameAuthor = prevMsg?.userId === message.userId;

            return (
              <div
                key={message.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${sameAuthor ? 'mt-1' : 'mt-4'}`}
              >
                {!sameAuthor && (
                  <span className="text-[10px] font-black text-black/40 uppercase tracking-widest mb-1.5 px-2">
                    {isMe ? 'YOU' : message.username}
                  </span>
                )}
                <div
                  className={`max-w-[85%] px-4 py-2 border-4 border-black font-bold shadow-neo-sm relative transition-all duration-200 ${isMe
                    ? 'bg-neo-pink text-white rounded-xl rounded-tr-none'
                    : 'bg-white text-black rounded-xl rounded-tl-none'
                    }`}
                >
                  {message.message}
                </div>
                {idx === messages.length - 1 && (
                  <span className="text-[9px] text-black/40 mt-1 px-2 font-black uppercase">
                    {formatTime(message.timestamp)}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t-4 border-black">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="TYPE SOMETHING..."
            className="flex-1 bg-white border-4 border-black px-4 py-3 font-black uppercase text-sm outline-none focus:bg-neo-cyan transition-colors"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-12 h-12 flex items-center justify-center bg-neo-yellow border-4 border-black shadow-neo-sm disabled:opacity-50 transition-all hover:translate-x-0.5 hover:translate-y-0.5"
          >
            <svg className="w-6 h-6" fill="black" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </form>
    </NeoCard>
  );
}
