import { useState, useEffect } from 'react';

interface BackgroundLayerProps {
    imageUrl: string | null;
    gradient: string;
    animationKey: number;
    isLoading: boolean;
}

export default function BackgroundLayer({ imageUrl, gradient, animationKey, isLoading }: BackgroundLayerProps) {
    const [loaded, setLoaded] = useState(false);
    const [displaySrc, setDisplaySrc] = useState<string | null>(null);

    useEffect(() => {
        if (!imageUrl) {
            setLoaded(false);
            setDisplaySrc(null);
            return;
        }

        // Reset and preload the new image
        setLoaded(false);
        setDisplaySrc(null);           // ← clear old image immediately
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            setDisplaySrc(imageUrl);   // only show once fully loaded
            setLoaded(true);
        };
        img.onerror = () => {
            setLoaded(false);
            setDisplaySrc(null);
        };

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [imageUrl]);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden">
            {/* 1. Base dark background — always present */}
            <div className="absolute inset-0 bg-[#0a0a0f]" />

            {/* 2. Mood gradient layer — fallback / accent color */}
            <div
                key={`gradient-${animationKey}`}
                className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 animate-fade-in-slow transition-all duration-1000`}
            />

            {/*
             * 3. Wallpaper layer
             *    Uses an <img> with object-fit:cover instead of CSS backgroundImage
             *    for more reliable rendering on mobile browsers (especially iOS Safari).
             *    The old image is cleared immediately so only ONE is ever visible.
             */}
            {displaySrc && (
                <div
                    key={`img-${animationKey}`}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out overflow-hidden ${loaded ? 'opacity-50' : 'opacity-0'}`}
                >
                    <img
                        src={displaySrc}
                        alt=""
                        className="w-full h-full object-cover animate-zoom-out"
                        aria-hidden="true"
                    />
                </div>
            )}

            {/* 4. Dark gradient overlay — keeps text readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80" />

            {/* 5. Film grain for depth */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* 6. Loading spinner */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="relative">
                        <div className="absolute inset-0 w-14 h-14 rounded-full bg-white/5 animate-ping" />
                        <div className="w-12 h-12 border-[3px] border-white/10 border-t-white/60 rounded-full animate-spin" />
                    </div>
                </div>
            )}
        </div>
    );
}
