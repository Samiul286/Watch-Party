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
                    Neo-Brutalism UI
                </h1>
                <p className="text-xl font-bold bg-neo-yellow p-4 border-4 border-black inline-block">
                    Standard vs. Minimal & Playful
                </p>
            </header>

            <main className="space-y-16">
                {/* Minimal & Playful Section */}
                <section>
                    <h2 className="text-4xl font-black uppercase mb-8 flex items-center gap-4">
                        <span className="bg-neo-pink text-white px-3 py-1 border-4 border-black rounded-xl">NEW</span>
                        Minimal & Playful
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        <NeoCard
                            variant="playful"
                            title="Playful Card"
                            bgColor="bg-white"
                            animateOnHover={true}
                        >
                            <p className="text-lg">Rounded corners and a subtle wiggle animation make this feel much more playful and "bouncy".</p>
                        </NeoCard>

                        <NeoCard
                            variant="playful"
                            bgColor="bg-neo-cyan"
                            className="rotate-1"
                            animateOnHover={true}
                        >
                            <h3 className="text-2xl font-black uppercase mb-2">Bouncy Cyan</h3>
                            <p className="font-bold text-white">The border radius is quite large, giving it a modern app feel while keeping the brutalist edge.</p>
                        </NeoCard>

                        <NeoCard
                            variant="playful"
                            bgColor="bg-neo-green"
                            onClick={() => { }}
                            animateOnHover={true}
                        >
                            <h3 className="text-2xl font-black uppercase mb-2">Interactive</h3>
                            <p className="font-bold">Click this card! It has the same shadow logic but with rounded aesthetics.</p>
                            <div className="mt-4 flex gap-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-white shadow-neo-sm"></div>
                                ))}
                            </div>
                        </NeoCard>
                    </div>
                </section>

                <hr className="border-t-8 border-black border-dashed opacity-20" />

                {/* Standard Neo-Brutalism Section */}
                <section>
                    <h2 className="text-4xl font-black uppercase mb-8">Standard Brutalist</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 opacity-80">
                        <NeoCard title="Standard Card" bgColor="bg-white">
                            <p className="text-lg">The classic square-edged look with heavy shadows.</p>
                            <button className="mt-6 px-6 py-3 border-4 border-black bg-neo-cyan font-bold uppercase shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                                Action Button
                            </button>
                        </NeoCard>

                        <NeoCard bgColor="bg-black" className="text-white">
                            <h3 className="text-2xl font-black uppercase text-neo-yellow mb-2">Dark Mode</h3>
                            <p className="font-bold opacity-80">High contrast, sharp edges, and deep shadows define the original style.</p>
                        </NeoCard>

                        <NeoCard bgColor="bg-neo-pink">
                            <h3 className="text-2xl font-black uppercase text-white mb-2">Loud & Bold</h3>
                            <p className="font-bold text-white">Strong colors and no-nonsense geometry.</p>
                        </NeoCard>
                    </div>
                </section>
            </main>

            <footer className="mt-20 pt-8 border-t-8 border-black text-center">
                <p className="font-black text-2xl uppercase">Build Awesome Things.</p>
            </footer>
        </div>
    );
};

export default NeoBrutalismShowcase;
