import { useState, useEffect, useCallback } from 'react';
import { BookHeart, Users, Play, AlertCircle } from 'lucide-react';
import { tasks } from '../data/tasks';
import { TaskGame } from '../components/TaskGame';
import { supabase } from '@/integrations/supabase/client';
import { getViewsForTask, isTaskLimitReached, MAX_TASK_VIEWS, incrementViews } from '../utils/storage';
import { IconRenderer } from '../utils/IconRenderer';

interface Student {
  id: string;
  name: string;
  attempts: number;
  status: string;
  assigned_task: string | null;
  success_count: number;
  progress_percent: number;
}

const StudentPage = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [playing, setPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [globalTaskId, setGlobalTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch students from cloud
  const fetchStudents = async () => {
    const { data } = await supabase.from('students').select('*').order('created_at');
    if (data) setStudents(data);
  };

  // Fetch global task from cloud
  const fetchGlobalTask = async () => {
    const { data } = await supabase.from('settings').select('value').eq('key', 'global_task_id').single();
    setGlobalTaskId(data?.value || null);
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchStudents(), fetchGlobalTask()]);
      setLoading(false);
    };
    init();

    // Real-time: listen for task changes from teacher
    const settingsChannel = supabase
      .channel('student-settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
        fetchGlobalTask();
      })
      .subscribe();

    // Real-time: listen for student list changes
    const studentsChannel = supabase
      .channel('student-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => {
        fetchStudents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(settingsChannel);
      supabase.removeChannel(studentsChannel);
    };
  }, []);

  const task = tasks.find((t) => t.id === globalTaskId);
  const limitReached = task ? isTaskLimitReached(task.id) : false;

  const handleStart = useCallback(() => {
    if (task) {
      incrementViews(task.id);
      setPlaying(true);
    }
  }, [task]);

  const handleComplete = useCallback(async () => {
    if (selectedStudent) {
      const newAttempts = selectedStudent.attempts + 1;
      const newStatus = newAttempts >= 5 ? 'Mastered' : 'In Progress';
      await supabase
        .from('students')
        .update({ attempts: newAttempts, status: newStatus })
        .eq('id', selectedStudent.id);
    }
    setPlaying(false);
    setCompleted(true);
  }, [selectedStudent]);

  const handleDone = () => {
    setSelectedStudent(null);
    setCompleted(false);
    setPlaying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg">Loading...</p>
      </div>
    );
  }

  // Full-screen game view
  if (playing && task) {
    return (
      <TaskGame
        task={task}
        onBack={() => setPlaying(false)}
        onComplete={handleComplete}
      />
    );
  }

  // Completion screen
  if (completed && task) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-6">
        <div className="text-6xl mb-6">⭐</div>
        <h1 className="text-4xl font-black text-foreground mb-3 text-center">Great Job, {selectedStudent?.name}!</h1>
        <p className="text-xl text-muted-foreground mb-10 text-center">You completed <strong>{task.name}</strong> successfully!</p>
        <button
          onClick={handleDone}
          className="bg-primary text-primary-foreground font-bold text-xl px-12 py-5 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          Done
        </button>
      </div>
    );
  }

  // Student selected — show task card
  if (selectedStudent && task) {
    const views = getViewsForTask(task.id);
    const remaining = MAX_TASK_VIEWS - views;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-primary/5 flex flex-col">
        <header className="px-6 pt-6 pb-4 flex items-center justify-between">
          <button onClick={() => setSelectedStudent(null)} className="text-muted-foreground hover:text-foreground text-sm font-medium">
            ← Back to names
          </button>
          <div className="flex items-center gap-2">
            <BookHeart size={16} className="text-primary" />
            <span className="text-sm text-primary font-semibold">LearnAbility</span>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">Hello, {selectedStudent.name}!</h1>
          <p className="text-muted-foreground mb-8">Your teacher assigned this task for you.</p>

          <div className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl" style={{ minHeight: 340 }}>
            <div className={`${task.colorBg} p-10 flex flex-col items-center justify-center text-center`}>
              <div className="w-28 h-28 rounded-3xl bg-primary-foreground/20 flex items-center justify-center mb-6 shadow-lg">
                <IconRenderer name={task.iconName} size={56} className="text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold text-primary-foreground mb-3">{task.name}</h2>
              <p className="text-primary-foreground/80 text-sm mb-6">{remaining} of {MAX_TASK_VIEWS} tries left today</p>

              {limitReached ? (
                <div className="bg-primary-foreground/20 rounded-2xl px-8 py-4 flex flex-col items-center gap-2">
                  <AlertCircle size={28} className="text-primary-foreground" />
                  <p className="text-primary-foreground font-bold text-lg">Limit Reached — Try Tomorrow</p>
                </div>
              ) : (
                <button
                  onClick={handleStart}
                  className="flex items-center gap-3 bg-card text-foreground font-bold text-xl px-10 py-4 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <Play size={22} className={task.colorText} fill="currentColor" />
                  Start Task
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Name selection list
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-primary/5 flex flex-col items-center justify-center px-6 py-12">
      <div className="flex items-center gap-2 mb-2">
        <BookHeart size={24} className="text-primary" />
        <span className="text-primary font-bold text-lg">LearnAbility</span>
      </div>
      <h1 className="text-4xl font-black text-foreground mb-2">Student Portal</h1>
      <p className="text-muted-foreground mb-10">Select your name to begin</p>

      {!task && (
        <div className="bg-muted rounded-2xl p-8 text-center max-w-sm mb-8">
          <AlertCircle size={32} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-bold mb-1">No Task Assigned</p>
          <p className="text-muted-foreground text-sm">Ask your teacher to assign a task first.</p>
        </div>
      )}

      {students.length === 0 ? (
        <div className="bg-muted rounded-2xl p-8 text-center max-w-sm">
          <Users size={32} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-bold mb-1">No Students Enrolled</p>
          <p className="text-muted-foreground text-sm">Ask your teacher to enroll you first.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg w-full">
          {students.map((s) => (
            <button
              key={s.id}
              onClick={() => task && setSelectedStudent(s)}
              disabled={!task}
              className="bg-card rounded-2xl border-2 border-border p-6 flex flex-col items-center gap-3 shadow-sm hover:shadow-lg hover:border-primary/40 hover:scale-[1.03] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {s.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-bold text-foreground text-base">{s.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentPage;
