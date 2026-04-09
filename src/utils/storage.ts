export const MAX_TASK_VIEWS = 5;

const ASSIGNED_KEY = 'learnability_assigned_task';
const VIEWS_PREFIX = 'learnability_views_';
const DATE_PREFIX = 'learnability_date_';

export const getAssignedTaskId = (): string | null => {
  return localStorage.getItem(ASSIGNED_KEY);
};

export const setAssignedTaskId = (taskId: string): void => {
  localStorage.setItem(ASSIGNED_KEY, taskId);
};

const getTodayKey = () => new Date().toISOString().split('T')[0];

export const getViewsForTask = (taskId: string): number => {
  const storedDate = localStorage.getItem(DATE_PREFIX + taskId);
  const today = getTodayKey();
  if (storedDate !== today) {
    localStorage.setItem(DATE_PREFIX + taskId, today);
    localStorage.setItem(VIEWS_PREFIX + taskId, '0');
    return 0;
  }
  return parseInt(localStorage.getItem(VIEWS_PREFIX + taskId) || '0', 10);
};

export const incrementViews = (taskId: string): void => {
  const current = getViewsForTask(taskId);
  localStorage.setItem(VIEWS_PREFIX + taskId, String(current + 1));
  localStorage.setItem(DATE_PREFIX + taskId, getTodayKey());
};

export const isTaskLimitReached = (taskId: string): boolean => {
  return getViewsForTask(taskId) >= MAX_TASK_VIEWS;
};
