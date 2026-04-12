const ENROLLED_KEY = 'learnability_enrolled_students';
const GLOBAL_TASK_KEY = 'learnability_global_task';
const ATTEMPTS_PREFIX = 'learnability_attempts_';

export interface EnrolledStudent {
  id: string;
  name: string;
}

export const getEnrolledStudents = (): EnrolledStudent[] => {
  try {
    return JSON.parse(localStorage.getItem(ENROLLED_KEY) || '[]');
  } catch {
    return [];
  }
};

export const enrollStudent = (name: string): EnrolledStudent => {
  const students = getEnrolledStudents();
  const student: EnrolledStudent = { id: crypto.randomUUID(), name: name.trim() };
  students.push(student);
  localStorage.setItem(ENROLLED_KEY, JSON.stringify(students));
  return student;
};

export const removeStudent = (id: string): void => {
  const students = getEnrolledStudents().filter((s) => s.id !== id);
  localStorage.setItem(ENROLLED_KEY, JSON.stringify(students));
};

export const getGlobalTaskId = (): string | null => {
  return localStorage.getItem(GLOBAL_TASK_KEY);
};

export const setGlobalTaskId = (taskId: string): void => {
  localStorage.setItem(GLOBAL_TASK_KEY, taskId);
};

export const getStudentAttempts = (studentId: string): number => {
  return parseInt(localStorage.getItem(ATTEMPTS_PREFIX + studentId) || '0', 10);
};

export const incrementStudentAttempts = (studentId: string): void => {
  const current = getStudentAttempts(studentId);
  localStorage.setItem(ATTEMPTS_PREFIX + studentId, String(current + 1));
};

export const getStudentStatus = (studentId: string): string => {
  const attempts = getStudentAttempts(studentId);
  if (attempts === 0) return 'Not Started';
  if (attempts >= 5) return 'Mastered';
  return 'In Progress';
};
