// Mock User Progress Repository
// Uses localStorage for persistence - will be replaced with Supabase later

import { lessons } from "@/src/data/master/lessons";
import { modules } from "@/src/data/master/modules";
import type {
    IUserProgressRepository,
    UserProfile,
    UserProgress,
} from "@/src/domain/repositories/IUserProgressRepository";

const STORAGE_KEY = "play-stack-user-progress";
const PROFILE_KEY = "play-stack-user-profile";

// Mock user data
const mockUser: UserProfile = {
  id: "mock-user-1",
  email: "user@example.com",
  displayName: "Demo User",
  avatar: undefined,
  createdAt: new Date(),
  lastActiveAt: new Date(),
  points: 0,
  currentPhase: 1,
  currentModule: "module-1-1",
  currentLesson: "lesson-1-1-1",
  completedLessons: [],
  completedModules: [],
  completedPhases: [],
  certificates: [],
};

export class MockUserProgressRepository implements IUserProgressRepository {
  private getStoredProgress(): UserProgress[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveProgress(progress: UserProgress[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  private getStoredProfile(): UserProfile {
    if (typeof window === "undefined") return mockUser;
    const stored = localStorage.getItem(PROFILE_KEY);
    return stored ? JSON.parse(stored) : mockUser;
  }

  private saveProfile(profile: UserProfile): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  // User Profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const profile = this.getStoredProfile();
    return profile.id === userId ? profile : null;
  }

  async updateUserProfile(
    userId: string,
    data: Partial<UserProfile>
  ): Promise<UserProfile> {
    const profile = this.getStoredProfile();
    const updated = { ...profile, ...data, lastActiveAt: new Date() };
    this.saveProfile(updated);
    return updated;
  }

  // Progress
  async getProgress(userId: string): Promise<UserProgress[]> {
    return this.getStoredProgress().filter((p) => p.oderId === userId);
  }

  async getProgressByPhase(
    userId: string,
    phaseId: string
  ): Promise<UserProgress[]> {
    return this.getStoredProgress().filter(
      (p) => p.oderId === userId && p.phaseId === phaseId
    );
  }

  async getProgressByModule(
    userId: string,
    moduleId: string
  ): Promise<UserProgress[]> {
    return this.getStoredProgress().filter(
      (p) => p.oderId === userId && p.moduleId === moduleId
    );
  }

  async markLessonComplete(
    userId: string,
    lessonId: string,
    timeSpent: number
  ): Promise<UserProgress> {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) throw new Error("Lesson not found");

    const module = modules.find((m) => m.id === lesson.moduleId);
    if (!module) throw new Error("Module not found");

    const progress: UserProgress = {
      id: `progress-${Date.now()}`,
      oderId: userId,
      lessonId,
      moduleId: lesson.moduleId,
      phaseId: module.phaseId,
      completedAt: new Date(),
      timeSpentMinutes: timeSpent,
    };

    const allProgress = this.getStoredProgress();
    allProgress.push(progress);
    this.saveProgress(allProgress);

    // Update profile
    const profile = this.getStoredProfile();
    if (!profile.completedLessons.includes(lessonId)) {
      profile.completedLessons.push(lessonId);
      profile.points += 10; // Award points
      this.saveProfile(profile);
    }

    return progress;
  }

  // Stats
  async getCompletionPercentage(userId: string): Promise<number> {
    const profile = this.getStoredProfile();
    const totalLessons = lessons.length;
    return totalLessons > 0
      ? Math.round((profile.completedLessons.length / totalLessons) * 100)
      : 0;
  }

  async getPhaseCompletionPercentage(
    userId: string,
    phaseId: string
  ): Promise<number> {
    const profile = this.getStoredProfile();
    const phaseModules = modules.filter((m) => m.phaseId === phaseId);
    const phaseLessons = lessons.filter((l) =>
      phaseModules.some((m) => m.id === l.moduleId)
    );
    const completedInPhase = phaseLessons.filter((l) =>
      profile.completedLessons.includes(l.id)
    ).length;
    return phaseLessons.length > 0
      ? Math.round((completedInPhase / phaseLessons.length) * 100)
      : 0;
  }

  async getModuleCompletionPercentage(
    userId: string,
    moduleId: string
  ): Promise<number> {
    const profile = this.getStoredProfile();
    const moduleLessons = lessons.filter((l) => l.moduleId === moduleId);
    const completedInModule = moduleLessons.filter((l) =>
      profile.completedLessons.includes(l.id)
    ).length;
    return moduleLessons.length > 0
      ? Math.round((completedInModule / moduleLessons.length) * 100)
      : 0;
  }
}

// Singleton instance
let mockUserProgressRepository: MockUserProgressRepository | null = null;

export function getMockUserProgressRepository(): MockUserProgressRepository {
  if (!mockUserProgressRepository) {
    mockUserProgressRepository = new MockUserProgressRepository();
  }
  return mockUserProgressRepository;
}
