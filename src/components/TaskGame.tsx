import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Volume2, Home, PartyPopper } from 'lucide-react';
import { Task } from '../types';
import { incrementViews } from '../utils/storage';
import { IconRenderer } from '../utils/IconRenderer';
import { HandWashingGame } from './games/HandWashingGame';
import { RoadCrossingGame } from './games/RoadCrossingGame';
import { DeepBreathingGame } from './games/DeepBreathingGame';
import { MorningGreetingGame } from './games/MorningGreetingGame';
import { BrushingTeethGame } from './games/BrushingTeethGame';
import { AskingForHelpGame } from './games/AskingForHelpGame';
import { SortingZoneGame } from './games/SortingZoneGame';
import { DragChoiceGame } from './games/DragChoiceGame';
import { GifStepGame } from './games/GifStepGame';
import { sortingConfigs } from '../data/sortingConfigs';
import { dragChoiceConfigs } from '../data/dragChoiceConfigs';
import { gifStepConfigs } from '../data/gifStepConfigs';

interface TaskGameProps {
  task: Task;
  onBack: () => void;
  onComplete: () => void;
}

export const TaskGame = ({ task, onBack, onComplete }: TaskGameProps) => {
  // Lottie-based games
  if (task.id === 'hand-washing') return <HandWashingGame onBack={onBack} onComplete={onComplete} />;
  if (task.id === 'road-crossing') return <RoadCrossingGame onBack={onBack} onComplete={onComplete} />;
  if (task.id === 'deep-breathing') return <DeepBreathingGame onBack={onBack} onComplete={onComplete} />;
  if (task.id === 'morning-greeting') return <MorningGreetingGame onBack={onBack} onComplete={onComplete} />;
  if (task.id === 'tooth-brushing') return <BrushingTeethGame onBack={onBack} onComplete={onComplete} />;
  if (task.id === 'asking-for-help') return <AskingForHelpGame onBack={onBack} onComplete={onComplete} />;

  // GIF-step games (Taking a Bath, Making Friends, Eating Manners, Dressing Up, Saving Electricity, etc.)
  if (gifStepConfigs[task.id]) return <GifStepGame config={gifStepConfigs[task.id]} onBack={onBack} onComplete={onComplete} />;

  // Drag-choice games
  if (dragChoiceConfigs[task.id]) return <DragChoiceGame config={dragChoiceConfigs[task.id]} onBack={onBack} onComplete={onComplete} />;

  // Sorting zone games
  if (sortingConfigs[task.id]) return <SortingZoneGame config={sortingConfigs[task.id]} onBack={onBack} onComplete={onComplete} />;

  return <DefaultTaskGame task={task} onBack={onBack} onComplete={onComplete} />;
};

const DefaultTaskGame = ({ task, onBack, onComplete }: TaskGameProps) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [completed, setCompleted] = useState(false);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  useEffect(() => {
    incrementViews(task.id);
    speak(task.voiceMessage);
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [task, speak]);

  const handleNext = () => {
    if (currentStep < task.steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      speak(task.steps[nextStep].text);
    } else {
      setCompleted(true);
      speak("Great job! You completed the task! You are amazing!");
    }
  };

  const step = currentStep >= 0 ? task.steps[currentStep] : null;
  const progress = currentStep >= 0 ? ((currentStep + 1) / task.steps.length) * 100 : 0;

  if (completed) {
    return (
      <div className={`min-h-screen ${task.colorBg} flex flex-col items-center justify-center px-6`}>
        <div className="animate-bounce-gentle mb-8">
          <PartyPopper size={80} className="text-primary-foreground drop-shadow-lg" />
        </div>
        <h1 className="text-5xl font-black text-primary-foreground mb-4 text-center">
          Amazing Job! 🎉
        </h1>
        <p className="text-primary-foreground/80 text-xl mb-10 text-center max-w-sm">
          You completed <strong>{task.name}</strong> successfully!
        </p>
        <button
          onClick={onComplete}
          className="flex items-center gap-3 bg-card text-foreground font-bold text-xl px-12 py-5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Home size={24} />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button
          onClick={() => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            onBack();
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-lg font-bold"
        >
          <ArrowLeft size={22} />
          <span>Exit</span>
        </button>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${task.colorBg} flex items-center justify-center`}>
            <IconRenderer name={task.iconName} size={16} className="text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">{task.name}</span>
        </div>
      </header>

      <div className="px-6 mb-2">
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full ${task.colorBg} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm font-semibold text-muted-foreground mt-2 text-right">
          {currentStep >= 0 ? `Step ${currentStep + 1} of ${task.steps.length}` : 'Ready to start'}
        </p>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {currentStep < 0 ? (
          <div className="text-center animate-scale-in">
            <div className={`w-36 h-36 rounded-3xl ${task.colorLight} flex items-center justify-center mx-auto mb-8 animate-pulse-slow`}>
              <IconRenderer name={task.iconName} size={72} className={task.colorText} />
            </div>
            <h2 className="text-3xl font-black text-foreground mb-3">{task.name}</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-sm">{task.voiceMessage}</p>
          </div>
        ) : step ? (
          <div className="text-center animate-scale-in" key={currentStep}>
            <div className={`w-40 h-40 rounded-3xl ${task.colorLight} flex items-center justify-center mx-auto mb-8 animate-float`}>
              <IconRenderer name={step.iconName} size={80} className={task.colorText} />
            </div>
            <h2 className="text-3xl font-black text-foreground mb-2">
              Step {currentStep + 1}
            </h2>
            <p className="text-xl text-muted-foreground max-w-sm">{step.text}</p>
          </div>
        ) : null}
      </main>

      <div className="px-6 pb-8 flex flex-col items-center gap-4">
        <button
          onClick={() => speak(currentStep < 0 ? task.voiceMessage : step?.text || '')}
          className={`flex items-center gap-2 ${task.colorLight} ${task.colorText} px-6 py-3 rounded-xl text-base font-bold hover:shadow-md transition-all`}
        >
          <Volume2 size={20} />
          Listen Again
        </button>

        <button
          onClick={handleNext}
          className={`flex items-center gap-3 ${task.colorBg} text-primary-foreground font-black text-xl px-14 py-5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200`}
        >
          {currentStep < task.steps.length - 1 ? (
            <>
              Next Step
              <ArrowRight size={24} />
            </>
          ) : (
            <>
              Finish
              <CheckCircle size={24} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
