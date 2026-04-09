import { useState } from 'react';
import { AppView } from '../types';
import { LandingPage } from '../components/LandingPage';
import { TeacherDashboard } from '../components/TeacherDashboard';
import { StudentDashboard } from '../components/StudentDashboard';
import { TaskGame } from '../components/TaskGame';
import { tasks } from '../data/tasks';
import { getAssignedTaskId } from '../utils/storage';

const Index = () => {
  const [view, setView] = useState<AppView>('landing');
  const assignedTask = tasks.find((t) => t.id === getAssignedTaskId());

  const navigateTo = (v: AppView) => setView(v);

  if (view === 'teacher') {
    return <TeacherDashboard onBack={() => navigateTo('landing')} />;
  }

  if (view === 'student') {
    return (
      <StudentDashboard
        onBack={() => navigateTo('landing')}
        onStartTask={() => navigateTo('game')}
      />
    );
  }

  if (view === 'game' && assignedTask) {
    return (
      <TaskGame
        task={assignedTask}
        onBack={() => navigateTo('landing')}
        onComplete={() => navigateTo('student')}
      />
    );
  }

  return <LandingPage onSelect={navigateTo} />;
};

export default Index;
