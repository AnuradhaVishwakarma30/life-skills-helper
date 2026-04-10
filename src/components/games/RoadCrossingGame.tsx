import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { GoldStarPopup } from './GoldStarPopup';

interface RoadCrossingGameProps {
  onBack: () => void;
  onComplete: () => void;
}

export const RoadCrossingGame = ({ onBack, onComplete }: RoadCrossingGameProps) => {
  const [light, setLight] = useState<'red' | 'green'>('red');
  const [crossed, setCrossed] = useState(false);
  const [showStar, setShowStar] = useState(false);
  const [shakeWarning, setShakeWarning] = useState(false);
  const roadRef = useRef<HTMLDivElement>(null);
  const characterX = useMotionValue(0);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.85;
      u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    }
  }, []);

  const playSuccessSound = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.15);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {}
  }, []);

  // Toggle traffic light every 4 seconds
  useEffect(() => {
    if (crossed) return;
    const interval = setInterval(() => {
      setLight((prev) => {
        const next = prev === 'red' ? 'green' : 'red';
        speak(next === 'green' ? 'Green light! You can cross now!' : 'Red light! Wait!');
        return next;
      });
    }, 4000);
    speak('Wait for the green light to cross the road!');
    return () => clearInterval(interval);
  }, [crossed, speak]);

  const handleDragEnd = useCallback(
    (_: any, info: { offset: { x: number } }) => {
      if (crossed) return;

      if (light === 'red') {
        setShakeWarning(true);
        speak('Stop! The light is red! Wait for green.');
        setTimeout(() => setShakeWarning(false), 800);
        return;
      }

      // If dragged far enough right (crossing the road)
      if (info.offset.x > 200) {
        playSuccessSound();
        speak('You crossed safely! Great job!');
        setCrossed(true);
        setTimeout(() => setShowStar(true), 1500);
      }
    },
    [light, crossed, playSuccessSound, speak]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-green-50 flex flex-col">
      {/* Header */}
      <header className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button
          onClick={() => {
            window.speechSynthesis?.cancel();
            onBack();
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span>Exit</span>
        </button>
        <span className="text-sm font-bold text-amber-600">🚦 Road Crossing</span>
      </header>

      {/* Traffic Light */}
      <div className="flex justify-center mb-6">
        <motion.div
          className="flex flex-col items-center gap-3 bg-gray-800 rounded-2xl p-4 shadow-xl"
          animate={shakeWarning ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className={`w-14 h-14 rounded-full border-4 ${
              light === 'red'
                ? 'bg-red-500 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)]'
                : 'bg-red-900/40 border-red-800/40'
            }`}
            animate={light === 'red' ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className={`w-14 h-14 rounded-full border-4 ${
              light === 'green'
                ? 'bg-green-500 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.6)]'
                : 'bg-green-900/40 border-green-800/40'
            }`}
            animate={light === 'green' ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <p className="text-white text-xs font-bold mt-1">
            {light === 'red' ? '🛑 STOP' : '✅ WALK'}
          </p>
        </motion.div>
      </div>

      {/* Road scene */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative">
        {/* Instruction */}
        <motion.p
          className={`text-lg font-bold mb-6 text-center ${
            light === 'red' ? 'text-red-500' : 'text-green-600'
          }`}
          key={light}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {crossed
            ? '🎉 You crossed safely!'
            : light === 'red'
            ? '🛑 Wait! Do NOT cross!'
            : '✅ Green light! Drag to cross →'}
        </motion.p>

        {/* Road */}
        <div className="w-full max-w-md relative" ref={roadRef}>
          {/* Sidewalk left */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-stone-300 rounded-l-2xl border-2 border-stone-400 flex items-center justify-center">
            <span className="text-xs font-bold text-stone-600 [writing-mode:vertical-rl] rotate-180">
              Sidewalk
            </span>
          </div>

          {/* Road surface */}
          <div className="mx-16 h-36 bg-gray-700 relative flex items-center">
            {/* Road lines */}
            <div className="absolute inset-0 flex items-center justify-around px-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-2 bg-yellow-400 rounded" />
              ))}
            </div>

            {/* Character */}
            {!crossed && (
              <motion.div
                className="absolute left-2 z-10 w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-blue-300 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-xl"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                style={{ x: characterX }}
                onDragEnd={handleDragEnd}
                whileDrag={{ scale: 1.15 }}
                animate={
                  light === 'green'
                    ? { y: [0, -4, 0] }
                    : {}
                }
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span className="text-2xl">🚶</span>
              </motion.div>
            )}

            {crossed && (
              <motion.div
                className="absolute right-2 z-10 w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-4 border-green-300 flex items-center justify-center shadow-xl"
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                <span className="text-2xl">🎉</span>
              </motion.div>
            )}
          </div>

          {/* Sidewalk right */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-stone-300 rounded-r-2xl border-2 border-stone-400 flex items-center justify-center">
            <span className="text-xs font-bold text-stone-600 [writing-mode:vertical-rl] rotate-180">
              Sidewalk
            </span>
          </div>
        </div>

        {/* Warning on red drag */}
        {shakeWarning && (
          <motion.div
            className="mt-6 bg-red-100 border-2 border-red-300 rounded-xl px-6 py-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-red-600 font-bold text-center">
              🛑 Red light! You must wait!
            </p>
          </motion.div>
        )}
      </main>

      <GoldStarPopup show={showStar} onDone={onComplete} />
    </div>
  );
};
