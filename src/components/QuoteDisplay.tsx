import { Quote } from '../data/moodData';

interface QuoteDisplayProps {
    quote: Quote | null;
    animationKey: number;
}

export default function QuoteDisplay({ quote, animationKey }: QuoteDisplayProps) {
    if (!quote) return null;

    return (
        <div
            key={animationKey}
            className="animate-fade-in-up text-center max-w-2xl mx-auto px-6 sm:px-4"
        >
            <div className="relative">
                {/* Opening quote mark — hidden on very small screens to avoid overflow */}
                <span className="hidden sm:block absolute -top-8 -left-2 text-6xl md:text-7xl text-white/10 font-serif select-none leading-none">
                    &ldquo;
                </span>

                <p className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed text-white/95 font-light italic tracking-wide">
                    {quote.text}
                </p>

                {/* Closing quote mark — hidden on very small screens */}
                <span className="hidden sm:block absolute -bottom-12 -right-2 text-6xl md:text-7xl text-white/10 font-serif select-none leading-none">
                    &rdquo;
                </span>
            </div>

            <div className="mt-5 sm:mt-8 flex items-center justify-center gap-3">
                <span className="w-8 h-px bg-white/30" />
                <p className="text-sm sm:text-base md:text-lg text-white/60 font-light tracking-widest uppercase">
                    {quote.author}
                </p>
                <span className="w-8 h-px bg-white/30" />
            </div>
        </div>
    );
}
