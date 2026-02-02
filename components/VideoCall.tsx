import { useEffect, useRef, useState, useCallback } from 'react';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useSocket } from '@/hooks/useSocket';
import { User } from '@/types';
import NeoCard from './NeoCard';

interface VideoCallProps {
    roomId: string;
    userId: string;
    users: User[];
    onLeave?: () => void;
}

export default function VideoCall({ roomId, userId, users, onLeave }: VideoCallProps) {
    const socket = useSocket();
    const {
        localStream,
        remoteStreams,
        isVideoEnabled,
        isAudioEnabled,
        initializeMedia,
        startCall,
        toggleVideo,
        toggleAudio
    } = useWebRTC(roomId, userId);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const [permissionError, setPermissionError] = useState(false);
    const callInitiatedFor = useRef<Set<string>>(new Set());

    useEffect(() => {
        const init = async () => {
            const stream = await initializeMedia();
            if (!stream) {
                setPermissionError(true);
            }
        };
        init();
    }, [initializeMedia]);

    useEffect(() => {
        if (localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
            localVideoRef.current.play().catch(err => {
                console.error('Error playing local video:', err);
            });
        }
    }, [localStream]);

    // Handle page visibility to restart video playback
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && localVideoRef.current && localStream) {
                localVideoRef.current.play().catch(err => {
                    console.error('Error resuming local video:', err);
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [localStream]);

    useEffect(() => {
        if (!localStream) return;
        const currentUserIds = new Set(users.map(u => u.id));
        const trackedUserIds = Array.from(callInitiatedFor.current);

        trackedUserIds.forEach(trackedId => {
            if (!currentUserIds.has(trackedId) && trackedId !== userId) {
                callInitiatedFor.current.delete(trackedId);
            }
        });

        users.forEach(user => {
            if (user.id !== userId && !callInitiatedFor.current.has(user.id)) {
                const shouldInitiate = userId < user.id;
                if (shouldInitiate) {
                    callInitiatedFor.current.add(user.id);
                    setTimeout(() => {
                        startCall(user.id);
                    }, 500);
                }
            }
        });
    }, [users, userId, startCall, localStream]);

    useEffect(() => {
        if (!localStream || !socket) return;

        const handleUserConnected = (connectedUserId: string) => {
            if (connectedUserId !== userId && userId < connectedUserId && !callInitiatedFor.current.has(connectedUserId)) {
                callInitiatedFor.current.add(connectedUserId);
                setTimeout(() => {
                    startCall(connectedUserId);
                }, 1000);
            }
        };

        const handleUserDisconnected = (disconnectedUserId: string) => {
            callInitiatedFor.current.delete(disconnectedUserId);
        };

        socket.on('user-connected', handleUserConnected);
        socket.on('user-disconnected', handleUserDisconnected);
        return () => {
            socket.off('user-connected', handleUserConnected);
            socket.off('user-disconnected', handleUserDisconnected);
        };
    }, [localStream, userId, startCall, socket]);

    const handleEndNight = () => {
        if (onLeave) {
            onLeave();
        } else {
            window.location.href = '/';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neo-yellow border-4 border-black flex items-center justify-center transform -rotate-3 shadow-neo-sm">
                        <svg className="w-6 h-6" fill="black" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" /></svg>
                    </div>
                    <h3 className="font-black text-xl uppercase tracking-tighter">Live Cams</h3>
                </div>
                <div className="bg-neo-pink text-white border-4 border-black px-4 py-1 animate-pulse shadow-neo-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest">ON AIR</span>
                </div>
            </div>

            {permissionError ? (
                <NeoCard variant="playful" bgColor="bg-neo-yellow/20" className="p-12 text-center border-dashed">
                    <p className="font-black uppercase mb-6">Camera Access Required!</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-neo-pink text-white border-4 border-black px-8 py-3 font-black uppercase shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5"
                    >
                        Allow Access
                    </button>
                </NeoCard>
            ) : (
                <div className="grid grid-cols-2 gap-6">
                    {/* Local Video */}
                    <div className="flex flex-col gap-3">
                        <div className="relative aspect-video border-4 border-black bg-black shadow-neo overflow-hidden group">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover mirror transform transition-transform group-hover:scale-105"
                            />
                            {!isVideoEnabled && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                                    <div className="w-16 h-16 bg-neo-pink border-4 border-black flex items-center justify-center rotate-45 animate-wiggle">
                                        <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" /></svg>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-center">
                            <span className="bg-white border-2 border-black px-3 py-0.5 font-black uppercase text-[10px]">YOU</span>
                        </div>
                    </div>

                    {/* Remote Videos */}
                    {Object.entries(remoteStreams).map(([peerId, stream]) => {
                        const remoteUser = users.find(u => u.id === peerId);
                        return (
                            <div key={peerId} className="flex flex-col gap-3">
                                <div className="relative aspect-video border-4 border-black bg-black shadow-neo overflow-hidden group">
                                    <RemoteVideo stream={stream} />
                                </div>
                                <div className="flex justify-center">
                                    <span className="bg-neo-cyan border-2 border-black px-3 py-0.5 font-black uppercase text-[10px]">{remoteUser?.username || 'GUEST'}</span>
                                </div>
                            </div>
                        );
                    })}

                    {/* Placeholder for waiting */}
                    {Object.keys(remoteStreams).length === 0 && users.length > 1 && (
                        <div className="relative aspect-video bg-neo-yellow/10 flex flex-col items-center justify-center border-4 border-black border-dashed">
                            <div className="w-12 h-12 bg-neo-pink border-4 border-black animate-spin mb-4"></div>
                            <span className="text-[12px] font-black uppercase tracking-widest text-black">connecting...</span>
                        </div>
                    )}
                </div>
            )}

            {/* Control Strip */}
            <div className="flex justify-center pt-4">
                <div className="bg-white border-4 border-black p-2 flex items-center gap-4 px-6 shadow-neo-lg">
                    <button
                        onClick={toggleAudio}
                        className={`w-12 h-12 flex items-center justify-center border-4 border-black transition-all ${isAudioEnabled ? 'bg-neo-cyan hover:bg-neo-cyan/80' : 'bg-neo-pink text-black'}`}
                    >
                        {isAudioEnabled ? (
                            <svg className="w-6 h-6" fill="black" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zM17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" /></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="black" viewBox="0 0 24 24"><path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.17l5.98 6zm3.97 3.97l-1.41-1.41-1.42-1.42L5.41 4.59 4 6l5 5v1c0 1.66 1.34 3 3 3 .35 0 .68-.06 1-.17l4.07 4.07c-.4.21-.84.39-1.3.5v3h2v-3c.27-.06.53-.15.78-.25l2.42 2.42 1.41-1.41-5.97-5.97z" /></svg>
                        )}
                    </button>
                    <button
                        onClick={toggleVideo}
                        className={`w-12 h-12 flex items-center justify-center border-4 border-black transition-all ${isVideoEnabled ? 'bg-neo-cyan hover:bg-neo-cyan/80' : 'bg-neo-pink text-black'}`}
                    >
                        {isVideoEnabled ? (
                            <svg className="w-6 h-6" fill="black" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" /></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="black" viewBox="0 0 24 24"><path d="M18 10.48V6c0-1.1-.9-2-2-2H6.83l2 2H16v7.17l2 2v-4.69zM4.27 3L3 4.27l2.85 2.85L5 8v10c0 1.1.9 2 2 2h10c.22 0 .44-.04.64-.12l2.09 2.09L21 20.73 4.27 3z" /></svg>
                        )}
                    </button>
                    <div className="w-1 h-8 bg-black"></div>
                    <button
                        onClick={handleEndNight}
                        className="bg-neo-pink text-white border-4 border-black px-6 h-12 font-black uppercase tracking-widest shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5"
                    >
                        Exit
                    </button>
                </div>
            </div>
        </div>
    );
}

function RemoteVideo({ stream }: { stream: MediaStream }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            const playVideo = async () => {
                try {
                    await videoRef.current?.play();
                    setIsPlaying(true);
                } catch (err) {
                    console.error('Error playing remote video:', err);
                    setIsPlaying(false);
                }
            };
            playVideo();

            const handleTrackEnded = () => {
                setIsPlaying(false);
            };

            stream.getTracks().forEach(track => {
                track.addEventListener('ended', handleTrackEnded);
            });

            return () => {
                stream.getTracks().forEach(track => {
                    track.removeEventListener('ended', handleTrackEnded);
                });
            };
        }
    }, [stream]);

    return (
        <>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
            />
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-neo-cyan border-t-transparent animate-spin mb-4 mx-auto"></div>
                        <span className="text-xs text-white font-black uppercase tracking-widest">Reconnecting...</span>
                    </div>
                </div>
            )}
        </>
    );
}
