import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useRoom } from '@/hooks/useRoom';
import VideoPlayer from '@/components/VideoPlayer';
import Chat from '@/components/Chat';
import VideoCall from '@/components/VideoCall';
import NeoCard from '@/components/NeoCard';

export default function Room() {
  const router = useRouter();
  const { roomId } = router.query;
  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      let storedUserId = sessionStorage.getItem('watchPartyUserId');
      if (!storedUserId) {
        storedUserId = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('watchPartyUserId', storedUserId);
      }
      return storedUserId;
    }
    return Math.random().toString(36).substring(2, 15);
  });
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (router.query.username) {
      setUsername(router.query.username as string);
    }
  }, [router.query.username]);

  const {
    videoState,
    messages,
    users,
    joinRoom,
    leaveRoom,
    updateVideoState,
    sendMessage
  } = useRoom(roomId as string, userId, username);

  useEffect(() => {
    if (roomId && username && !isJoined) {
      try {
        joinRoom();
        setIsJoined(true);
        setError(null);
      } catch (err) {
        setError('Failed to join room. Please try again.');
        console.error('Error joining room:', err);
      }
    }
  }, [roomId, username, joinRoom, isJoined]);

  useEffect(() => {
    if (router.isReady && !router.query.username) {
      router.push('/');
    }
  }, [router]);

  if (!roomId || !username) {
    return (
      <div className="min-h-screen bg-neo-yellow flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 bg-white border-8 border-black rounded-3xl flex items-center justify-center animate-wiggle shadow-neo">
          <span className="text-4xl">🚀</span>
        </div>
        <p className="mt-8 font-black text-black tracking-[0.2em] uppercase text-xl text-center">
          ENTERING THE <span className="bg-neo-pink text-white px-2">PARTY ZONE</span>...
        </p>
      </div>
    );
  }

  const copyRoomId = async () => {
    const textToCopy = roomId as string;
    let success = false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
        success = true;
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          success = document.execCommand('copy');
        } catch (err) {
          console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }

    if (success) {
      const notification = document.createElement('div');
      notification.className = 'fixed top-12 left-1/2 transform -translate-x-1/2 px-8 py-4 bg-neo-green border-4 border-black shadow-neo-sm z-[100] font-black text-sm animate-wiggle flex items-center gap-3';
      notification.innerHTML = `<span class="text-xl">🔥</span> LINK COPIED TO CLIPBOARD!`;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => notification.remove(), 400);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-neo-yellow font-mono pb-20 selection:bg-black selection:text-neo-yellow">
      <Head>
        <title>WATCH PARTY | {roomId}</title>
      </Head>

      {/* Neo-Brutalist Nav Bar */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-black h-16 sm:h-20 px-4 sm:px-8 flex items-center justify-between shadow-neo-sm">
        <div className="flex items-center gap-4">
          <NeoCard
            variant="standard"
            bgColor="bg-neo-pink"
            className="p-1 px-3 cursor-pointer"
            onClick={() => { leaveRoom(); router.push('/'); }}
          >
            <span className="text-white font-black text-xs">EXIT</span>
          </NeoCard>
          <div className="hidden sm:block">
            <h1 className="font-black text-xl uppercase tracking-tighter italic">Watch Party <span className="text-neo-pink">V2</span></h1>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-black text-white px-4 py-1 transform -rotate-1 shadow-neo-sm">
            <h2 className="font-black text-sm sm:text-lg uppercase tracking-widest">ROOM: {roomId}</h2>
          </div>
        </div>

        <div className="hidden xs:block">
          <NeoCard
            variant="standard"
            bgColor="bg-neo-cyan"
            className="p-1 px-4 cursor-pointer"
            onClick={copyRoomId}
          >
            <span className="font-black text-xs uppercase">INVITE OTHERS</span>
          </NeoCard>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Content Area: Video and Cams */}
          <div className="lg:col-span-8 space-y-8">
            {/* Video Section */}
            <VideoPlayer
              videoState={videoState}
              onStateChange={updateVideoState}
              userId={userId}
            />

            {/* Video Call Section */}
            <NeoCard variant="playful" className="bg-white p-4 sm:p-8">
              <VideoCall
                roomId={roomId as string}
                userId={userId}
                users={users}
                onLeave={() => {
                  leaveRoom();
                  router.push('/');
                }}
              />
            </NeoCard>
          </div>

          {/* Sidebar Area: Chat and Info */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="h-[400px] sm:h-[600px] lg:h-[700px]">
              <Chat
                messages={messages}
                onSendMessage={sendMessage}
                currentUserId={userId}
              />
            </div>

            {/* Room Info Card */}
            <NeoCard variant="playful" bgColor="bg-neo-green" className="p-6">
              <div className="flex items-center justify-between mb-4 border-b-4 border-black pb-2">
                <h3 className="font-black text-lg uppercase">Room Stats</h3>
                <div className="bg-white border-2 border-black px-3 py-1 font-black text-sm">
                  {users.length} ONLINE
                </div>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-white border-4 border-black shadow-neo-sm transform hover:scale-[1.02] transition-transform">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 border-4 border-black flex items-center justify-center text-white font-black text-xs ${user.id === userId ? 'bg-neo-pink' : 'bg-neo-purple'
                        }`}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-black text-sm block">
                          {user.username} {user.id === userId && "(YOU)"}
                        </span>
                        <span className="text-[10px] font-black opacity-40 uppercase">
                          {user.id === userId ? 'HOSTING' : 'WATCHING'}
                        </span>
                      </div>
                    </div>
                    <div className={`w-3 h-3 border-2 border-black rounded-full ${user.id === userId ? 'bg-neo-pink animate-pulse' : 'bg-neo-green'}`}></div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t-4 border-black/10">
                <p className="text-[10px] font-black uppercase text-black/40 text-center tracking-widest">
                  SECURE &bull; PEER-TO-PEER &bull; ENCRYPTED
                </p>
              </div>
            </NeoCard>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="mt-12 text-center pb-8 opacity-20 hover:opacity-100 transition-opacity">
        <div className="inline-block bg-black text-white px-6 py-2 border-4 border-white shadow-neo">
          <p className="font-black uppercase text-xs tracking-[0.3em]">Watch Party V2 &bull; Neo-Brutalism</p>
        </div>
      </footer>
    </div>
  );
}
