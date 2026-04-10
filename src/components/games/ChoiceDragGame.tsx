import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GoldStarPopup } from './GoldStarPopup';
import { GameConfig } from './gameConfigs';
import { incrementViews } from '../../utils/storage';

interface ChoiceDragGameProps {
  taskId: string;
  config: GameConfig;
  onBack: () => void;
  onComplete: () => void;
}

export const ChoiceDragGame = ({ taskId, config, onBack, onComplete }: ChoiceDragGameProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [showStar, setShowStar] = useState(false);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successParticles, setSuccessParticles] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  const step = config.steps[stepIndex];
  const progress = ((stepIndex + (showSuccess ? 1 : 0)) / config.steps.length) * 100;

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.85;
      u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    }
  }, []);

  const playSound = useCallback((success: boolean) => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (success) {
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.15);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.3);
      } else {
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.setValueAtTime(200, ctx.currentTime + 0.15);
      }
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {}
  }, []);

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    });
  }, []);

  useEffect(() => {
    speak(step.voicePrompt);
  }, [stepIndex, speak, step.voicePrompt]);

  const isOverTarget = (point: { x: number; y: number }) => {
    if (!targetRef.current) return false;
    const rect = targetRef.current.getBoundingClientRect();
    return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
  };

  const handleCorrectDrop = useCallback(
    (_: any, info: { point: { x: number; y: number } }) => {
      if (transitioning || !isOverTarget(info.point)) return;
      playSound(true);
      fireConfetti();
      speak(step.successMessage);
      setShowSuccess(true);
      setSuccessParticles(true);
      setTransitioning(true);

      setTimeout(() => {
        setSuccessParticles(false);
      }, 1200);

      setTimeout(() => {
        if (stepIndex < config.steps.length - 1) {
          setStepIndex(prev => prev + 1);
          setShowSuccess(false);
          setTransitioning(false);
        } else {
          incrementViews(taskId);
          setShowStar(true);
        }
      }, 1800);
    },
    [transitioning, stepIndex, config.steps.length, playSound, fireConfetti, speak, step.successMessage, taskId]
  );

  const handleWrongDrop = useCallback(
    (_: any, info: { point: { x: number; y: number } }) => {
      if (transitioning || !isOverTarget(info.point)) return;
      playSound(false);
      speak('Try the other one!');
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 600);
    },
    [transitioning, playSound, speak]
  );

  // Randomize left/right position of correct vs wrong
  const [flipped] = useState(() => Math.random() > 0.5);

  const leftChoice = flipped
    ? { emoji: step.wrongEmoji, label: step.wrongLabel, handler: handleWrongDrop, isCorrect: false }
    : { emoji: step.correctEmoji, label: step.correctLabel, handler: handleCorrectDrop, isCorrect: true };

  const rightChoice = flipped
    ? { emoji: step.correctEmoji, label: step.correctLabel, handler: handleCorrectDrop, isCorrect: true }
    : { emoji: step.wrongEmoji, label: step.wrongLabel, handler: handleWrongDrop, isCorrect: false };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${config.bgGradient} flex flex-col`}>
      {/* Header */}
      <header className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button
          onClick={() => { window.speechSynthesis?.cancel(); onBack(); }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span>Exit</span>
        </button>
        <span className="text-sm font-bold">{config.emoji} {config.title}</span>
      </header>

      {/* Progress */}
      <div className="px-6 mb-2">
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-right">
          Step {stepIndex + 1} of {config.steps.length}
        </p>
      </div>

      {/* Voice prompt */}
      <motion.div
        key={`prompt-${stepIndex}`}
        className="px-6 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border text-center">
          <p className="text-lg font-bold text-foreground">🗣️ {step.voicePrompt}</p>
        </div>
      </motion.div>

      {/* Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-8 relative overflow-hidden">
        {/* Target area */}
        <motion.div
          ref={targetRef}
          className={`w-36 h-36 rounded-3xl border-4 border-dashed flex flex-col items-center justify-center gap-2 transition-colors duration-300 ${
            showSuccess
              ? 'border-green-400 bg-green-50'
              : 'border-muted-foreground/30 bg-card'
          }`}
          animate={shakeWrong ? { x: [-12, 12, -12, 12, 0], borderColor: '#ef4444' } : {}}
          transition={{ duration: 0.4 }}
        >
          {showSuccess ? (
            <motion.span
              className="text-5xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {step.successEmoji}
            </motion.span>
          ) : (
            <>
              <span className="text-5xl">{step.targetEmoji}</span>
              <span className="text-xs font-bold text-muted-foreground">{step.targetLabel}</span>
            </>
          )}

          {/* Success particles */}
          <AnimatePresence>
            {successParticles && [...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-yellow-300"
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: Math.cos((i * Math.PI * 2) / 6) * 80,
                  y: Math.sin((i * Math.PI * 2) / 6) * 80,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Instruction */}
        <p className="text-sm text-muted-foreground font-semibold">
          👆 Drag the correct item onto the target!
        </p>

        {/* Draggable choices */}
        {!showSuccess && (
          <div className="flex items-center justify-center gap-10">
            <DraggableChoice
              emoji={leftChoice.emoji}
              label={leftChoice.label}
              isCorrect={leftChoice.isCorrect}
              onDragEnd={leftChoice.handler}
            />
            <DraggableChoice
              emoji={rightChoice.emoji}
              label={rightChoice.label}
              isCorrect={rightChoice.isCorrect}
              onDragEnd={rightChoice.handler}
            />
          </div>
        )}

        {showSuccess && !showStar && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xl font-bold text-green-600">{step.successMessage}</p>
          </motion.div>
        )}
      </main>

      <GoldStarPopup show={showStar} onDone={onComplete} />
    </div>
  );
};

interface DraggableChoiceProps {
  emoji: string;
  label: string;
  isCorrect: boolean;
  onDragEnd: (event: any, info: any) => void;
}

const DraggableChoice = ({ emoji, label, onDragEnd }: DraggableChoiceProps) => (
  <motion.div
    className="w-24 h-24 rounded-2xl bg-card border-2 border-border shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none"
    drag
    dragSnapToOrigin
    onDragEnd={onDragEnd}
    whileDrag={{ scale: 1.15, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
    whileHover={{ scale: 1.05 }}
    animate={{ y: [0, -4, 0] }}
    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
  >
    <span className="text-3xl">{emoji}</span>
    <span className="text-[10px] font-bold text-muted-foreground mt-1">{label}</span>
  </motion.div>
);
