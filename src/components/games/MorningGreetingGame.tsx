import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Hand } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';
import { GoldStarPopup } from './GoldStarPopup';
import { incrementViews } from '../../utils/storage';

interface MorningGreetingGameProps {
  onBack: () => void;
  onComplete: () => void;
}

const STEPS = [
  {
    lottie: 'https://lottie.host/8c7a61a9-4f7d-4dce-aa6b-c40284db4b89/TLaIHF9C7d.lottie',
    voice: 'First, let us say Hello!',
    buttonLabel: '👋 I said Hello!',
    title: 'Say Hello!',
  },
  {
    lottie: 'https://lottie.host/1e39e0e0-c0e1-4090-a2bb-b165e1329ab0/W8pAuJnFDk.lottie',
    voice: 'Now, let us say Namaste to our teacher.',
    buttonLabel: '🙏 I said Namaste!',
    title: 'Say Namaste!',
  },
];

export const MorningGreetingGame = ({ onBack, onComplete }: MorningGreetingGameProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [showStar, setShowStar] = useState(false);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  useEffect(() => {
    incrementViews('morning-greeting');
    speak(STEPS[0].voice);
    return () => { window.speechSynthesis?.cancel(); };
  }, [speak]);

  const handleStepDone = () => {
    if (stepIndex < STEPS.length - 1) {
      const next = stepIndex + 1;
      setStepIndex(next);
      speak(STEPS[next].voice);
    } else {
      speak('Wonderful! You greeted everyone beautifully!');
      setShowStar(true);
    }
  };

  if (showStar) {
    return <GoldStarPopup show onDone={onComplete} />;
  }

  const step = STEPS[stepIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-orange-50 flex flex-col">
      <header className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button
          onClick={() => { window.speechSynthesis?.cancel(); onBack(); }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span>Exit</span>
        </button>
        <div className="flex items-center gap-2">
          <Hand size={18} className="text-rose-500" />
          <span className="text-sm font-semibold text-foreground">Morning Greeting</span>
        </div>
      </header>

      <div className="px-6 mb-4">
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-500 rounded-full transition-all duration-300"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-right">
          Step {stepIndex + 1} of {STEPS.length}
        </p>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        <motion.h2
          key={`title-${stepIndex}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-rose-700 text-center"
        >
          {step.title}
        </motion.h2>

        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-72 h-72 rounded-3xl overflow-hidden"
        >
          <DotLottieReact src={step.lottie} loop autoplay style={{ width: '100%', height: '100%' }} />
        </motion.div>

        <motion.button
          key={`btn-${stepIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleStepDone}
          whileTap={{ scale: 0.95 }}
          className="w-full max-w-xs py-5 px-8 rounded-2xl bg-rose-500 text-white font-bold text-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          {step.buttonLabel}
        </motion.button>
      </main>
    </div>
  );
};
