import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Smile } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';
import { GoldStarPopup } from './GoldStarPopup';
import { incrementViews } from '../../utils/storage';

interface BrushingTeethGameProps {
  onBack: () => void;
  onComplete: () => void;
}

const STEPS = [
  {
    lottie: 'https://lottie.host/e2048a4e-fad8-4d1f-936b-02ba4753d533/MOojH0ipEb.lottie',
    voice: 'First, pick up your toothbrush!',
    buttonLabel: '🪥 I picked up my brush!',
    title: 'Pick Up Your Brush',
  },
  {
    lottie: 'https://lottie.host/ab7996bf-874e-41fb-a388-5167a0f10e72/YI1JRUcJU6.lottie',
    voice: 'Now, apply toothpaste on the brush.',
    buttonLabel: '🦷 I applied toothpaste!',
    title: 'Apply Toothpaste',
  },
  {
    lottie: 'https://lottie.host/f50bbd42-1468-44c2-a1fb-a2b4f25e1918/xfK65S5YSA.lottie',
    voice: 'Great! Now scrub your teeth gently.',
    buttonLabel: '🫧 I am scrubbing!',
    title: 'Brush Your Teeth',
  },
  {
    lottie: 'https://lottie.host/f1f9b809-1ab2-44e2-ba74-b47ea9cf2e1d/qduvdNZh2j.lottie',
    voice: 'Wonderful! Your teeth are clean now!',
    buttonLabel: '✨ My teeth are clean!',
    title: 'All Clean!',
  },
];

export const BrushingTeethGame = ({ onBack, onComplete }: BrushingTeethGameProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [showStar, setShowStar] = useState(false);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.85;
      u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    }
  }, []);

  useEffect(() => {
    incrementViews('tooth-brushing');
    speak(STEPS[0].voice);
    return () => { window.speechSynthesis?.cancel(); };
  }, [speak]);

  const handleStepDone = () => {
    if (stepIndex < STEPS.length - 1) {
      const next = stepIndex + 1;
      setStepIndex(next);
      speak(STEPS[next].voice);
    } else {
      speak('Amazing! Your teeth are sparkling clean!');
      setShowStar(true);
    }
  };

  if (showStar) return <GoldStarPopup show onDone={onComplete} />;

  const step = STEPS[stepIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-sky-50 flex flex-col">
      <header className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button onClick={() => { window.speechSynthesis?.cancel(); onBack(); }} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
          <ArrowLeft size={18} /><span>Exit</span>
        </button>
        <div className="flex items-center gap-2">
          <Smile size={18} className="text-cyan-500" />
          <span className="text-sm font-semibold text-foreground">Tooth Brushing</span>
        </div>
      </header>

      <div className="px-6 mb-4">
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-cyan-500 rounded-full transition-all duration-300" style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-right">Step {stepIndex + 1} of {STEPS.length}</p>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        <motion.h2 key={`t-${stepIndex}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black text-cyan-700 text-center">
          {step.title}
        </motion.h2>
        <motion.div key={stepIndex} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-72 h-72 rounded-3xl overflow-hidden">
          <DotLottieReact src={step.lottie} loop autoplay style={{ width: '100%', height: '100%' }} />
        </motion.div>
        <motion.button key={`b-${stepIndex}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} onClick={handleStepDone} whileTap={{ scale: 0.95 }} className="w-full max-w-xs py-5 px-8 rounded-2xl bg-cyan-500 text-white font-bold text-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all">
          {step.buttonLabel}
        </motion.button>
      </main>
    </div>
  );
};
