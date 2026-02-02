import { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { VideoState } from '@/types';
import NeoCard from './NeoCard';

interface VideoPlayerProps {
  videoState: VideoState | null;
  onStateChange: (state: Partial<VideoState>) => void;
  userId: string;
}

export default function VideoPlayer({ videoState, onStateChange, userId }: VideoPlayerProps) {
  const playerRef = useRef<ReactPlayer>(null);
  const [url, setUrl] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [lastSeekTime, setLastSeekTime] = useState<number | null>(null);
  const isSeeking = useRef(false);
  const lastBroadcastTime = useRef<number>(0);

  // Sync videoState.url to local state only when it comes from another user
  useEffect(() => {
    if (videoState?.url && videoState.updatedBy !== userId) {
      setUrl(videoState.url);
    }
  }, [videoState?.url, videoState?.updatedBy, userId]);

  // Sync playback position when videoState changes from another user
  useEffect(() => {
    if (!isReady || !playerRef.current || !videoState) return;

    const currentTime = playerRef.current.getCurrentTime();
    const targetTime = videoState.playedSeconds || 0;

    if (videoState.updatedBy !== userId && Math.abs(currentTime - targetTime) > 1.5) {
      isSeeking.current = true;
      playerRef.current.seekTo(targetTime, 'seconds');
      setTimeout(() => {
        isSeeking.current = false;
      }, 500);
    }
  }, [videoState?.playedSeconds, videoState?.updatedBy, userId, isReady]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onStateChange({ url: url.trim(), isPlaying: true, playedSeconds: 0 });
      setIsReady(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Source Input Overlay */}
      <NeoCard variant="playful" className="p-3 sm:p-4">
        <form onSubmit={handleUrlSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="PASTE VIDEO LINK..."
            className="flex-1 px-4 py-3 bg-white border-4 border-black font-black uppercase outline-none focus:bg-neo-cyan transition-colors"
          />
          <button
            type="submit"
            className="bg-neo-yellow px-8 h-12 border-4 border-black font-black uppercase shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all active:translate-x-1 active:translate-y-1"
          >
            WATCH
          </button>
        </form>
      </NeoCard>

      {/* Video Canvas */}
      <div className="relative border-4 border-black shadow-neo-lg bg-black overflow-hidden group">
        {(videoState?.url || url) ? (
          <ReactPlayer
            ref={playerRef}
            url={videoState?.url || url}
            width="100%"
            height="100%"
            playing={videoState?.isPlaying ?? false}
            controls={true}
            onPlay={() => {
              if (!isSeeking.current) {
                const currentTime = playerRef.current?.getCurrentTime() || 0;
                onStateChange({ isPlaying: true, playedSeconds: currentTime });
                lastBroadcastTime.current = Date.now();
              }
            }}
            onPause={() => {
              if (!isSeeking.current) {
                const currentTime = playerRef.current?.getCurrentTime() || 0;
                onStateChange({ isPlaying: false, playedSeconds: currentTime });
                lastBroadcastTime.current = Date.now();
              }
            }}
            onSeek={(seconds: number) => {
              if (!isSeeking.current) {
                setLastSeekTime(seconds);
                onStateChange({
                  playedSeconds: seconds,
                  isPlaying: videoState?.isPlaying ?? false
                });
                lastBroadcastTime.current = Date.now();
              }
            }}
            onProgress={({ playedSeconds }) => {
              if (!isSeeking.current && videoState?.isPlaying) {
                const now = Date.now();
                const timeSinceLastBroadcast = (now - lastBroadcastTime.current) / 1000;
                const drift = Math.abs(playedSeconds - (videoState?.playedSeconds || 0));

                if (drift > 3 || timeSinceLastBroadcast > 10) {
                  onStateChange({ playedSeconds });
                  lastBroadcastTime.current = now;
                }
              }
            }}
            onReady={() => {
              setIsReady(true);
              if (videoState?.playedSeconds !== undefined) {
                isSeeking.current = true;
                playerRef.current?.seekTo(videoState.playedSeconds, 'seconds');
                setTimeout(() => {
                  isSeeking.current = false;
                }, 500);
              }
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
            <div className="w-16 h-16 bg-neo-pink border-4 border-black flex items-center justify-center animate-wiggle mb-6 rotate-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <p className="text-xl font-black uppercase tracking-tighter">Waiting for Input...</p>
          </div>
        )}

        {/* Sync Indicator */}
        {videoState && (
          <div className="absolute top-4 right-4 bg-neo-green text-black border-4 border-black px-3 py-1 flex items-center gap-2 shadow-neo-sm">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase">SYNCED</span>
          </div>
        )}
      </div>

      {/* Playback Status Bar */}
      <div className="flex items-center justify-between px-1 py-1 gap-2">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-black uppercase tracking-wider text-black opacity-60">Connected:</span>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-neo-purple border-2 border-black flex items-center justify-center text-white font-black text-[10px] shadow-neo-sm">ME</div>
            <div className="w-8 h-8 rounded-full bg-neo-cyan border-2 border-black flex items-center justify-center text-black font-black text-[10px] shadow-neo-sm">P2</div>
          </div>
        </div>
        <div className="flex items-center">
          <span className={`px-3 py-1 border-4 border-black font-black text-[12px] uppercase shadow-neo-sm ${videoState?.isPlaying ? 'bg-neo-green' : 'bg-neo-pink'}`}>
            {videoState?.isPlaying ? 'LIVE' : 'PAUSED'}
          </span>
        </div>
      </div>
    </div>
  );
}
