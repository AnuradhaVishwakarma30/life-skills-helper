import { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, Wind } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';
import { GoldStarPopup } from './GoldStarPopup';
import { incrementViews } from '../../utils/storage';

interface DeepBreathingGameProps {
  onBack: () => void;
  onComplete: () => void;
}

const STEPS = [
  {
    lottie: 'https://lottie.host/6a7d0dc8-7bfa-4199-81bf-ec632d0fdb3d/mhZXWQsjQA.lottie',
    voice: "Let's take a deep breath in.",
    instruction: 'Hold the button and breathe in slowly...',
    holdDuration: 3000,
  },
  {
    lottie: 'https://lottie.host/9173e2bc-50f1-46f4-a821-76c8cb3b0137/0acRyUtiMT.lottie',
    voice: 'Now hold it... and breathe out slowly.',
    instruction: 'Hold the button and breathe out...',
    holdDuration: 4000,
  },
];

export const DeepBreathingGame = ({ onBack, onComplete }: DeepBreathingGameProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showStar, setShowStar] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef(0);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  useEffect(() => {
    incrementViews('deep-breathing');
    speak(STEPS[0].voice);
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [speak]);

  const step = STEPS[stepIndex];

  const handleHoldStart = () => {
    setHolding(true);
    startTime.current = Date.now();
    holdTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const pct = Math.min((elapsed / step.holdDuration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(holdTimer.current!);
        holdTimer.current = null;
        setHolding(false);
        setProgress(0);
        if (stepIndex < STEPS.length - 1) {
          const next = stepIndex + 1;
          setStepIndex(next);
          speak(STEPS[next].voice);
        } else {
          speak('All done! You did amazing breathing!');
          setShowStar(true);
        }
      }
    }, 50);
  };

  const handleHoldEnd = () => {
    if (holdTimer.current) {
      clearInterval(holdTimer.current);
      holdTimer.current = null;
    }
    setHolding(false);
    setProgress(0);
  };

  if (showStar) {
    return <GoldStarPopup show onDone={onComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100 flex flex-col">
      <header className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button
          onClick={() => { window.speechSynthesis?.cancel(); onBack(); }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span>Exit</span>
        </button>
        <div className="flex items-center gap-2">
          <Wind size={18} className="text-indigo-600" />
          <span className="text-sm font-semibold text-foreground">Deep Breathing</span>
        </div>
      </header>

      <div className="px-6 mb-4">
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-right">
          Step {stepIndex + 1} of {STEPS.length}
        </p>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-72 h-72 rounded-3xl overflow-hidden"
        >
          <DotLottieReact src={step.lottie} loop autoplay style={{ width: '100%', height: '100%' }} />
        </motion.div>

        <p className="text-lg font-semibold text-indigo-800 text-center max-w-xs">
          {step.instruction}
        </p>

        <div className="relative">
          {holding && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-indigo-400"
              style={{ scale: 1 + progress / 200 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          <motion.button
            onPointerDown={handleHoldStart}
            onPointerUp={handleHoldEnd}
            onPointerLeave={handleHoldEnd}
            className="relative w-36 h-36 rounded-full bg-indigo-500 text-white font-bold text-lg shadow-xl flex flex-col items-center justify-center gap-2 select-none touch-none"
            whileTap={{ scale: 0.95 }}
          >
            <Wind size={32} />
            <span className="text-sm">Breathe with me</span>
            {holding && (
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="46"
                  fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * progress) / 100}
                  className="transition-all duration-100"
                />
              </svg>
            )}
          </motion.button>
        </div>
      </main>
    </div>
  );
};
