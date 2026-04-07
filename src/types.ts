export interface UserProfile {
  name: string;
  role: string;
  hourlyRate: number;
}

export interface Task {
  id: string;
  name: string;
  category: string;
  hoursPerWeek: number;
  importance: number; // 1-10
  automationPotential: number; // 0-100%
  suggestedTools: string;
}

export interface AppState {
  profile: UserProfile;
  tasks: Task[];
  currentStep: number;
}
