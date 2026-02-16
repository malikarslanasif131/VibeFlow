import { useState, useCallback, useRef, useEffect } from 'react';
import { moods, Quote } from './data/moodData';
import MoodSelector from './components/MoodSelector';
import QuoteDisplay from './components/QuoteDisplay';
import GenerateButton from './components/GenerateButton';
import BackgroundLayer from './components/BackgroundLayer';

// ─────────────────────────────────────────────────────────
// Music Library Imports
// Explicitly importing all assets as requested
// ─────────────────────────────────────────────────────────
import happy1 from './assets/music/happy1.mp3';
import happy2 from './assets/music/happy2.mp3';
import chill1 from './assets/music/chillMusic1.mp3';
import chill2 from './assets/music/chillMusic2.mp3';
import motivated1 from './assets/music/motivatedMusic1.mp3';
import motivated2 from './assets/music/motivatedMusic2.mp3';
import sad1 from './assets/music/sadMusic1.mp3';
import sad2 from './assets/music/sadMusic2.mp3';
import angry1 from './assets/music/angry1.mp3';
import angry2 from './assets/music/angry2.mp3';
import romantic1 from './assets/music/romantic1.mp3';
import romantic2 from './assets/music/romantic2.mp3';
import tired1 from './assets/music/tired1.mp3';
import tired2 from './assets/music/tired2.mp3';
import focused1 from './assets/music/focused1.mp3';
import focused2 from './assets/music/focused2.mp3';
import nostalgic1 from './assets/music/nostalgic1.mp3';
import nostalgic2 from './assets/music/nostalgic2.mp3';
import adventurous1 from './assets/music/adventurous1.mp3';
import adventurous2 from './assets/music/adventurous2.mp3';

// Mood-to-Music Map (Explicit Arrays)
const moodTracks: Record<string, string[]> = {
    happy: [happy1, happy2],
    chill: [chill1, chill2],
    motivated: [motivated1, motivated2],
    sad: [sad1, sad2],
    angry: [angry1, angry2],
    romantic: [romantic1, romantic2],
    tired: [tired1, tired2],
    focused: [focused1, focused2],
    nostalgic: [nostalgic1, nostalgic2],
    adventurous: [adventurous1, adventurous2],
};

function getRandomQuote(moodId: string): Quote | null {
    const mood = moods.find((m) => m.id === moodId);
    if (!mood) return null;
    const index = Math.floor(Math.random() * mood.quotes.length);
    return mood.quotes[index];
}

/**
 * Build a Picsum wallpaper URL from the mood's seed.
 * picsum.photos/seed/{seed}/{w}/{h} returns a deterministic high-quality
 * photo for each unique seed string — no API key needed.
 *
 * On mobile (portrait screens) we request 1080×1920 so the image fills
 * the screen without extreme cropping. On desktop we use 1920×1080.
 *
 * When `bust` is 0 we use the base seed (matches the preloaded version).
 * When `bust` > 0 we append it so "Generate Vibe" pulls a fresh variant.
 */
function isMobileScreen(): boolean {
    return typeof window !== 'undefined' && window.innerWidth < 768;
}

function getPicsumUrl(seed: string, bust: number = 0): string {
    const finalSeed = bust === 0 ? seed : `${seed}-${bust}`;
    const [w, h] = isMobileScreen() ? [1080, 1920] : [1920, 1080];
    return `https://picsum.photos/seed/${finalSeed}/${w}/${h}`;
}

