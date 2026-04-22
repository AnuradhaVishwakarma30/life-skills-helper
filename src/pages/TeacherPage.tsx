import { useState, useEffect } from 'react';
import { GraduationCap, CheckCircle2, BookHeart, UserPlus, Trash2, Lock, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';
import { tasks } from '../data/tasks';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const TEACHER_PIN = '4321';

interface Student {
  id: string;
  name: string;
  assigned_task: string | null;
  created_at: string;
}

interface TaskProgress {
  id: string;
  student_id: string;
  task_id: string;
  attempts: number;
  success_count: number;
  status: string;
  last_played_at: string | null;
}

const taskNameById = (id: string) => tasks.find((t) => t.id === id)?.name ?? id;

const TeacherPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [progress, setProgress] = useState<TaskProgress[]>([]);
  const [globalTask, setGlobalTask] = useState('');
  const [newName, setNewName] = useState('');
  const [newTask, setNewTask] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const handlePinSubmit = () => {
    if (pin === TEACHER_PIN) { setAuthenticated(true); setPinError(false); }
    else setPinError(true);
  };

  const fetchStudents = async () => {
    const { data } = await supabase.from('students').select('*').order('created_at');
    if (data) setStudents(data as Student[]);
  };

  const fetchProgress = async () => {
    const { data } = await supabase.from('student_task_progress').select('*');
    if (data) setProgress(data as TaskProgress[]);
  };

  const fetchGlobalTask = async () => {
    const { data } = await supabase.from('settings').select('value').eq('key', 'global_task_id').maybeSingle();
    if (data?.value) setGlobalTask(data.value);
  };

  useEffect(() => {
    if (!authenticated) return;
    fetchStudents();
    fetchProgress();
    fetchGlobalTask();

    const channel = supabase
      .channel('teacher-data')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, fetchStudents)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'student_task_progress' }, fetchProgress)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [authenticated]);

  const handleEnroll = async () => {
    const name = newName.trim();
    if (!name) return;
    await supabase.from('students').insert({ name, assigned_task: newTask || null });
    setNewName(''); setNewTask('');
    fetchStudents();
  };

  const handleRemove = async (id: string) => {
    await supabase.from('students').delete().eq('id', id);
    fetchStudents();
    fetchProgress();
  };

  const handleStudentTaskChange = async (studentId: string, taskId: string) => {
    // Assigning a new task does NOT delete existing progress history.
    // The new task starts at 0 attempts because progress is tracked per (student, task).
    await supabase.from('students').update({ assigned_task: taskId }).eq('id', studentId);
    fetchStudents();
  };

  const handleResetTask = async (studentId: string, taskId: string) => {
    // Reset only this one (student, task) pair — other tasks remain untouched.
    await supabase
      .from('student_task_progress')
      .update({ attempts: 0, success_count: 0, status: 'Not Started', last_played_at: null })
      .eq('student_id', studentId)
      .eq('task_id', taskId);
    fetchProgress();
  };

  const handleTaskChange = async (taskId: string) => {
    setGlobalTask(taskId);
    await supabase.from('settings').upsert({ key: 'global_task_id', value: taskId }, { onConflict: 'key' });
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const getProgressForStudent = (studentId: string) =>
    progress.filter((p) => p.student_id === studentId).sort((a, b) => {
      const ta = a.last_played_at ? new Date(a.last_played_at).getTime() : 0;
      const tb = b.last_played_at ? new Date(b.last_played_at).getTime() : 0;
      return tb - ta;
    });

  const selectedTask = tasks.find((t) => t.id === globalTask);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Lock size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl font-black text-foreground">Teacher Access</h1>
          <p className="text-muted-foreground">Enter your PIN to continue</p>
          <Input
            type="password"
            maxLength={4}
            placeholder="Enter 4-digit PIN"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setPinError(false); }}
            onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
            className="text-center text-2xl tracking-[0.5em] font-mono"
          />
          {pinError && <p className="text-destructive text-sm font-semibold">Incorrect PIN. Try again.</p>}
          <button onClick={handlePinSubmit} className="w-full bg-primary text-primary-foreground font-bold text-lg px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap size={18} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-lg">Teacher Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <BookHeart size={16} className="text-primary" />
            <span className="text-sm text-primary font-semibold">LearnAbility</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-2">Default Global Task</h2>
          <p className="text-muted-foreground text-sm mb-4">Used when a student has no individually assigned task.</p>
          <div className="flex items-center gap-4 flex-wrap">
            <Select value={globalTask} onValueChange={handleTaskChange}>
              <SelectTrigger className="w-72"><SelectValue placeholder="Select a task..." /></SelectTrigger>
              <SelectContent>
                {tasks.map((t) => (<SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>))}
              </SelectContent>
            </Select>
            {selectedTask && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${selectedTask.colorLight} ${selectedTask.colorText} text-sm font-semibold`}>
                <CheckCircle2 size={14} />{selectedTask.name} assigned
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Enroll Student</h2>
          <div className="flex gap-3 flex-wrap items-center">
            <Input
              placeholder="Student name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEnroll()}
              className="text-base max-w-xs"
            />
            <Select value={newTask} onValueChange={setNewTask}>
              <SelectTrigger className="w-64"><SelectValue placeholder="Assign a task (optional)..." /></SelectTrigger>
              <SelectContent>
                {tasks.map((t) => (<SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>))}
              </SelectContent>
            </Select>
            <button onClick={handleEnroll} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-xl font-semibold hover:opacity-90 transition-opacity">
              <UserPlus size={18} />Add Student
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Students & Task History</h2>
          {students.length === 0 ? (
            <p className="text-muted-foreground">No students enrolled yet. Add a student above.</p>
          ) : (
            <div className="space-y-3">
              {students.map((s) => {
                const isOpen = expanded.has(s.id);
                const history = getProgressForStudent(s.id);
                const totalAttempts = history.reduce((sum, h) => sum + h.attempts, 0);
                const tasksTouched = history.length;

                return (
                  <div key={s.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                    <button
                      onClick={() => toggleExpand(s.id)}
                      className="w-full p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors text-left"
                    >
                      {isOpen ? <ChevronDown size={20} className="text-muted-foreground flex-shrink-0" /> : <ChevronRight size={20} className="text-muted-foreground flex-shrink-0" />}
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-foreground">{s.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {tasksTouched} task{tasksTouched === 1 ? '' : 's'} played · {totalAttempts} total attempt{totalAttempts === 1 ? '' : 's'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <Select value={s.assigned_task ?? ''} onValueChange={(v) => handleStudentTaskChange(s.id, v)}>
                          <SelectTrigger className="w-48 h-9"><SelectValue placeholder="— Assign task —" /></SelectTrigger>
                          <SelectContent>
                            {tasks.map((t) => (<SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>))}
                          </SelectContent>
                        </Select>
                        <button onClick={() => handleRemove(s.id)} className="text-destructive hover:opacity-70 transition-opacity p-2">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-border bg-muted/20 p-4">
                        <h4 className="font-semibold text-sm text-foreground mb-3">Task History</h4>
                        {history.length === 0 ? (
                          <p className="text-sm text-muted-foreground italic">No tasks played yet.</p>
                        ) : (
                          <div className="rounded-xl border border-border overflow-hidden bg-card">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="font-bold">Task Name</TableHead>
                                  <TableHead className="font-bold text-center">Attempts</TableHead>
                                  <TableHead className="font-bold text-center">Successes</TableHead>
                                  <TableHead className="font-bold">Last Played</TableHead>
                                  <TableHead className="font-bold text-center">Status</TableHead>
                                  <TableHead className="font-bold text-center">Reset</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {history.map((h) => (
                                  <TableRow key={h.id}>
                                    <TableCell className="font-semibold">{taskNameById(h.task_id)}</TableCell>
                                    <TableCell className="text-center font-mono">{h.attempts}</TableCell>
                                    <TableCell className="text-center font-mono">{h.success_count}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                      {h.last_played_at ? new Date(h.last_played_at).toLocaleString() : '—'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                        h.status === 'Completed' ? 'bg-green-100 text-green-700'
                                          : h.status === 'In Progress' ? 'bg-amber-100 text-amber-700'
                                          : 'bg-muted text-muted-foreground'
                                      }`}>{h.status}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <button
                                        onClick={() => handleResetTask(s.id, h.task_id)}
                                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
                                        title="Reset attempts for this task only"
                                      >
                                        <RotateCcw size={12} />Reset
                                      </button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default TeacherPage;
