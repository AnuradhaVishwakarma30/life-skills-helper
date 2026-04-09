import { useState } from 'react';
import { ArrowLeft, GraduationCap, CheckCircle2, BookHeart } from 'lucide-react';
import { tasks } from '../data/tasks';
import { getAssignedTaskId, setAssignedTaskId } from '../utils/storage';
import { IconRenderer } from '../utils/IconRenderer';

interface TeacherDashboardProps {
  onBack: () => void;
}

export const TeacherDashboard = ({ onBack }: TeacherDashboardProps) => {
  const [assignedId, setAssignedId] = useState<string | null>(getAssignedTaskId);
  const [justAssigned, setJustAssigned] = useState<string | null>(null);

  const handleAssign = (taskId: string) => {
    setAssignedTaskId(taskId);
    setAssignedId(taskId);
    setJustAssigned(taskId);
    setTimeout(() => setJustAssigned(null), 1500);
  };

  const assignedTask = tasks.find((t) => t.id === assignedId);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
            <div className="w-px h-5 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <GraduationCap size={18} className="text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Teacher Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BookHeart size={16} className="text-primary" />
            <span className="text-sm text-primary font-semibold">LearnAbility</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Assign a Task</h1>
          <p className="text-muted-foreground">
            Select one life-skill task to assign to your student. They will see only this task on their dashboard.
          </p>
        </div>

        {assignedTask && (
          <div className={`mb-8 rounded-2xl border-2 ${assignedTask.colorBorder} ${assignedTask.colorLight} p-5 flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl ${assignedTask.colorBg} flex items-center justify-center flex-shrink-0 shadow-md`}>
              <IconRenderer name={assignedTask.iconName} size={24} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Currently Assigned</p>
              <p className={`text-lg font-bold ${assignedTask.colorText}`}>{assignedTask.name}</p>
            </div>
            <CheckCircle2 size={24} className={`ml-auto ${assignedTask.colorText}`} />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => {
            const isAssigned = task.id === assignedId;
            const wasJustAssigned = task.id === justAssigned;

            return (
              <div
                key={task.id}
                className={`bg-card rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                  isAssigned
                    ? `${task.colorBorder} shadow-lg`
                    : 'border-border hover:border-muted-foreground/20 hover:shadow-md'
                }`}
              >
                <div className={`h-1.5 ${task.colorBg}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${task.colorLight} flex items-center justify-center`}>
                      <IconRenderer name={task.iconName} size={24} className={task.colorText} />
                    </div>
                    {isAssigned && (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${task.colorLight} ${task.colorText}`}>
                        Assigned
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-foreground text-base mb-1">{task.name}</h3>
                  <p className="text-muted-foreground text-xs mb-5">
                    {task.steps.length} steps · Voice guided
                  </p>

                  <button
                    onClick={() => handleAssign(task.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isAssigned
                        ? `${task.colorBg} text-primary-foreground shadow-md cursor-default`
                        : wasJustAssigned
                        ? `${task.colorBg} text-primary-foreground`
                        : `${task.colorLight} ${task.colorText} hover:shadow-md hover:scale-[1.02]`
                    }`}
                    disabled={isAssigned}
                  >
                    {isAssigned ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle2 size={16} />
                        Assigned
                      </span>
                    ) : (
                      'Assign This Task'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
