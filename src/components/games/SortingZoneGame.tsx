import { useState, useCallback, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { IconRenderer } from '../../utils/IconRenderer';
import { GoldStarPopup } from './GoldStarPopup';
import { incrementViews } from '../../utils/storage';

interface SortingItem {
  id: string;
  label: string;
  iconName: string;
  correctZone: number;
}

export interface SortingConfig {
  taskId: string;
  taskName: string;
  colorBg: string;
  colorText: string;
  voiceIntro: string;
  zones: [string, string];
  zoneEmojis: [string, string];
  items: SortingItem[];
}

interface SortingZoneGameProps {
  config: SortingConfig;
  onBack: () => void;
  onComplete: () => void;
}

export const SortingZoneGame = ({ config, onBack, onComplete }: SortingZoneGameProps) => {
  const [sorted, setSorted] = useState<Record<string, number | null>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showStar, setShowStar] = useState(false);
  const zone0Ref = useRef<HTMLDivElement>(null);
  const zone1Ref = useRef<HTMLDivElement>(null);

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
    incrementViews(config.taskId);
    speak(config.voiceIntro);
    return () => { window.speechSynthesis?.cancel(); };
  }, [config, speak]);

  const remaining = config.items.filter((item) => sorted[item.id] === undefined);
  const allDone = remaining.length === 0 && !feedback;

  useEffect(() => {
    if (allDone && !showStar) {
      speak('Amazing! You sorted everything correctly!');
      setTimeout(() => setShowStar(true), 800);
    }
  }, [allDone, showStar, speak]);

  const handleDragEnd = (item: SortingItem, info: { point: { x: number; y: number } }) => {
    const point = info.point;
    const checkZone = (ref: React.RefObject<HTMLDivElement | null>, zoneIndex: number) => {
      if (!ref.current) return false;
      const rect = ref.current.getBoundingClientRect();
      return (
        point.x >= rect.left && point.x <= rect.right &&
        point.y >= rect.top && point.y <= rect.bottom
      ) ? zoneIndex : null;
    };

    const droppedZone = checkZone(zone0Ref, 0) ?? checkZone(zone1Ref, 1);

    if (droppedZone !== null) {
      if (droppedZone === item.correctZone) {
        setSorted((prev) => ({ ...prev, [item.id]: droppedZone }));
        speak(`Great! ${item.label} goes in ${config.zones[droppedZone]}!`);
        setFeedback(null);
      } else {
        setFeedback(`Oops! ${item.label} doesn't go there. Try again!`);
        speak(`Oops! Try again!`);
        setTimeout(() => setFeedback(null), 2000);
      }
    }
  };

  if (showStar) {
    return <GoldStarPopup show onDone={onComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-sky-50 flex flex-col">
      <header className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button
          onClick={() => { window.speechSynthesis?.cancel(); onBack(); }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span>Exit</span>
        </button>
        <span className="text-sm font-semibold text-foreground">{config.taskName}</span>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-6 gap-6">
        <h2 className="text-xl font-bold text-foreground text-center">
          Sort the items into the right group!
        </h2>

        {/* Drop zones */}
        <div className="flex gap-4 w-full max-w-lg">
          {[0, 1].map((zoneIndex) => (
            <div
              key={zoneIndex}
              ref={zoneIndex === 0 ? zone0Ref : zone1Ref}
              className="flex-1 min-h-[160px] rounded-2xl border-3 border-dashed border-muted-foreground/30 bg-card flex flex-col items-center justify-center gap-2 p-4"
            >
              <span className="text-4xl">{config.zoneEmojis[zoneIndex]}</span>
              <span className="font-bold text-foreground text-lg">{config.zones[zoneIndex]}</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {config.items
                  .filter((item) => sorted[item.id] === zoneIndex)
                  .map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold"
                    >
                      <CheckCircle size={14} />
                      {item.label}
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {feedback && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 font-semibold text-center"
          >
            {feedback}
          </motion.p>
        )}

        {/* Draggable items */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {remaining.map((item) => (
            <motion.div
              key={item.id}
              drag
              dragSnapToOrigin
              onDragEnd={(_, info) => handleDragEnd(item, info)}
              whileDrag={{ scale: 1.15, zIndex: 50 }}
              className="w-24 h-24 rounded-2xl bg-card shadow-lg border-2 border-muted flex flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing touch-none select-none"
            >
              <IconRenderer name={item.iconName} size={32} className={config.colorText} />
              <span className="text-xs font-semibold text-foreground text-center leading-tight">{item.label}</span>
            </motion.div>
          ))}
        </div>

        {remaining.length === 0 && !showStar && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-600 font-bold text-lg"
          >
            All sorted! ✨
          </motion.p>
        )}
      </main>
    </div>
  );
};
