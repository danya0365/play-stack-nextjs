// Domain interfaces for User Progress Repository

export interface UserProgress {
  id: string;
  oderId: string;
  lessonId: string;
  moduleId: string;
  phaseId: string;
  completedAt: Date;
  timeSpentMinutes: number;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  createdAt: Date;
  lastActiveAt: Date;
  points: number;
  currentPhase: number;
  currentModule: string;
  currentLesson: string;
  completedLessons: string[];
  completedModules: string[];
  completedPhases: string[];
  certificates: string[];
}

export interface IUserProgressRepository {
  // User Profile
  getUserProfile(userId: string): Promise<UserProfile | null>;
  updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile>;

  // Progress
  getProgress(userId: string): Promise<UserProgress[]>;
  getProgressByPhase(userId: string, phaseId: string): Promise<UserProgress[]>;
  getProgressByModule(userId: string, moduleId: string): Promise<UserProgress[]>;
  markLessonComplete(userId: string, lessonId: string, timeSpent: number): Promise<UserProgress>;
  
  // Stats
  getCompletionPercentage(userId: string): Promise<number>;
  getPhaseCompletionPercentage(userId: string, phaseId: string): Promise<number>;
  getModuleCompletionPercentage(userId: string, moduleId: string): Promise<number>;
}
