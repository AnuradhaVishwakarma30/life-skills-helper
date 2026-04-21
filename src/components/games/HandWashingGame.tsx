import { GifStepGame } from './GifStepGame';
import { gifStepConfigs } from '../../data/gifStepConfigs';

interface HandWashingGameProps {
  onBack: () => void;
  onComplete: () => void;
}

/**
 * Hand Washing now uses the shared GifStepGame engine driven by the
 * 9-step sequence in gifStepConfigs['hand-washing'].
 */
export const HandWashingGame = ({ onBack, onComplete }: HandWashingGameProps) => (
  <GifStepGame
    config={gifStepConfigs['hand-washing']}
    onBack={onBack}
    onComplete={onComplete}
  />
);
