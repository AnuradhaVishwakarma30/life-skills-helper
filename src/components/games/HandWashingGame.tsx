import { useState, useCallback, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Droplets, Sparkles, ArrowLeft } from 'lucide-react';
import { GoldStarPopup } from './GoldStarPopup';

interface HandWashingGameProps {
  onBack: () => void;
  onComplete: () => void;
}

// Simple bubble component
const Bubble = ({ delay, x }: { delay: number; x: number }) => (
  <motion.div
    className="absolute w-4 h-4 rounded-full bg-blue-200/70 border border-blue-300/50"
    style={{ left: x, bottom: 0 }}
    initial={{ opacity: 0, y: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.8, 0],
      y: -120,
      scale: [0, 1.2, 0.6],
    }}
    transition={{ duration: 1.5, delay, ease: 'easeOut' }}
  />
);

export const HandWashingGame = ({ onBack, onComplete }: HandWashingGameProps) => {
  const [step, setStep] = useState(0); // 0=drag soap, 1=scrubbing, 2=rinsing, 3=done
  const [showBubbles, setShowBubbles] = useState(false);
  const [showStar, setShowStar] = useState(false);
  const handsRef = useRef<HTMLDivElement>(null);
  const soapX = useMotionValue(0);
  const soapY = useMotionValue(0);
  const soapRotate = useTransform(soapX, [-100, 100], [-15, 15]);

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

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.85;
      u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    }
  }, []);

  const handleSoapDragEnd = useCallback(
    (_: any, info: { point: { x: number; y: number } }) => {
      if (!handsRef.current || step !== 0) return;
      const rect = handsRef.current.getBoundingClientRect();
      const { x, y } = info.point;
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        playSuccessSound();
        speak('Great! Now scrub your hands with soap!');
        setShowBubbles(true);
        setStep(1);
        setTimeout(() => {
          speak('Now rinse your hands under water!');
          setStep(2);
        }, 3000);
        setTimeout(() => {
          speak('Hands are clean!');
          setStep(3);
          setShowStar(true);
        }, 5500);
      }
    },
    [step, playSuccessSound, speak]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 flex flex-col">
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
        <span className="text-sm font-bold text-blue-600">🧼 Hand Washing</span>
      </header>

      {/* Progress */}
      <div className="px-6 mb-4">
        <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-right">
          {step === 0 && 'Drag the soap onto your hands!'}
          {step === 1 && 'Scrubbing... keep going!'}
          {step === 2 && 'Rinsing with water...'}
          {step === 3 && 'All done! 🎉'}
        </p>
      </div>

      {/* Game area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Hands target */}
        <div className="relative mb-12">
          <motion.div
            ref={handsRef}
            className="w-40 h-40 rounded-3xl bg-gradient-to-br from-amber-100 to-amber-200 border-4 border-amber-300 flex items-center justify-center relative"
            animate={step === 1 ? { rotate: [0, 5, -5, 5, 0] } : {}}
            transition={step === 1 ? { duration: 0.5, repeat: Infinity } : {}}
          >
            <span className="text-6xl">🙌</span>

            {/* Bubbles */}
            {showBubbles && (
              <div className="absolute inset-0">
                {[...Array(12)].map((_, i) => (
                  <Bubble key={i} delay={i * 0.15} x={20 + Math.random() * 100} />
                ))}
              </div>
            )}

            {step === 1 && (
              <motion.div
                className="absolute inset-0 rounded-3xl"
                animate={{ boxShadow: ['0 0 0 0 rgba(59,130,246,0)', '0 0 20px 10px rgba(59,130,246,0.3)', '0 0 0 0 rgba(59,130,246,0)'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}

            {step === 2 && (
              <motion.div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Droplets size={32} className="text-blue-400" />
              </motion.div>
            )}
          </motion.div>

          {step >= 1 && (
            <motion.div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[...Array(6)].map((_, i) => (
                <Sparkles key={i} size={14} className="text-yellow-400" />
              ))}
            </motion.div>
          )}
        </div>

        {/* Draggable soap */}
        {step === 0 && (
          <motion.div
            className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-300 to-emerald-400 border-4 border-emerald-500 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shadow-xl"
            drag
            dragSnapToOrigin
            style={{ x: soapX, y: soapY, rotate: soapRotate }}
            onDragEnd={handleSoapDragEnd}
            whileDrag={{ scale: 1.15, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            whileHover={{ scale: 1.05 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-3xl">🧴</span>
            <span className="text-xs font-bold text-emerald-800 mt-1">Soap</span>
          </motion.div>
        )}

        {step === 0 && (
          <motion.p
            className="mt-6 text-lg font-bold text-blue-600 text-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            👆 Drag the soap onto your hands!
          </motion.p>
        )}
      </main>

      <GoldStarPopup show={showStar} onDone={onComplete} />
    </div>
  );
};
