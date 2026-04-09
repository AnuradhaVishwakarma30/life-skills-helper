export type AppView = 'landing' | 'teacher' | 'student' | 'game';

export interface TaskStep {
  text: string;
  iconName: string;
}

export interface Task {
  id: string;
  name: string;
  iconName: string;
  voiceMessage: string;
  colorText: string;
  colorBg: string;
  colorLight: string;
  colorBorder: string;
  colorHover: string;
  colorRing: string;
  steps: TaskStep[];
}
