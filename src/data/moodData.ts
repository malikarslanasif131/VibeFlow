export interface Mood {
    id: string;
    label: string;
    emoji: string;
    /** Seed keyword for https://picsum.photos/seed/{seed}/1920/1080 */
    picsumSeed: string;
    gradient: string;
    quotes: Quote[];
}

export interface Quote {
    text: string;
    author: string;
}

export const moods: Mood[] = [
    {
        id: 'happy',
        label: 'Happy',
        emoji: '😊',
        picsumSeed: 'joyful-sunrise',
        gradient: 'from-amber-400 via-orange-400 to-yellow-300',
        quotes: [
            { text: 'Happiness is not something ready-made. It comes from your own actions.', author: 'Dalai Lama' },
            { text: 'The most wasted of days is one without laughter.', author: 'E.E. Cummings' },
            { text: 'Happiness depends upon ourselves.', author: 'Aristotle' },
            { text: 'Be happy for this moment. This moment is your life.', author: 'Omar Khayyam' },
            { text: 'The purpose of our lives is to be happy.', author: 'Dalai Lama' },
            { text: 'Happiness is a warm puppy.', author: 'Charles M. Schulz' },
            { text: 'Think of all the beauty still left around you and be happy.', author: 'Anne Frank' },
        ],
    },
    {
        id: 'chill',
        label: 'Chill',
        emoji: '😌',
        picsumSeed: 'serene-forest',
        gradient: 'from-cyan-400 via-teal-400 to-emerald-400',
        quotes: [
            { text: 'Almost everything will work again if you unplug it for a few minutes, including you.', author: 'Anne Lamott' },
            { text: 'Nature does not hurry, yet everything is accomplished.', author: 'Lao Tzu' },
            { text: 'The time to relax is when you don\'t have time for it.', author: 'Sydney J. Harris' },
            { text: 'Tension is who you think you should be. Relaxation is who you are.', author: 'Chinese Proverb' },
            { text: 'Slow down and enjoy life. It\'s not only the scenery you miss by going too fast — you also miss the sense of where you are going and why.', author: 'Eddie Cantor' },
            { text: 'In the midst of movement and chaos, keep stillness inside of you.', author: 'Deepak Chopra' },
        ],
    },
    {
        id: 'motivated',
        label: 'Motivated',
        emoji: '🔥',
        picsumSeed: 'epic-mountain',
        gradient: 'from-red-500 via-orange-500 to-amber-500',
        quotes: [
            { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
            { text: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
            { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
            { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
            { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
            { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
            { text: 'Everything you\'ve ever wanted is on the other side of fear.', author: 'George Addair' },
        ],
    },
    {
        id: 'sad',
        label: 'Sad',
        emoji: '😢',
        picsumSeed: 'rainy-window',
        gradient: 'from-slate-500 via-blue-400 to-indigo-500',
        quotes: [
            { text: 'The wound is the place where the Light enters you.', author: 'Rumi' },
            { text: 'Even the darkest night will end and the sun will rise.', author: 'Victor Hugo' },
            { text: 'Tears are words that need to be written.', author: 'Paulo Coelho' },
            { text: 'The soul would have no rainbow had the eyes no tears.', author: 'John Vance Cheney' },
            { text: 'Out of suffering have emerged the strongest souls.', author: 'Kahlil Gibran' },
            { text: 'Every storm runs out of rain.', author: 'Maya Angelou' },
        ],
    },
    {
        id: 'angry',
        label: 'Angry',
        emoji: '😤',
        picsumSeed: 'stormy-sky',
        gradient: 'from-red-600 via-rose-600 to-pink-600',
        quotes: [
            { text: 'For every minute you remain angry, you give up sixty seconds of peace of mind.', author: 'Ralph Waldo Emerson' },
            { text: 'Anger is an acid that can do more harm to the vessel in which it is stored than to anything on which it is poured.', author: 'Mark Twain' },
            { text: 'Holding on to anger is like grasping a hot coal with the intent of throwing it at someone else; you are the one who gets burned.', author: 'Buddha' },
            { text: 'The best fighter is never angry.', author: 'Lao Tzu' },
            { text: 'Speak when you are angry and you will make the best speech you will ever regret.', author: 'Ambrose Bierce' },
            { text: 'When anger rises, think of the consequences.', author: 'Confucius' },
        ],
    },
    {
        id: 'romantic',
        label: 'Romantic',
        emoji: '💕',
        picsumSeed: 'candlelight-dusk',
        gradient: 'from-pink-400 via-rose-400 to-red-400',
        quotes: [
            { text: 'The best thing to hold onto in life is each other.', author: 'Audrey Hepburn' },
            { text: 'Love is composed of a single soul inhabiting two bodies.', author: 'Aristotle' },
            { text: 'In all the world, there is no heart for me like yours.', author: 'Maya Angelou' },
            { text: 'Whatever our souls are made of, his and mine are the same.', author: 'Emily Brontë' },
            { text: 'You know you\'re in love when you can\'t fall asleep because reality is finally better than your dreams.', author: 'Dr. Seuss' },
            { text: 'I have waited for this opportunity for more than half a century, to repeat to you once again my vow of eternal fidelity and everlasting love.', author: 'Gabriel García Márquez' },
        ],
    },
    {
        id: 'tired',
        label: 'Tired',
        emoji: '😴',
        picsumSeed: 'cozy-bed',
        gradient: 'from-indigo-500 via-purple-500 to-violet-600',
        quotes: [
            { text: 'Rest when you\'re weary. Refresh and renew yourself, your body, your mind, your spirit. Then get back to work.', author: 'Ralph Marston' },
            { text: 'It\'s okay to be a glowstick; sometimes we need to break before we shine.', author: 'Jadah Sellner' },
            { text: 'Take rest; a field that has rested gives a bountiful crop.', author: 'Ovid' },
            { text: 'Your calm mind is the ultimate weapon against your challenges.', author: 'Bryant McGill' },
            { text: 'Sometimes the most productive thing you can do is relax.', author: 'Mark Black' },
            { text: 'Sleep is the best meditation.', author: 'Dalai Lama' },
        ],
    },
    {
        id: 'focused',
        label: 'Focused',
        emoji: '🎯',
        picsumSeed: 'minimal-desk',
        gradient: 'from-blue-500 via-cyan-500 to-teal-500',
        quotes: [
            { text: 'Concentrate all your thoughts upon the work at hand. The sun\'s rays do not burn until brought to a focus.', author: 'Alexander Graham Bell' },
            { text: 'The successful warrior is the average man, with laser-like focus.', author: 'Bruce Lee' },
            { text: 'Where focus goes, energy flows.', author: 'Tony Robbins' },
            { text: 'It is during our darkest moments that we must focus to see the light.', author: 'Aristotle' },
            { text: 'You can always find a distraction if you\'re looking for one.', author: 'Tom Kite' },
            { text: 'Starve your distractions, feed your focus.', author: 'Daniel Goleman' },
        ],
    },
    {
        id: 'nostalgic',
        label: 'Nostalgic',
        emoji: '🥹',
        picsumSeed: 'vintage-film',
        gradient: 'from-amber-500 via-orange-400 to-rose-400',
        quotes: [
            { text: 'We do not remember days, we remember moments.', author: 'Cesare Pavese' },
            { text: 'Nostalgia is a file that removes the rough edges from the good old days.', author: 'Doug Larson' },
            { text: 'Sometimes you will never know the value of a moment until it becomes a memory.', author: 'Dr. Seuss' },
            { text: 'The past beats inside me like a second heart.', author: 'John Banville' },
            { text: 'Memory is the diary we all carry about with us.', author: 'Oscar Wilde' },
            { text: 'Nothing is ever really lost to us as long as we remember it.', author: 'L.M. Montgomery' },
        ],
    },
    {
        id: 'adventurous',
        label: 'Adventurous',
        emoji: '🌍',
        picsumSeed: 'wild-trail',
        gradient: 'from-emerald-400 via-teal-400 to-cyan-500',
        quotes: [
            { text: 'Life is either a daring adventure or nothing at all.', author: 'Helen Keller' },
            { text: 'Adventure is worthwhile in itself.', author: 'Amelia Earhart' },
            { text: 'The biggest adventure you can take is to live the life of your dreams.', author: 'Oprah Winfrey' },
            { text: 'Not all those who wander are lost.', author: 'J.R.R. Tolkien' },
            { text: 'Jobs fill your pocket, but adventures fill your soul.', author: 'Jaime Lyn Beatty' },
            { text: 'To live will be an awfully big adventure.', author: 'J.M. Barrie' },
            { text: 'Twenty years from now you will be more disappointed by the things you didn\'t do than by the ones you did do.', author: 'Mark Twain' },
        ],
    },
];
