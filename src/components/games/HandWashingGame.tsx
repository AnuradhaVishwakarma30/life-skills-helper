import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Hand } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { GoldStarPopup } from './GoldStarPopup';
import { incrementViews } from '../../utils/storage';

interface HandWashingGameProps {
  onBack: () => void;
  onComplete: () => void;
}

const STEPS = [
  {
    label: 'Apply Soap',
    lottie: 'https://lottie.host/38cfefb0-8487-48e4-999e-2059bdafc8f6/CzULCjv0g5.lottie',
    dragEmoji: '🧼',
    dragLabel: 'Soap',
    voiceSuccess: 'Great job! Now let\'s scrub!',
  },
  {
    label: 'Scrub Hands',
    lottie: 'https://lottie.host/3dd1df2e-26c1-477d-8a59-47d2ecd6cd4f/omJfXlAyQD.lottie',
    dragEmoji: '🫧',
    dragLabel: 'Bubbles',
    voiceSuccess: 'Awesome scrubbing! Time to rinse!',
  },
  {
    label: 'Rinse Hands',
    lottie: 'https://lottie.host/5e0a8d6e-6478-4204-ab6d-473238575138/YYutdjPkSY.lottie',
    dragEmoji: '💧',
    dragLabel: 'Water',
    voiceSuccess: 'All clean! Your hands are sparkling!',
  },
];

export const HandWashingGame = ({ onBack, onComplete }: HandWashingGameProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [showStar, setShowStar] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.85;
      u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    }
  }, []);

  const playSound = useCallback(() => {
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

  const handleDragEnd = useCallback(
    (_: any, info: { point: { x: number; y: number } }) => {
      if (!targetRef.current || transitioning) return;
      const rect = targetRef.current.getBoundingClientRect();
      const { x, y } = info.point;
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        playSound();
        const currentStep = STEPS[stepIndex];
        speak(currentStep.voiceSuccess);
        setTransitioning(true);

        if (stepIndex < STEPS.length - 1) {
          setTimeout(() => {
            setStepIndex((prev) => prev + 1);
            setTransitioning(false);
          }, 1500);
        } else {
          incrementViews('hand-washing');
          setTimeout(() => {
            setShowStar(true);
          }, 1000);
        }
      }
    },
    [stepIndex, transitioning, playSound, speak]
  );

  const currentStep = STEPS[stepIndex];
  const progress = ((stepIndex + (transitioning ? 1 : 0)) / STEPS.length) * 100;

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
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {STEPS.map((s, i) => (
            <span
              key={i}
              className={`text-xs font-semibold ${
                i <= stepIndex ? 'text-blue-600' : 'text-muted-foreground'
              }`}
            >
              {i + 1}. {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Game area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-6 relative overflow-hidden">
        {/* Lottie animation */}
        <motion.div
          key={stepIndex}
          className="w-64 h-64 sm:w-72 sm:h-72"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <DotLottieReact
            src={currentStep.lottie}
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        </motion.div>

        {/* Instruction */}
        <motion.p
          key={`inst-${stepIndex}`}
          className="text-lg font-bold text-blue-700 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Drag the {currentStep.dragEmoji} onto the hands!
        </motion.p>

        {/* Drop target + Draggable in a row */}
        <div className="flex items-center justify-center gap-16 mt-2">
          {/* Drop target */}
          <motion.div
            ref={targetRef}
            className="w-28 h-28 rounded-full border-4 border-dashed border-blue-300 bg-blue-50 flex items-center justify-center"
            animate={
              transitioning
                ? { borderColor: '#22c55e', backgroundColor: '#f0fdf4' }
                : {}
            }
          >
            <Hand size={40} className="text-blue-400" />
          </motion.div>

          {/* Draggable icon */}
          {!transitioning && (
            <motion.div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-200 to-emerald-400 border-4 border-emerald-500 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shadow-xl select-none"
              drag
              dragSnapToOrigin
              onDragEnd={handleDragEnd}
              whileDrag={{ scale: 1.2, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
              whileHover={{ scale: 1.05 }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-3xl">{currentStep.dragEmoji}</span>
              <span className="text-[10px] font-bold text-emerald-800 mt-0.5">
                {currentStep.dragLabel}
              </span>
            </motion.div>
          )}

          {/* Success checkmark during transition */}
          {transitioning && (
            <motion.div
              className="w-20 h-20 rounded-2xl bg-green-100 border-4 border-green-400 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <span className="text-3xl">✅</span>
            </motion.div>
          )}
        </div>
      </main>

      <GoldStarPopup show={showStar} onDone={onComplete} />
    </div>
  );
};
