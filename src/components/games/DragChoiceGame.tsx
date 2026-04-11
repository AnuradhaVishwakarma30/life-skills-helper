import { useState, useCallback, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { IconRenderer } from '../../utils/IconRenderer';
import { GoldStarPopup } from './GoldStarPopup';
import { incrementViews } from '../../utils/storage';

export interface DragChoiceStep {
  question: string;
  voice: string;
  targetLabel: string;
  targetIcon: string;
  targetColor: string;
  correct: { label: string; iconName: string; color: string; imageUrl?: string };
  wrong: { label: string; iconName: string; color: string; imageUrl?: string };
}

export interface DragChoiceConfig {
  taskId: string;
  taskName: string;
  accentColor: string;
  bgGradient: string;
  steps: DragChoiceStep[];
}

interface DragChoiceGameProps {
  config: DragChoiceConfig;
  onBack: () => void;
  onComplete: () => void;
}

export const DragChoiceGame = ({ config, onBack, onComplete }: DragChoiceGameProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showStar, setShowStar] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.85; u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    }
  }, []);

  useEffect(() => {
    incrementViews(config.taskId);
    speak(config.steps[0].voice);
    return () => { window.speechSynthesis?.cancel(); };
  }, [config, speak]);

  const step = config.steps[stepIndex];

  const checkHit = (point: { x: number; y: number }) => {
    if (!targetRef.current) return false;
    const r = targetRef.current.getBoundingClientRect();
    return point.x >= r.left && point.x <= r.right && point.y >= r.top && point.y <= r.bottom;
  };

  const handleDragEnd = (isCorrect: boolean, info: { point: { x: number; y: number } }) => {
    if (!checkHit(info.point)) return;
    if (isCorrect) {
      setFeedback('correct');
      speak('Great job! That is correct!');
      setTimeout(() => {
        setFeedback(null);
        if (stepIndex < config.steps.length - 1) {
          const next = stepIndex + 1;
          setStepIndex(next);
          speak(config.steps[next].voice);
        } else {
          speak('Wonderful! You completed all the steps!');
          setShowStar(true);
        }
      }, 1200);
    } else {
      setFeedback('wrong');
      speak('Oops! That is not right. Try the other one!');
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  if (showStar) return <GoldStarPopup show onDone={onComplete} />;

  const showCorrectFirst = stepIndex % 2 === 0;
  const options = showCorrectFirst
    ? [{ ...step.correct, isCorrect: true }, { ...step.wrong, isCorrect: false }]
    : [{ ...step.wrong, isCorrect: false }, { ...step.correct, isCorrect: true }];

  return (
    <div className={`min-h-screen ${config.bgGradient} flex flex-col`}>
      <header className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button onClick={() => { window.speechSynthesis?.cancel(); onBack(); }} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-lg font-bold">
          <ArrowLeft size={22} /><span>Exit</span>
        </button>
        <span className="text-lg font-bold text-foreground">{config.taskName}</span>
      </header>

      <div className="px-6 mb-4">
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div className={`h-full ${config.accentColor} rounded-full transition-all duration-300`} style={{ width: `${((stepIndex + 1) / config.steps.length) * 100}%` }} />
        </div>
        <p className="text-sm font-semibold text-muted-foreground mt-2 text-right">Step {stepIndex + 1} of {config.steps.length}</p>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <motion.h2 key={`q-${stepIndex}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black text-foreground text-center max-w-md">
          {step.question}
        </motion.h2>

        {/* Target area */}
        <motion.div
          ref={targetRef}
          key={`target-${stepIndex}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`w-40 h-40 rounded-3xl border-4 border-dashed flex flex-col items-center justify-center gap-2 ${step.targetColor}`}
        >
          <IconRenderer name={step.targetIcon} size={52} className="text-foreground/60" />
          <span className="text-base font-bold text-foreground/70">{step.targetLabel}</span>
        </motion.div>

        {feedback === 'correct' && (
          <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-600 font-black text-2xl">✅ Correct!</motion.p>
        )}
        {feedback === 'wrong' && (
          <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-red-500 font-black text-2xl">❌ Try again!</motion.p>
        )}

        {/* Draggable photo cards */}
        <div className="flex gap-6 mt-4">
          {options.map((opt) => (
            <motion.div
              key={`${stepIndex}-${opt.label}`}
              drag
              dragSnapToOrigin
              onDragEnd={(_, info) => handleDragEnd(opt.isCorrect, info)}
              whileDrag={{ scale: 1.1, zIndex: 50 }}
              whileTap={{ scale: 0.95 }}
              animate={feedback === 'wrong' && !opt.isCorrect ? { x: [0, -12, 12, -12, 12, 0] } : {}}
              className={`w-36 rounded-2xl shadow-xl border-2 flex flex-col items-center overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none bg-card ${opt.color}`}
            >
              {opt.imageUrl ? (
                <img
                  src={opt.imageUrl}
                  alt={opt.label}
                  className="w-full h-28 object-cover"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-28 flex items-center justify-center">
                  <IconRenderer name={opt.iconName} size={48} />
                </div>
              )}
              <span className="text-sm font-black text-center leading-tight py-3 px-2">{opt.label}</span>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};
