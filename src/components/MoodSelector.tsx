import { Mood } from '../data/moodData';

interface MoodSelectorProps {
    moods: Mood[];
    selectedMoodId: string | null;
    onSelectMood: (moodId: string) => void;
}

export default function MoodSelector({ moods, selectedMoodId, onSelectMood }: MoodSelectorProps) {
    return (
        <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-5 gap-1.5 sm:gap-3 w-full max-w-3xl mx-auto px-1 sm:px-0">
            {moods.map((mood) => {
                const isSelected = selectedMoodId === mood.id;
                return (
                    <button
                        key={mood.id}
                        onClick={() => onSelectMood(mood.id)}
                        className={`
              group relative flex flex-col items-center justify-center gap-0.5 sm:gap-1.5
              px-1.5 py-2 sm:px-4 sm:py-4 rounded-lg sm:rounded-2xl
              transition-all duration-300 ease-out cursor-pointer
              ${isSelected
                                ? 'glass-strong ring-2 ring-white/30 scale-105 shadow-lg shadow-white/5'
                                : 'glass hover:bg-white/10 hover:scale-[1.03]'
                            }
            `}
                        aria-label={`Select ${mood.label} mood`}
                        id={`mood-${mood.id}`}
                    >
                        <span
                            className={`text-xl sm:text-3xl transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'
                                }`}
                        >
                            {mood.emoji}
                        </span>
                        <span
                            className={`hidden sm:block text-xs sm:text-sm font-medium tracking-wide transition-colors duration-300 ${isSelected ? 'text-white' : 'text-white/60 group-hover:text-white/90'
                                }`}
                        >
                            {mood.label}
                        </span>
                        {isSelected && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-white/50" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
