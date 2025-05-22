import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Nebula Beat Maker',
        href: '/beat-maker',
    },
];

const BPM = 120;
const STEPS = 16;

export default function BeatMaker() {
    const [activeStep, setActiveStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [beatMatrix, setBeatMatrix] = useState({
        kick: Array(STEPS).fill(false),
        snare: Array(STEPS).fill(false),
        hihat: Array(STEPS).fill(false),
        clap: Array(STEPS).fill(false),
    });
    const audioContextRef = useRef<AudioContext | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [bpm, setBpm] = useState(BPM);
    const [isLoading, setIsLoading] = useState(true);

    // Audio context ve sample'ları yükle
    useEffect(() => {
        const initAudio = async () => {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            setIsLoading(false);
        };

        initAudio();

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const loadSample = async (url: string) => {
        if (!audioContextRef.current) return;
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            return await audioContextRef.current.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error('Error loading sample:', error);
        }
    };

    const playSample = (buffer: AudioBuffer | undefined) => {
        if (!buffer || !audioContextRef.current) return;
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.start();
    };

    // Play/pause kontrolü
    useEffect(() => {
        if (!isPlaying) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setActiveStep(0);
            return;
        }

        const stepDuration = 60 / bpm / 4;
        intervalRef.current = setInterval(() => {
            setActiveStep(prev => (prev + 1) % STEPS);
        }, stepDuration * 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying, bpm]);

    // Adım değişikliklerini dinle
    useEffect(() => {
        if (!isPlaying || isLoading) return;

        const samples = {
            kick: '/sounds/kick.wav',
            snare: '/sounds/snare.wav',
            hihat: '/sounds/hihat.wav',
            clap: '/sounds/clap.wav',
        };

        Object.entries(beatMatrix).forEach(async ([sound, steps]) => {
            if (steps[activeStep]) {
                const buffer = await loadSample(samples[sound as keyof typeof samples]);
                playSample(buffer);
            }
        });
    }, [activeStep, isPlaying, beatMatrix, isLoading]);

    const toggleStep = (sound: keyof typeof beatMatrix, step: number) => {
        setBeatMatrix(prev => ({
            ...prev,
            [sound]: prev[sound].map((val, i) => i === step ? !val : val)
        }));
    };

    const clearAll = () => {
        setBeatMatrix({
            kick: Array(STEPS).fill(false),
            snare: Array(STEPS).fill(false),
            hihat: Array(STEPS).fill(false),
            clap: Array(STEPS).fill(false),
        });
    };

    const sounds = [
        { id: 'kick', name: 'Kick', emoji: '🚀', color: 'from-purple-500 to-indigo-600', bg: 'bg-gradient-to-br from-purple-500/20 to-indigo-600/20' },
        { id: 'snare', name: 'Snare', emoji: '🌌', color: 'from-blue-500 to-cyan-600', bg: 'bg-gradient-to-br from-blue-500/20 to-cyan-600/20' },
        { id: 'hihat', name: 'Hi-Hat', emoji: '🪐', color: 'from-emerald-500 to-teal-600', bg: 'bg-gradient-to-br from-emerald-500/20 to-teal-600/20' },
        { id: 'clap', name: 'Clap', emoji: '✨', color: 'from-pink-500 to-rose-600', bg: 'bg-gradient-to-br from-pink-500/20 to-rose-600/20' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* <Head title="Nebula Beat Maker" /> */}
            <div className="relative h-full min-h-screen bg-gray-900 overflow-hidden">
                {/* Uzay efekti */}
                <div className="fixed inset-0 z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-purple-900/20 to-gray-950"></div>
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white animate-pulse"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: `${Math.random() * 4 + 1}px`,
                                height: `${Math.random() * 4 + 1}px`,
                                opacity: Math.random() * 0.8 + 0.2,
                                animationDuration: `${Math.random() * 5 + 3}s`,
                                animationDelay: `${Math.random() * 2}s`
                            }}
                        />
                    ))}
                    <div className="absolute inset-0 bg-[url('https://assets.codepen.io/13471/sparkles.gif')] opacity-10 mix-blend-screen"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
                    <div className="text-center mb-8 sm:mb-12">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">Galactic</span> Beat Maker
                        </h1>
                        <p className="text-gray-400 text-sm sm:text-base">Create interstellar rhythms</p>
                    </div>

                    <div className="w-full max-w-4xl">
                        {/* Kontroller */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className={`px-5 py-2.5 rounded-full font-medium text-white transition-all flex items-center gap-2
                                        ${isPlaying ?
                                            'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30' :
                                            'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30'}
                                        shadow-lg hover:shadow-xl transform hover:scale-105
                                    `}
                                >
                                    {isPlaying ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
                                            </svg>
                                            Stop
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                            </svg>
                                            Play
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={clearAll}
                                    className="px-5 py-2.5 rounded-full font-medium text-white bg-gradient-to-br from-gray-600 to-gray-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M2.515 10.674a1.875 1.875 0 000 2.652L8.89 19.7c.352.351.829.549 1.326.549H19.5a3 3 0 003-3V6.75a3 3 0 00-3-3h-9.284c-.497 0-.974.198-1.326.55l-6.375 6.374zM12.53 9.22a.75.75 0 10-1.06 1.06L13.19 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L15.31 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" clipRule="evenodd" />
                                    </svg>
                                    Clear
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="text-gray-300 text-sm">BPM: {bpm}</label>
                                <input
                                    type="range"
                                    min="60"
                                    max="180"
                                    value={bpm}
                                    onChange={(e) => setBpm(parseInt(e.target.value))}
                                    className="w-24 accent-purple-500"
                                />
                            </div>
                        </div>

                        {/* Beat grid */}
                        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border border-gray-700/50">
                            <div className="grid grid-cols-17 gap-1.5 mb-3">
                                <div className="rounded-md flex items-center justify-center"></div>
                                {Array.from({ length: STEPS }).map((_, i) => (
                                    <div key={`header-${i}`} className={`text-center text-xs sm:text-sm font-mono ${
                                        activeStep === i && isPlaying ? 'text-yellow-400 font-bold' : 'text-gray-400'
                                    }`}>
                                        {i + 1}
                                    </div>
                                ))}
                            </div>

                            {sounds.map((sound) => (
                                <div key={sound.id} className="grid grid-cols-17 gap-1.5 mb-3">
                                    <div className={`rounded-md flex items-center justify-center gap-2 text-white font-medium px-2 ${
                                        beatMatrix[sound.id as keyof typeof beatMatrix].some(Boolean) ?
                                        `bg-gradient-to-r ${sound.color} shadow-md` : 'bg-gray-700/50'
                                    }`}>
                                        <span className="text-lg">{sound.emoji}</span>
                                        <span className="hidden sm:inline">{sound.name}</span>
                                    </div>
                                    {Array.from({ length: STEPS }).map((_, i) => (
                                        <button
                                            key={`${sound.id}-${i}`}
                                            onClick={() => toggleStep(sound.id as keyof typeof beatMatrix, i)}
                                            className={`w-full aspect-square rounded-md transition-all duration-100 ease-out ${
                                                beatMatrix[sound.id as keyof typeof beatMatrix][i] ?
                                                `bg-gradient-to-br ${sound.color} shadow-md` :
                                                'bg-gray-700/70 hover:bg-gray-600/70'
                                            } ${
                                                activeStep === i && isPlaying ? 'ring-2 ring-yellow-400/80 ring-offset-1 ring-offset-gray-800' : ''
                                            }`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 text-center text-gray-400 text-xs sm:text-sm">
                        <p>Click on the pads to create your pattern • Adjust BPM to change tempo</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
