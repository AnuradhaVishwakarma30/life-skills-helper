import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoldStarPopup } from './GoldStarPopup';
import { incrementViews } from '../../utils/storage';

export interface GifStep {
  /** URL of GIF or static image to display */
  mediaUrl: string;
  /** Spoken/displayed instruction */
  voice: string;
  /** Short title shown above the media */
  title: string;
  /** Big confirmation button label */
  buttonLabel: string;
}

export interface GifStepGameConfig {
  taskId: string;
  taskName: string;
  emoji: string;
  /** Gradient bg classes, e.g. 'from-blue-50 to-cyan-50' */
  gradient: string;
  /** Accent text color, e.g. 'text-blue-600' */
  accentText: string;
  /** Accent button bg, e.g. 'bg-blue-500' */
  accentBg: string;
  /** Accent progress bar bg, e.g. 'bg-blue-500' */
  progressBg: string;
  /** Optional final closing message shown before the gold star */
  closingMessage?: string;
  steps: GifStep[];
}

interface Props {
  config: GifStepGameConfig;
  onBack: () => void;
  onComplete: () => void;
}

export const GifStepGame = ({ config, onBack, onComplete }: Props) => {
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
    incrementViews(config.taskId);
    speak(config.steps[0].voice);
    return () => { window.speechSynthesis?.cancel(); };
  }, [config.taskId, config.steps, speak]);

  const handleStepDone = () => {
    if (stepIndex < config.steps.length - 1) {
      const next = stepIndex + 1;
      setStepIndex(next);
      speak(config.steps[next].voice);
    } else if (config.closingMessage && !showClosing) {
      speak(config.closingMessage);
      setShowClosing(true);
    } else {
      speak('Amazing job! You did it!');
      setShowStar(true);
    }
  };

  if (showStar) return <GoldStarPopup show onDone={onComplete} />;

  if (showClosing && config.closingMessage) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${config.gradient} flex flex-col items-center justify-center px-6`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md text-center bg-white rounded-3xl shadow-2xl p-10 border-4 border-white"
        >
          <div className="text-6xl mb-4">⭐</div>
          <h2 className={`text-3xl font-black mb-4 ${config.accentText}`}>Great Job!</h2>
          <p className="text-lg font-semibold text-foreground/80 leading-relaxed">
            {config.closingMessage}
          </p>
          <button
            onClick={handleStepDone}
            className={`mt-8 w-full py-4 px-8 rounded-2xl ${config.accentBg} text-white font-bold text-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all`}
          >
            Continue ✨
          </button>
        </motion.div>
      </div>
    );
  }

  const step = config.steps[stepIndex];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${config.gradient} flex flex-col`}>
      <header className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button
          onClick={() => { window.speechSynthesis?.cancel(); onBack(); }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} /><span>Exit</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-base">{config.emoji}</span>
          <span className={`text-sm font-bold ${config.accentText}`}>{config.taskName}</span>
        </div>
      </header>

      <div className="px-6 mb-4">
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full ${config.progressBg} rounded-full transition-all duration-300`}
            style={{ width: `${((stepIndex + 1) / config.steps.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-right">
          Step {stepIndex + 1} of {config.steps.length}
        </p>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-6 pb-8">
        <motion.h2
          key={`t-${stepIndex}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl font-black text-center ${config.accentText}`}
        >
          {step.title}
        </motion.h2>

        <motion.div
          key={`m-${stepIndex}`}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-72 h-72 rounded-3xl overflow-hidden bg-white shadow-xl border-4 border-white"
        >
          <img
            src={step.mediaUrl}
            alt={step.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </motion.div>

        <p className="text-lg font-semibold text-foreground/80 text-center max-w-sm">
          {step.voice}
        </p>

        <motion.button
          key={`b-${stepIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleStepDone}
          whileTap={{ scale: 0.95 }}
          className={`w-full max-w-xs py-5 px-8 rounded-2xl ${config.accentBg} text-white font-bold text-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all`}
        >
          {step.buttonLabel}
        </motion.button>
      </main>
    </div>
  );
};
