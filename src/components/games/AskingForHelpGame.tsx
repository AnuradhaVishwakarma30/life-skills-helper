import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';
import { GoldStarPopup } from './GoldStarPopup';
import { incrementViews } from '../../utils/storage';

interface AskingForHelpGameProps {
  onBack: () => void;
  onComplete: () => void;
}

const STEPS = [
  {
    lottie: 'https://lottie.host/c9629d73-7ce0-413a-9033-3e8ebf3cb80e/wJntJ0uCxG.lottie',
    voice: 'First, notice when you need help. Look around!',
    buttonLabel: '👀 I noticed I need help!',
    title: 'Notice You Need Help',
  },
  {
    lottie: 'https://lottie.host/ed92fcc7-0bc9-4e9c-b878-291d030cb6e6/sE9kzLDdUM.lottie',
    voice: 'Good! Now find a trusted friend or adult nearby.',
    buttonLabel: '🤝 I found someone!',
    title: 'Find a Trusted Person',
  },
  {
    lottie: 'https://lottie.host/aaf1064b-207f-40f2-972b-6490a7184bce/JgFRWNqvto.lottie',
    voice: 'Great! Now say: I need help, please.',
    buttonLabel: '🗣️ I said I need help!',
    title: 'Say "I Need Help"',
  },
  {
    lottie: 'https://lottie.host/c8169907-0e76-4d4d-9f52-23df5cc1b370/ZSLVQc12tI.lottie',
    voice: 'Wonderful! Now explain clearly what you need.',
    buttonLabel: '💬 I explained what I need!',
    title: 'Explain What You Need',
  },
];

export const AskingForHelpGame = ({ onBack, onComplete }: AskingForHelpGameProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [showStar, setShowStar] = useState(false);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.85; u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    }
  }, []);

  useEffect(() => {
    incrementViews('asking-for-help');
    speak(STEPS[0].voice);
    return () => { window.speechSynthesis?.cancel(); };
  }, [speak]);

  const handleStepDone = () => {
    if (stepIndex < STEPS.length - 1) {
      const next = stepIndex + 1;
      setStepIndex(next);
      speak(STEPS[next].voice);
    } else {
      speak('Amazing! You know how to ask for help!');
      setShowStar(true);
    }
  };

  if (showStar) return <GoldStarPopup show onDone={onComplete} />;
  const step = STEPS[stepIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 flex flex-col">
      <header className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button onClick={() => { window.speechSynthesis?.cancel(); onBack(); }} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
          <ArrowLeft size={18} /><span>Exit</span>
        </button>
        <div className="flex items-center gap-2">
          <HelpCircle size={18} className="text-sky-500" />
          <span className="text-sm font-semibold text-foreground">Asking for Help</span>
        </div>
      </header>

      <div className="px-6 mb-4">
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-sky-500 rounded-full transition-all duration-300" style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-right">Step {stepIndex + 1} of {STEPS.length}</p>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        <motion.h2 key={`t-${stepIndex}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black text-sky-700 text-center">
          {step.title}
        </motion.h2>
        <motion.div key={stepIndex} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-72 h-72 rounded-3xl overflow-hidden">
          <DotLottieReact src={step.lottie} loop autoplay style={{ width: '100%', height: '100%' }} />
        </motion.div>
        <motion.button key={`b-${stepIndex}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} onClick={handleStepDone} whileTap={{ scale: 0.95 }} className="w-full max-w-xs py-5 px-8 rounded-2xl bg-sky-500 text-white font-bold text-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all">
          {step.buttonLabel}
        </motion.button>
      </main>
    </div>
  );
};
