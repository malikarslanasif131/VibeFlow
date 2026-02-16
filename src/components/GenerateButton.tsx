interface GenerateButtonProps {
    onClick: () => void;
    disabled: boolean;
}

export default function GenerateButton({ onClick, disabled }: GenerateButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            id="generate-vibe-btn"
            className={`
        relative group px-6 py-3 sm:px-8 sm:py-3.5 rounded-full
        font-semibold text-sm sm:text-base tracking-wide
        transition-all duration-300 ease-out
        overflow-hidden
        ${disabled
                    ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                    : 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 active:scale-95 cursor-pointer'
                }
      `}
            aria-label="Generate a vibe with a quote and wallpaper"
        >
            {/* Shimmer effect on hover */}
            {!disabled && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer bg-[length:200%_100%] transition-opacity duration-300" />
            )}

            <span className="relative flex items-center gap-2">
                <span className="text-lg">✨</span>
                <span>Generate Vibe</span>
            </span>
        </button>
    );
}
