import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Volume2, Home, PartyPopper } from 'lucide-react';
import { Task } from '../types';
import { incrementViews } from '../utils/storage';
import { IconRenderer } from '../utils/IconRenderer';
import { HandWashingGame } from './games/HandWashingGame';
import { RoadCrossingGame } from './games/RoadCrossingGame';
import { DeepBreathingGame } from './games/DeepBreathingGame';
import { MorningGreetingGame } from './games/MorningGreetingGame';
import { SortingZoneGame } from './games/SortingZoneGame';
import { sortingConfigs } from '../data/sortingConfigs';

interface TaskGameProps {
  task: Task;
  onBack: () => void;
  onComplete: () => void;
}

export const TaskGame = ({ task, onBack, onComplete }: TaskGameProps) => {
  if (task.id === 'hand-washing') {
    return <HandWashingGame onBack={onBack} onComplete={onComplete} />;
  }
  if (task.id === 'road-crossing') {
    return <RoadCrossingGame onBack={onBack} onComplete={onComplete} />;
  }
  if (task.id === 'deep-breathing') {
    return <DeepBreathingGame onBack={onBack} onComplete={onComplete} />;
  }
  if (task.id === 'morning-greeting') {
    return <MorningGreetingGame onBack={onBack} onComplete={onComplete} />;
  }
  if (sortingConfigs[task.id]) {
    return <SortingZoneGame config={sortingConfigs[task.id]} onBack={onBack} onComplete={onComplete} />;
  }
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
        <h1 className="text-4xl font-black text-primary-foreground mb-4 text-center">
          Amazing Job! 🎉
        </h1>
        <p className="text-primary-foreground/80 text-lg mb-10 text-center max-w-sm">
          You completed <strong>{task.name}</strong> successfully!
        </p>
        <button
          onClick={onComplete}
          className="flex items-center gap-3 bg-card text-foreground font-bold text-lg px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Home size={22} />
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
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span>Exit</span>
        </button>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-lg ${task.colorBg} flex items-center justify-center`}>
            <IconRenderer name={task.iconName} size={14} className="text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground">{task.name}</span>
        </div>
      </header>

      <div className="px-6 mb-2">
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full ${task.colorBg} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-right">
          {currentStep >= 0 ? `Step ${currentStep + 1} of ${task.steps.length}` : 'Ready to start'}
        </p>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {currentStep < 0 ? (
          <div className="text-center animate-scale-in">
            <div className={`w-32 h-32 rounded-3xl ${task.colorLight} flex items-center justify-center mx-auto mb-8 animate-pulse-slow`}>
              <IconRenderer name={task.iconName} size={64} className={task.colorText} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">{task.name}</h2>
            <p className="text-muted-foreground mb-8 max-w-sm">{task.voiceMessage}</p>
          </div>
        ) : step ? (
          <div className="text-center animate-scale-in" key={currentStep}>
            <div className={`w-36 h-36 rounded-3xl ${task.colorLight} flex items-center justify-center mx-auto mb-8 animate-float`}>
              <IconRenderer name={step.iconName} size={72} className={task.colorText} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Step {currentStep + 1}
            </h2>
            <p className="text-lg text-muted-foreground max-w-sm">{step.text}</p>
          </div>
        ) : null}
      </main>

      <div className="px-6 pb-8 flex flex-col items-center gap-4">
        <button
          onClick={() => speak(currentStep < 0 ? task.voiceMessage : step?.text || '')}
          className={`flex items-center gap-2 ${task.colorLight} ${task.colorText} px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-md transition-all`}
        >
          <Volume2 size={18} />
          Listen Again
        </button>

        <button
          onClick={handleNext}
          className={`flex items-center gap-3 ${task.colorBg} text-primary-foreground font-bold text-lg px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200`}
        >
          {currentStep < task.steps.length - 1 ? (
            <>
              Next Step
              <ArrowRight size={22} />
            </>
          ) : (
            <>
              Finish
              <CheckCircle size={22} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
