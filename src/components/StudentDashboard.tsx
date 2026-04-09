import { ArrowLeft, Star, Clock, BookHeart, AlertCircle, Play } from 'lucide-react';
import { tasks } from '../data/tasks';
import { getAssignedTaskId, getViewsForTask, isTaskLimitReached, MAX_TASK_VIEWS } from '../utils/storage';
import { IconRenderer } from '../utils/IconRenderer';

interface StudentDashboardProps {
  onBack: () => void;
  onStartTask: () => void;
}

export const StudentDashboard = ({ onBack, onStartTask }: StudentDashboardProps) => {
  const assignedId = getAssignedTaskId();
  const task = tasks.find((t) => t.id === assignedId);
  const views = task ? getViewsForTask(task.id) : 0;
  const limitReached = task ? isTaskLimitReached(task.id) : false;
  const remaining = MAX_TASK_VIEWS - views;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-primary/5 flex flex-col">
      <header className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-2">
          <BookHeart size={16} className="text-primary" />
          <span className="text-sm text-primary font-semibold">LearnAbility</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        {!task ? (
          <NoTaskAssigned />
        ) : (
          <div className="w-full max-w-lg animate-scale-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Hello, Learner!</h1>
              <p className="text-muted-foreground">Your teacher has assigned a task for you today.</p>
            </div>

            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.01]"
              style={{ minHeight: '380px' }}
            >
              <div className={`${task.colorBg} p-10 flex flex-col items-center justify-center text-center`}>
                <div className="absolute top-4 right-4 opacity-10">
                  <IconRenderer name={task.iconName} size={120} className="text-primary-foreground" />
                </div>

                <div className="w-28 h-28 rounded-3xl bg-primary-foreground/20 flex items-center justify-center mb-6 shadow-lg backdrop-blur-sm animate-pulse-slow">
                  <IconRenderer name={task.iconName} size={56} className="text-primary-foreground drop-shadow-lg" />
                </div>

                <h2 className="text-3xl font-bold text-primary-foreground mb-3 drop-shadow">
                  {task.name}
                </h2>

                <div className="flex items-center gap-3 text-primary-foreground/90 text-sm mb-8">
                  <div className="flex items-center gap-1.5 bg-primary-foreground/20 rounded-full px-3 py-1">
                    <Star size={13} className="text-yellow-300" />
                    <span>{task.steps.length} steps</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-primary-foreground/20 rounded-full px-3 py-1">
                    <Clock size={13} />
                    <span>{remaining} of {MAX_TASK_VIEWS} tries left</span>
                  </div>
                </div>

                {limitReached ? (
                  <div className="bg-primary-foreground/20 rounded-2xl px-8 py-4 flex flex-col items-center gap-2">
                    <AlertCircle size={28} className="text-primary-foreground" />
                    <p className="text-primary-foreground font-bold text-lg">Try again tomorrow!</p>
                    <p className="text-primary-foreground/80 text-sm">You've practiced this task {MAX_TASK_VIEWS} times today.</p>
                  </div>
                ) : (
                  <button
                    onClick={onStartTask}
                    className="flex items-center gap-3 bg-card text-foreground font-bold text-lg px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    <Play size={22} className={task.colorText} fill="currentColor" />
                    Start Task
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: MAX_TASK_VIEWS }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i < views ? task.colorBg : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-3">
              {views === 0 ? 'Start your first practice!' : `${views} of ${MAX_TASK_VIEWS} practices completed`}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

const NoTaskAssigned = () => (
  <div className="text-center max-w-sm animate-scale-in">
    <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
      <Clock size={40} className="text-muted-foreground" />
    </div>
    <h2 className="text-2xl font-bold text-foreground mb-3">No Task Assigned Yet</h2>
    <p className="text-muted-foreground leading-relaxed">
      Ask your teacher to assign a life-skill task for you. Come back once it's ready!
    </p>
  </div>
);