export default function App() {
    const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);
    const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
    const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
    const [animationKey, setAnimationKey] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Audio State
    const [isMuted, setIsMuted] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Track whether this is the first time a mood is selected (use preloaded)
    // vs. a re-generate (needs a unique cache-busted URL)
    const seenMoodsRef = useRef<Set<string>>(new Set());
    const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ─────────────────────────────────────────────────────────
    // 0. Initialize Audio Ref & Playlist Logic
    // ─────────────────────────────────────────────────────────

    // Keep a ref to selectedMoodId so the event listener can access the latest value
    // without needing to be re-bound on every change.
    const selectedMoodIdRef = useRef<string | null>(null);
    useEffect(() => { selectedMoodIdRef.current = selectedMoodId; }, [selectedMoodId]);

    useEffect(() => {
        // Initialize Audio
        audioRef.current = new Audio();
        audioRef.current.volume = 0.5;
        audioRef.current.loop = false; // Playlist mode (handled by 'ended' listener)

        const handleTrackEnd = () => {
            const currentMoodId = selectedMoodIdRef.current;
            if (!currentMoodId || !moodTracks[currentMoodId]) return;

            const tracks = moodTracks[currentMoodId];
            if (tracks.length === 0) return;

            // When track ends, find the next one in the mood's playlist
            setCurrentTrack(prevTrack => {
                if (!prevTrack) return tracks[0];

                // Find index of current track.
                // Note: import.meta.glob returns /src/assets/..., so we check inclusion.
                const idx = tracks.findIndex(t => prevTrack.includes(t) || t.includes(prevTrack));
                const nextIdx = (idx + 1) % tracks.length;
                return tracks[nextIdx];
            });
        };

        audioRef.current.addEventListener('ended', handleTrackEnd);

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('ended', handleTrackEnd);
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // ─────────────────────────────────────────────────────────
    // 1. PRELOAD all 10 mood images on app start
    // ─────────────────────────────────────────────────────────
    useEffect(() => {
        moods.forEach((mood) => {
            const img = new Image();
            img.src = getPicsumUrl(mood.picsumSeed, 0);
        });
    }, []);

    const selectedMood = moods.find((m) => m.id === selectedMoodId);
    const currentGradient = selectedMood?.gradient ?? 'from-violet-600 via-purple-600 to-indigo-700';

    // ─────────────────────────────────────────────────────────
    // 2. Audio Control Logic
    //    Updates when currentTrack changes or mute state toggles
    // ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (!currentTrack || !hasInteracted || !audioRef.current) return;

        const audio = audioRef.current;

        // If specific mood music needs to change
        if (!audio.src.includes(currentTrack)) {
            // Simple fade out/in effect
            const fadeOut = setInterval(() => {
                if (audio.volume > 0.05) {
                    audio.volume -= 0.05;
                } else {
                    clearInterval(fadeOut);
                    audio.pause();
                    audio.src = currentTrack;
                    audio.load();
                    if (!isMuted) {
                        audio.play().catch((e) => console.log("Autoplay prevented:", e));
                        // Fade in
                        audio.volume = 0;
                        const fadeIn = setInterval(() => {
                            if (audio.volume < 0.45) { // Target 0.5
                                audio.volume += 0.05;
                            } else {
                                clearInterval(fadeIn);
                            }
                        }, 100);
                    } else {
                        // Restore volume for potential future unmute
                        audio.volume = 0.5;
                    }
                }
            }, 50);
        } else {
            // Same track, just handle mute/unmute
            if (isMuted) {
                audio.pause();
            } else {
                audio.play().catch((e) => console.log("Autoplay prevented:", e));
                // Ensure volume is set (in case it was faded out)
                audio.volume = 0.5;
            }
        }
    }, [currentTrack, isMuted, hasInteracted]);

    // Handle mood change -> pick random track
    useEffect(() => {
        if (selectedMoodId && moodTracks[selectedMoodId]) {
            const tracks = moodTracks[selectedMoodId];
            if (tracks.length > 0) {
                // Pick a random track from the mood's playlist
                const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
                setCurrentTrack(randomTrack);
            }
        }
    }, [selectedMoodId]);

    // Handle mute toggle
    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    // ─────────────────────────────────────────────────────────
    // 3. triggerVibe — the core generate function
    //    • Shows a loading spinner
    //    • Picks a random quote immediately (feels instant)
    //    • On FIRST selection of a mood → uses base seed (already preloaded)
    //    • On re-generate of the same mood → uses cache-busted seed for variety
    //    • Waits 500ms minimum, then reveals the wallpaper
    // ─────────────────────────────────────────────────────────
    const triggerVibe = useCallback((moodId: string) => {
        // Mark user interaction for audio autoplay
        setHasInteracted(true);

        const mood = moods.find((m) => m.id === moodId);
        if (!mood) return;

        // Clear any pending timer from a rapid re-click
        if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);

        setIsLoading(true);

        // Quote appears instantly — no reason to delay text
        const quote = getRandomQuote(moodId);
        setCurrentQuote(quote);

        // Decide whether to use preloaded URL or a fresh one
        const isFirstTime = !seenMoodsRef.current.has(moodId);
        const bust = isFirstTime ? 0 : Date.now();
        const url = getPicsumUrl(mood.picsumSeed, bust);
        seenMoodsRef.current.add(moodId);

        if (isFirstTime) {
            // Image is already cached from preload — short 300ms spinner for polish,
            // then reveal instantly from cache
            loadingTimerRef.current = setTimeout(() => {
                setBackgroundUrl(url);
                setAnimationKey((prev) => prev + 1);
                setIsLoading(false);
            }, 300);
        } else {
            // Fresh URL — preload it, then reveal (with a 500ms minimum delay
            // so the spinner doesn't flash imperceptibly)
            const start = Date.now();
            const img = new Image();
            img.src = url;

            const reveal = () => {
                const elapsed = Date.now() - start;
                const remaining = Math.max(0, 500 - elapsed);
                loadingTimerRef.current = setTimeout(() => {
                    setBackgroundUrl(url);
                    setAnimationKey((prev) => prev + 1);
                    setIsLoading(false);
                }, remaining);
            };

            img.onload = reveal;
            img.onerror = reveal; // still reveal gradient fallback
        }
    }, []);

    const handleSelectMood = useCallback((moodId: string) => {
        setSelectedMoodId(moodId);
        triggerVibe(moodId);
    }, [triggerVibe]);

    const handleGenerate = useCallback(() => {
        if (!selectedMoodId) return;
        triggerVibe(selectedMoodId);
    }, [selectedMoodId, triggerVibe]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
        };
    }, []);

    return (
        <>
            <BackgroundLayer
                imageUrl={backgroundUrl}
                gradient={currentGradient}
                animationKey={animationKey}
                isLoading={isLoading}
            />

            <main className="relative z-10 h-screen w-full flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-12 gap-4 sm:gap-10 overflow-y-auto no-scrollbar">
                {/* Header */}
                <header className="text-center animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                        What&rsquo;s your{' '}
                        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                            vibe
                        </span>{' '}
                        today?
                    </h1>
                    <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-white/40 font-light tracking-wide max-w-md mx-auto">
                        Pick a mood. Get inspired. Feel the aesthetic.
                    </p>
                </header>

                {/* Mood Selection Grid */}
                <section className="w-full animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <MoodSelector
                        moods={moods}
                        selectedMoodId={selectedMoodId}
                        onSelectMood={handleSelectMood}
                    />
                </section>

                {/* Generate Button */}
                <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <GenerateButton
                        onClick={handleGenerate}
                        disabled={!selectedMoodId || isLoading}
                    />
                </div>

                {/* Quote Display */}
                <section className="w-full min-h-[140px] sm:min-h-[180px] flex items-center justify-center">
                    <QuoteDisplay quote={currentQuote} animationKey={animationKey} />
                </section>

                {/* Footer */}
                <footer className="mt-auto pt-8">
                    <p className="text-xs text-white/20 tracking-widest uppercase">
                        Vibe Wallpaper + Quote &middot; {new Date().getFullYear()}
                    </p>
                </footer>
            </main>

            {/* Floating Mute Button */}
            {hasInteracted && selectedMoodId && (
                <button
                    onClick={toggleMute}
                    className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 shadow-lg group"
                    aria-label={isMuted ? "Unmute music" : "Mute music"}
                >
                    {isMuted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 5L6 9H2v6h4l5 4V5z" />
                            <line x1="23" x2="17" y1="9" y2="15" />
                            <line x1="17" x2="23" y1="9" y2="15" />
                        </svg>
                    ) : (
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                            </svg>
                            {/* Dynamic Equalizer Effect */}
                            <div className="absolute top-1/2 -translate-y-1/2 right-0 flex gap-0.5 items-end h-3">
                                <span className="w-0.5 bg-white/90 rounded-full animate-equalizer" style={{ animationDelay: '0s' }} />
                                <span className="w-0.5 bg-white/90 rounded-full animate-equalizer" style={{ animationDelay: '0.2s' }} />
                                <span className="w-0.5 bg-white/90 rounded-full animate-equalizer" style={{ animationDelay: '0.4s' }} />
                            </div>
                        </div>
                    )}
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/60 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {isMuted ? 'Unmute' : 'Mood Music Playing'}
                    </span>
                </button>
            )}
        </>
    );
}
