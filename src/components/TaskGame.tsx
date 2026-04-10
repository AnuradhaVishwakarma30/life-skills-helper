import { Task } from '../types';
import { ChoiceDragGame } from './games/ChoiceDragGame';
import { gameConfigs } from './games/gameConfigs';

interface TaskGameProps {
  task: Task;
  onBack: () => void;
  onComplete: () => void;
}

export const TaskGame = ({ task, onBack, onComplete }: TaskGameProps) => {
  const config = gameConfigs[task.id];

  if (!config) {
    // Fallback — shouldn't happen with all 15 configured
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">Game not configured for this task.</p>
      </div>
    );
  }

  return (
    <ChoiceDragGame
      taskId={task.id}
      config={config}
      onBack={onBack}
      onComplete={onComplete}
    />
  );
};
