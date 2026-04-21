import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { GoldStarPopup } from './GoldStarPopup';
import { incrementViews } from '../../utils/storage';

interface RoadCrossingGameProps {
  onBack: () => void;
  onComplete: () => void;
}

/**
 * REVERSE LOGIC road-crossing game (cognitive challenge):
 *   • RED light  → MOVE button is correct (success: walking animation + Good Job!)
 *   • GREEN light → MOVE button is WRONG (warning modal: Wait/Stop)
 * Header reminder: "In this level, Red means GO and Green means STOP!"
 */
export const RoadCrossingGame = ({ onBack, onComplete }: RoadCrossingGameProps) => {
  const [light, setLight] = useState<'red' | 'green'>('red');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showStar, setShowStar] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

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

  const playBuzzer = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {}
  }, []);

  // Mount: announce reverse rule + register view
  useEffect(() => {
    incrementViews('road-crossing');
    speak('In this level, Red means GO and Green means STOP! Press Move only when the light is red.');
    return () => { window.speechSynthesis?.cancel(); };
  }, [speak]);

  // Toggle light every 4 seconds
  useEffect(() => {
    if (showStar) return;
    const interval = setInterval(() => {
      setLight((prev) => (prev === 'red' ? 'green' : 'red'));
    }, 4000);
    return () => clearInterval(interval);
  }, [showStar]);

  const handleMove = () => {
    if (showSuccess || showWarning) return;

    if (light === 'red') {
      // CORRECT: red means GO in this reverse-logic level
      playSuccessSound();
      speak('Good job! Red means go. You are walking safely!');
      setShowSuccess(true);
      const newCount = successCount + 1;
      setSuccessCount(newCount);
      setTimeout(() => {
        setShowSuccess(false);
        if (newCount >= 3) setShowStar(true);
      }, 2000);
    } else {
      // WRONG: green means STOP here
      playBuzzer();
      speak('Wait! Green means stop in this level. Stay still!');
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-green-50 flex flex-col">
      {/* Header */}
      <header className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button
          onClick={() => { window.speechSynthesis?.cancel(); onBack(); }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} /><span>Exit</span>
        </button>
        <span className="text-sm font-bold text-amber-600">🚦 Road Crossing</span>
      </header>

      {/* Reverse-logic rule banner */}
      <div className="mx-6 mb-4 rounded-2xl bg-amber-100 border-2 border-amber-300 px-4 py-3 text-center">
        <p className="text-base font-black text-amber-800 leading-tight">
          🧠 In this level, <span className="text-red-600">Red means GO</span> and{' '}
          <span className="text-green-700">Green means STOP!</span>
        </p>
        <p className="text-xs font-semibold text-amber-700 mt-1">
          Tap MOVE {successCount}/3 times on RED to win
        </p>
      </div>

      {/* Traffic Light */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-col items-center gap-3 bg-gray-800 rounded-2xl p-4 shadow-xl">
          <motion.div
            className={`w-16 h-16 rounded-full border-4 ${
              light === 'red'
                ? 'bg-red-500 border-red-300 shadow-[0_0_25px_rgba(239,68,68,0.8)]'
                : 'bg-red-900/40 border-red-800/40'
            }`}
            animate={light === 'red' ? { scale: [1, 1.12, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className={`w-16 h-16 rounded-full border-4 ${
              light === 'green'
                ? 'bg-green-500 border-green-300 shadow-[0_0_25px_rgba(34,197,94,0.8)]'
                : 'bg-green-900/40 border-green-800/40'
            }`}
            animate={light === 'green' ? { scale: [1, 1.12, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <p className="text-white text-sm font-black mt-1">
            {light === 'red' ? '🟥 RED = GO' : '🟩 GREEN = STOP'}
          </p>
        </div>
      </div>

      {/* Character + road */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-6 relative">
        <div className="w-full max-w-md h-32 bg-gray-700 rounded-2xl relative flex items-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-around px-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-8 h-2 bg-yellow-400 rounded" />
            ))}
          </div>
          <motion.div
            className="absolute z-10 w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-blue-300 flex items-center justify-center shadow-xl"
            initial={{ x: 12 }}
            animate={
              showSuccess
                ? { x: [12, 80, 150, 220, 280], y: [0, -6, 0, -6, 0] }
                : { x: 12 }
            }
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          >
            <span className="text-2xl">🚶</span>
          </motion.div>
        </div>

        {/* MOVE button — big, accessible, high-contrast */}
        <button
          onClick={handleMove}
          disabled={showSuccess || showWarning}
          className="w-full max-w-xs py-6 px-8 rounded-2xl bg-blue-600 text-white font-black text-2xl shadow-xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          🚶 MOVE
        </button>

        {/* Success toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-green-100 border-2 border-green-400 rounded-2xl px-6 py-4 shadow-lg"
            >
              <p className="text-green-700 font-black text-xl text-center">
                ✅ Good Job! Walking safely!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Warning modal: WAIT */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0.7, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-red-400"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-4 w-20 h-20 rounded-full bg-red-100 flex items-center justify-center"
              >
                <AlertTriangle size={48} className="text-red-600" />
              </motion.div>
              <h2 className="text-3xl font-black text-red-600 mb-2">⛔ WAIT!</h2>
              <p className="text-lg font-bold text-foreground/80">
                Green means <span className="text-red-600">STOP</span> in this level.
                Stay still!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <GoldStarPopup show={showStar} onDone={onComplete} />
    </div>
  );
};
