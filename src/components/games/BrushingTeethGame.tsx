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

type StepMedia =
  | { kind: 'lottie'; url: string }
  | { kind: 'gif'; url: string };

interface BrushingStep {
  media: StepMedia;
  voice: string;
  buttonLabel: string;
  title: string;
}

const STEPS: BrushingStep[] = [
  {
    media: { kind: 'lottie', url: 'https://lottie.host/e2048a4e-fad8-4d1f-936b-02ba4753d533/MOojH0ipEb.lottie' },
    voice: 'First, pick up your toothbrush!',
    buttonLabel: '🪥 I picked up my brush!',
    title: 'Pick Up Your Brush',
  },
  {
    media: { kind: 'lottie', url: 'https://lottie.host/ab7996bf-874e-41fb-a388-5167a0f10e72/YI1JRUcJU6.lottie' },
    voice: 'Now, apply toothpaste on the brush.',
    buttonLabel: '🦷 I applied toothpaste!',
    title: 'Apply Toothpaste',
  },
  {
    media: { kind: 'gif', url: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGs3cXZ0ajFhMGxodXdoaTVjemJqZjh2bTVycDZmMTdsYnk3cnAxbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hvH7RARWhp9VCgSNll/giphy.gif' },
    voice: 'Great! Now scrub your teeth gently.',
    buttonLabel: '🫧 I am scrubbing!',
    title: 'Scrub Your Teeth',
  },
  {
    media: { kind: 'gif', url: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2tkZnpucW9ic3R2OXc0cWxnaHVmZ2IzdDBrYmllcGd2Njh2ZTUwNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JgJ9icekwhH5IilmQo/giphy.gif' },
    voice: 'Now wash and rinse your teeth with water.',
    buttonLabel: '💧 I rinsed my teeth!',
    title: 'Wash Your Teeth',
  },
  {
    media: { kind: 'gif', url: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2EzN2gyZ2Eyd244MXZwczRreTh4empzMjBmdnFwMHUwYmZteXBpMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kyp3VsJdf2YxARWW9n/giphy.gif' },
    voice: 'Don\'t forget to clean your tongue gently.',
    buttonLabel: '👅 Tongue is clean!',
    title: 'Clean Your Tongue',
  },
  {
    media: { kind: 'gif', url: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWp3cm12dnAwaTQ2emtnb2xhdGdqZ2h1cHVnajd3OWNqaGhsOXNwOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o85xpxIYklvRiiTAY/giphy.gif' },
    voice: 'Finally, gargle and spit out the water.',
    buttonLabel: '✨ I gargled!',
    title: 'Gargle',
  },
];

const CLOSING_MESSAGE =
  'Great job! Remember to brush your teeth twice a day—once in the morning and once at night.';

export const BrushingTeethGame = ({ onBack, onComplete }: BrushingTeethGameProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [showClosing, setShowClosing] = useState(false);
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
      speak(CLOSING_MESSAGE);
      setShowClosing(true);
    }
  };

  if (showStar) return <GoldStarPopup show onDone={onComplete} />;

  if (showClosing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-sky-50 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md text-center bg-white rounded-3xl shadow-2xl p-10 border-4 border-cyan-200"
        >
          <div className="text-6xl mb-4">🦷✨</div>
          <h2 className="text-3xl font-black text-cyan-700 mb-4">Sparkling Clean!</h2>
          <p className="text-lg font-semibold text-foreground/80 leading-relaxed">
            {CLOSING_MESSAGE}
          </p>
          <button
            onClick={() => setShowStar(true)}
            className="mt-8 w-full py-4 px-8 rounded-2xl bg-cyan-500 text-white font-bold text-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            Get My Gold Star ⭐
          </button>
        </motion.div>
      </div>
    );
  }

  const step = STEPS[stepIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-sky-50 flex flex-col">
      <header className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button
          onClick={() => { window.speechSynthesis?.cancel(); onBack(); }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} /><span>Exit</span>
        </button>
        <div className="flex items-center gap-2">
          <Smile size={18} className="text-cyan-500" />
          <span className="text-sm font-semibold text-foreground">Tooth Brushing</span>
        </div>
      </header>

      <div className="px-6 mb-4">
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 rounded-full transition-all duration-300"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-right">
          Step {stepIndex + 1} of {STEPS.length}
        </p>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-6 pb-8">
        <motion.h2
          key={`t-${stepIndex}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-cyan-700 text-center"
        >
          {step.title}
        </motion.h2>

        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-72 h-72 rounded-3xl overflow-hidden bg-white shadow-xl border-4 border-white"
        >
          {step.media.kind === 'lottie' ? (
            <DotLottieReact
              src={step.media.url}
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <img
              src={step.media.url}
              alt={step.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          )}
        </motion.div>

        <p className="text-base font-semibold text-foreground/80 text-center max-w-sm">
          {step.voice}
        </p>

        <motion.button
          key={`b-${stepIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleStepDone}
          whileTap={{ scale: 0.95 }}
          className="w-full max-w-xs py-5 px-8 rounded-2xl bg-cyan-500 text-white font-bold text-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          {step.buttonLabel}
        </motion.button>
      </main>
    </div>
  );
};
