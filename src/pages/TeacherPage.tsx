import { useState, useEffect } from 'react';
import { GraduationCap, CheckCircle2, BookHeart, UserPlus, Trash2, Lock } from 'lucide-react';
import { tasks } from '../data/tasks';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

const TEACHER_PIN = '4321';

interface Student {
  id: string;
  name: string;
  attempts: number;
  status: string;
  assigned_task: string | null;
  success_count: number;
  progress_percent: number;
}

const TeacherPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [globalTask, setGlobalTask] = useState('');
  const [newName, setNewName] = useState('');
  const [newTask, setNewTask] = useState('');

  const handlePinSubmit = () => {
    if (pin === TEACHER_PIN) {
      setAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const fetchStudents = async () => {
    const { data } = await supabase.from('students').select('*').order('created_at');
    if (data) setStudents(data as Student[]);
  };

  const fetchGlobalTask = async () => {
    const { data } = await supabase.from('settings').select('value').eq('key', 'global_task_id').maybeSingle();
    if (data?.value) setGlobalTask(data.value);
  };

  useEffect(() => {
    if (!authenticated) return;
    fetchStudents();
    fetchGlobalTask();

    const channel = supabase
      .channel('teacher-students')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => {
        fetchStudents();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [authenticated]);

  const handleEnroll = async () => {
    const name = newName.trim();
    if (!name) return;
    await supabase.from('students').insert({ name, assigned_task: newTask || null });
    setNewName('');
    setNewTask('');
    fetchStudents();
  };

  const handleRemove = async (id: string) => {
    await supabase.from('students').delete().eq('id', id);
    fetchStudents();
  };

  const handleStudentTaskChange = async (studentId: string, taskId: string) => {
    await supabase.from('students').update({ assigned_task: taskId }).eq('id', studentId);
    fetchStudents();
  };

  const handleTaskChange = async (taskId: string) => {
    setGlobalTask(taskId);
    await supabase.from('settings').upsert({ key: 'global_task_id', value: taskId }, { onConflict: 'key' });
  };

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
          <button
            onClick={handlePinSubmit}
            className="w-full bg-primary text-primary-foreground font-bold text-lg px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
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
        {/* Global Task Selector (default for students with no specific task) */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-2">Default Global Task</h2>
          <p className="text-muted-foreground text-sm mb-4">Used when a student has no individually assigned task.</p>
          <div className="flex items-center gap-4 flex-wrap">
            <Select value={globalTask} onValueChange={handleTaskChange}>
              <SelectTrigger className="w-72">
                <SelectValue placeholder="Select a task..." />
              </SelectTrigger>
              <SelectContent>
                {tasks.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTask && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${selectedTask.colorLight} ${selectedTask.colorText} text-sm font-semibold`}>
                <CheckCircle2 size={14} />
                {selectedTask.name} assigned
              </div>
            )}
          </div>
        </section>

        {/* Enroll Student */}
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
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Assign a task (optional)..." />
              </SelectTrigger>
              <SelectContent>
                {tasks.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={handleEnroll}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              <UserPlus size={18} />
              Add Student
            </button>
          </div>
        </section>

        {/* Scoreboard */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Scoreboard</h2>
          {students.length === 0 ? (
            <p className="text-muted-foreground">No students enrolled yet. Add a student above.</p>
          ) : (
            <div className="rounded-2xl border border-border overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Name</TableHead>
                    <TableHead className="font-bold">Assigned Task</TableHead>
                    <TableHead className="font-bold text-center">Attempts</TableHead>
                    <TableHead className="font-bold text-center">Success</TableHead>
                    <TableHead className="font-bold">Progress</TableHead>
                    <TableHead className="font-bold text-center">Status</TableHead>
                    <TableHead className="font-bold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-semibold">{s.name}</TableCell>
                      <TableCell>
                        <Select
                          value={s.assigned_task ?? ''}
                          onValueChange={(v) => handleStudentTaskChange(s.id, v)}
                        >
                          <SelectTrigger className="w-48 h-9">
                            <SelectValue placeholder="— None —" />
                          </SelectTrigger>
                          <SelectContent>
                            {tasks.map((t) => (
                              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center font-mono">{s.attempts}</TableCell>
                      <TableCell className="text-center font-mono">{s.success_count}</TableCell>
                      <TableCell className="min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <Progress value={s.progress_percent} className="h-2" />
                          <span className="text-xs font-mono text-muted-foreground w-9 text-right">{s.progress_percent}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          s.status === 'Mastered' ? 'bg-green-100 text-green-700'
                            : s.status === 'In Progress' ? 'bg-amber-100 text-amber-700'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {s.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <button onClick={() => handleRemove(s.id)} className="text-destructive hover:opacity-70 transition-opacity">
                          <Trash2 size={16} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default TeacherPage;
