import { useState, useEffect } from 'react';
import { GraduationCap, CheckCircle2, BookHeart, UserPlus, Trash2 } from 'lucide-react';
import { tasks } from '../data/tasks';
import { IconRenderer } from '../utils/IconRenderer';
import {
  getEnrolledStudents,
  enrollStudent,
  removeStudent,
  getGlobalTaskId,
  setGlobalTaskId,
  getStudentAttempts,
  getStudentStatus,
  EnrolledStudent,
} from '../utils/studentStorage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const TeacherPage = () => {
  const [students, setStudents] = useState<EnrolledStudent[]>(getEnrolledStudents);
  const [globalTask, setGlobalTask] = useState<string>(getGlobalTaskId() || '');
  const [newName, setNewName] = useState('');
  const [, setTick] = useState(0);

  // Poll localStorage for live updates every 3s
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEnroll = () => {
    const name = newName.trim();
    if (!name) return;
    enrollStudent(name);
    setStudents(getEnrolledStudents());
    setNewName('');
  };

  const handleRemove = (id: string) => {
    removeStudent(id);
    setStudents(getEnrolledStudents());
  };

  const handleTaskChange = (taskId: string) => {
    setGlobalTaskId(taskId);
    setGlobalTask(taskId);
  };

  const selectedTask = tasks.find((t) => t.id === globalTask);

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
        {/* Global Task Selector */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Assign Global Task</h2>
          <div className="flex items-center gap-4 flex-wrap">
            <Select value={globalTask} onValueChange={handleTaskChange}>
              <SelectTrigger className="w-72">
                <SelectValue placeholder="Select a task..." />
              </SelectTrigger>
              <SelectContent>
                {tasks.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
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
          <h2 className="text-2xl font-bold text-foreground mb-4">Enroll Students</h2>
          <div className="flex gap-3 max-w-md">
            <Input
              placeholder="Enter student name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEnroll()}
              className="text-base"
            />
            <button
              onClick={handleEnroll}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              <UserPlus size={18} />
              Add
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
                    <TableHead className="font-bold text-base">Student Name</TableHead>
                    <TableHead className="font-bold text-base text-center">Attempts</TableHead>
                    <TableHead className="font-bold text-base text-center">Status</TableHead>
                    <TableHead className="font-bold text-base text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s) => {
                    const attempts = getStudentAttempts(s.id);
                    const status = getStudentStatus(s.id);
                    return (
                      <TableRow key={s.id}>
                        <TableCell className="font-semibold text-base">{s.name}</TableCell>
                        <TableCell className="text-center text-base font-mono">{attempts}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              status === 'Mastered'
                                ? 'bg-green-100 text-green-700'
                                : status === 'In Progress'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {status}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <button onClick={() => handleRemove(s.id)} className="text-destructive hover:opacity-70 transition-opacity">
                            <Trash2 size={16} />
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
