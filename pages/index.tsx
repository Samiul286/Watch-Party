import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NeoCard from '../components/NeoCard';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = () => {
    if (!username.trim()) return;
    setIsLoading(true);
    const newRoomId = generateRoomId();
    window.location.href = `/room/${newRoomId}?username=${encodeURIComponent(username.trim())}`;
  };

  const joinRoom = () => {
    if (!username.trim() || !roomId.trim()) return;
    setIsLoading(true);
    window.location.href = `/room/${roomId.trim()}?username=${encodeURIComponent(username.trim())}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F3F4F6] font-mono relative overflow-hidden">
      <Head>
        <title>Watch Party - NEO</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </Head>

      {/* Decorative Shapes */}
      <div className="absolute top-[10%] left-[5%] animate-float opacity-40">
        <div className="w-16 h-16 bg-neo-cyan border-4 border-black rotate-12 shadow-neo-sm"></div>
      </div>
      <div className="absolute bottom-[15%] right-[8%] animate-float opacity-30" style={{ animationDelay: '1s' }}>
        <div className="w-24 h-24 bg-neo-yellow border-4 border-black -rotate-12 shadow-neo-sm rounded-full"></div>
      </div>
      <div className="absolute top-[20%] right-[10%] animate-wiggle opacity-20">
        <div className="w-12 h-12 bg-neo-pink border-4 border-black rotate-45 shadow-neo-sm"></div>
      </div>

      <div className="w-full max-w-lg z-10 animate-fade-up">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-neo-purple text-white px-4 py-1.5 border-4 border-black shadow-neo-sm mb-6 animate-heartbeat">
            <span className="font-black uppercase tracking-widest text-[12px]">Version 2.0</span>
          </div>
          <h1 className="text-[48px] leading-[0.9] font-black uppercase tracking-tighter text-black mb-4">
            WATCH <br /><span className="bg-neo-pink text-white px-2 border-4 border-black">PARTY</span>
          </h1>
          <p className="font-bold text-lg text-black/80 max-w-xs mx-auto">
            Sync movies. Chat bold. <br />No distractions.
          </p>
        </div>

        {/* Tab Selection */}
        <NeoCard variant="playful" className="p-8">
          <div className="flex bg-black p-1 mb-8 border-4 border-black">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-3 font-black text-sm uppercase transition-all ${activeTab === 'create' ? 'bg-neo-yellow text-black' : 'text-white hover:bg-white/10'}`}
            >
              New Room
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-1 py-3 font-black text-sm uppercase transition-all ${activeTab === 'join' ? 'bg-neo-yellow text-black' : 'text-white hover:bg-white/10'}`}
            >
              Join Room
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block font-black uppercase text-sm mb-2">Display Name</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="TYPE YOUR NAME..."
                className="w-full px-4 py-4 bg-white border-4 border-black font-black uppercase focus:bg-neo-cyan transition-colors outline-none shadow-neo-sm"
              />
            </div>

            {activeTab === 'join' && (
              <div className="animate-fade-up">
                <label className="block font-black uppercase text-sm mb-2">Room Code</label>
                <input
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="EX: NEO-BRUTAL"
                  className="w-full px-4 py-4 bg-white border-4 border-black font-black uppercase focus:bg-neo-yellow transition-colors outline-none shadow-neo-sm italic"
                />
              </div>
            )}

            <button
              onClick={activeTab === 'create' ? createRoom : joinRoom}
              disabled={isLoading || !username.trim() || (activeTab === 'join' && !roomId.trim())}
              className={`
                w-full py-5 font-black uppercase text-xl border-4 border-black transition-all
                ${isLoading ? 'bg-gray-200 cursor-not-allowed' : 'bg-neo-green hover:shadow-neo hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 active:shadow-none'}
              `}
            >
              {isLoading ? 'INITIATING...' : (activeTab === 'create' ? 'CREATE PARTY' : 'JOIN PARTY')}
            </button>
          </div>
        </NeoCard>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-[12px] font-black uppercase tracking-[0.2em] text-black">
            © 2026 NEO-WATCH PARTY
          </p>
        </div>
      </div>
    </div>
  );
}
