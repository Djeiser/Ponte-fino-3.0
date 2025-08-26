
export interface Exercise {
  name: string;
  sets: string;
  rpe: string;
  video: string;
}

export interface WorkoutPlan {
  [key: string]: Exercise[];
}

export interface Achievement {
  name: string;
  desc: string;
  unlocked: boolean;
  icon: string;
}

export interface Achievements {
  [key: string]: Achievement;
}

export interface PainLog {
  pain: number;
  stress: number;
  sleep: number;
}

export interface GameState {
  xp: number;
  level: number;
  dailyStreak: number;
  lastDailyCompletion: string | null;
  completedWorkouts: { [key: string]: string };
  achievements: Achievements;
  chatHistory: ChatMessage[];
  painDiary: { [key: string]: PainLog };
}

export interface ChatMessagePart {
  text: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: ChatMessagePart[];
}

export interface ToastInfo {
  id: number;
  message: string;
  title: string;
  icon: string;
  iconColor: string;
}
