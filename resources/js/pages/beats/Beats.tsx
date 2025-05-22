import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Galactic Beats',
        href: '/beats',
    },
];

export default function Beats() {
    const playSound = (url: string) => {
        const audio = new Audio(url);
        audio.play();
    };

    const sounds = [
        { name: "🚀 Kick", color: "bg-purple-900", sound: '/sounds/kick.wav' },
        { name: "🌌 Snare", color: "bg-blue-900", sound: '/sounds/snare.wav' },
        { name: "🪐 Hi-Hat", color: "bg-indigo-900", sound: '/sounds/hihat.wav' },
        { name: "☄️ Crash", color: "bg-red-900", sound: '/sounds/crash.wav' },
        { name: "🌠 Clap", color: "bg-teal-900", sound: '/sounds/clap.wav' },
        { name: "✨ Tom", color: "bg-pink-900", sound: '/sounds/tom.wav' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Galactic Beats" />
            <div className="relative h-full min-h-screen bg-gray-900 overflow-hidden">
                {/* Uzay arkaplan efektleri */}
                <div className="absolute inset-0 z-0">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white opacity-80"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: `${Math.random() * 3 + 1}px`,
                                height: `${Math.random() * 3 + 1}px`,
                                animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold text-white mb-4 animate-pulse">
                            Galactic <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Beats</span>
                        </h1>
                        <p className="text-xl text-gray-300">Explore cosmic sound patterns</p>
                        <p className="text-sm text-gray-500">Click on the celestial bodies to play sounds</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl w-full">
                        {sounds.map((sound, index) => (
                            <button
                                key={index}
                                onClick={() => playSound(sound.sound)}
                                className={`${sound.color} p-8 rounded-full hover:scale-105 transition-all duration-300 transform
                                shadow-lg hover:shadow-xl border-2 border-opacity-20 border-white relative overflow-hidden`}
                            >
                                <span className="text-3xl">{sound.name.split(' ')[0]}</span>
                                <span className="block text-sm mt-2 font-light opacity-80">{sound.name.split(' ')[1]}</span>

                                {/* Buton içi uzay efekti */}
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent animate-spin-slow"
                                         style={{ transformOrigin: '50% 50%', width: '200%', height: '200%', left: '-50%', top: '-50%' }} />
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-16 text-gray-400 text-sm">
                        <p>Click on celestial bodies to play sounds</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-gray-500">
                        <p>© 2023 Galactic Beats. All rights reserved.</p>
                        <p>Made with love in the cosmos</p>
                    </div>
                </div>
            </div>

            {/* Animasyon stilleri */}
            <style jsx>{`
                @keyframes twinkle {
                    0% { opacity: 0.2; }
                    100% { opacity: 1; }
                }
                @keyframes spin-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
            `}</style>
        </AppLayout>
    );
}
