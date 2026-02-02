import React from 'react';
import Head from 'next/head';
import NeoCard from '../components/NeoCard';

const NeoBrutalismShowcase = () => {
    return (
        <div className="min-h-screen bg-[#FFF5F7] p-8 font-mono">
            <Head>
                <title>Neo-Brutalism UI Showcase</title>
            </Head>

            <header className="mb-12">
                <h1 className="text-6xl font-black uppercase tracking-tighter border-b-8 border-black pb-4 mb-4">
                    Neo-Brutalism Card UI
                </h1>
                <p className="text-xl font-bold bg-neo-yellow p-4 border-4 border-black inline-block">
                    Minimal. Playful. Bold.
                </p>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {/* Basic Card */}
                <NeoCard title="Standard Card" bgColor="bg-white">
                    <p className="text-lg">This is a standard Neo-Brutalism card with a white background and a header.</p>
                    <button className="mt-6 px-6 py-3 border-4 border-black bg-neo-cyan font-bold uppercase shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                        Action Button
                    </button>
                </NeoCard>

                {/* Playful Yellow Card */}
                <NeoCard bgColor="bg-neo-yellow" className="rotate-1">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-3xl font-black italic">WAKEY WAKEY!</h2>
                        <p className="font-bold">Cards can be rotated slightly for a more playful, chaotic feel that is characteristic of neo-brutalism.</p>
                    </div>
                </NeoCard>

                {/* Pink Interactive Card */}
                <NeoCard
                    bgColor="bg-neo-pink"
                    onClick={() => alert('Clicked!')}
                    className="-rotate-1"
                >
                    <div className="text-white">
                        <h2 className="text-3xl font-black uppercase mb-4">Click Me</h2>
                        <p className="text-lg">This whole card is interactive. Notice the shadow shift and scale change when you click or hover.</p>
                    </div>
                </NeoCard>

                {/* Cyan Card with Image Placeholder */}
                <NeoCard bgColor="bg-neo-cyan" title="With Image">
                    <div className="w-full h-48 bg-black border-4 border-black mb-4 flex items-center justify-center text-white font-black text-2xl">
                        IMAGE AREA
                    </div>
                    <p className="font-bold">Neo-brutalism loves high contrast images and bold boundaries.</p>
                </NeoCard>

                {/* Green Success Card */}
                <NeoCard bgColor="bg-neo-green" className="lg:col-span-2">
                    <div className="flex items-center gap-8">
                        <div className="text-6xl font-black">!</div>
                        <div>
                            <h2 className="text-4xl font-black uppercase mb-2">Notice Me</h2>
                            <p className="text-xl font-bold">A wide card layout. Perfect for banners or important announcements in your app.</p>
                        </div>
                    </div>
                </NeoCard>

                {/* Dark Mode Style */}
                <NeoCard bgColor="bg-black" className="text-white border-neo-white">
                    <h2 className="text-3xl font-black uppercase text-neo-green mb-4">Dark Style</h2>
                    <p className="font-bold opacity-80">Even in black, the high-contrast borders and shadows stand out.</p>
                    <div className="mt-8 flex gap-4">
                        <div className="w-8 h-8 bg-neo-pink border-2 border-neo-white"></div>
                        <div className="w-8 h-8 bg-neo-cyan border-2 border-neo-white"></div>
                        <div className="w-8 h-8 bg-neo-yellow border-2 border-neo-white"></div>
                    </div>
                </NeoCard>
            </main>

            <footer className="mt-20 pt-8 border-t-8 border-black text-center">
                <p className="font-black text-2xl uppercase">Build Awesome Things.</p>
            </footer>
        </div>
    );
};

export default NeoBrutalismShowcase;
