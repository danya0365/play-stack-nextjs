"use client";

import { useAuthStore } from "@/src/presentation/stores/authStore";
import { ReactNode } from "react";

interface PaywallGuardProps {
  children: ReactNode;
  phaseNumber?: number;
  lessonId?: string;
  fallback?: ReactNode;
}

export function PaywallGuard({ 
  children, 
  phaseNumber, 
  lessonId,
  fallback 
}: PaywallGuardProps) {
  const { canAccessPhase, canAccessLesson, openPaywallModal } = useAuthStore();

  // Check access
  let hasAccess = true;
  
  if (phaseNumber !== undefined) {
    hasAccess = canAccessPhase(phaseNumber);
  } else if (lessonId !== undefined) {
    hasAccess = canAccessLesson(lessonId);
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  // Show fallback or locked content
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-white mb-2">
          เนื้อหา Premium
        </h2>
        <p className="text-gray-400 mb-6">
          บทเรียนนี้ต้องอัพเกรดเป็น Pro เพื่อเข้าถึง
        </p>
        <button
          onClick={openPaywallModal}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all"
        >
          🚀 ดูราคา Pro
        </button>
      </div>
    </div>
  );
}

// Hook for checking access programmatically
export function usePaywall() {
  const { canAccessPhase, canAccessLesson, openPaywallModal, isPremium } = useAuthStore();

  const checkAccess = (phaseNumber?: number, lessonId?: string): boolean => {
    if (phaseNumber !== undefined) {
      return canAccessPhase(phaseNumber);
    }
    if (lessonId !== undefined) {
      return canAccessLesson(lessonId);
    }
    return true;
  };

  const requireAccess = (phaseNumber?: number, lessonId?: string): boolean => {
    const hasAccess = checkAccess(phaseNumber, lessonId);
    if (!hasAccess) {
      openPaywallModal();
    }
    return hasAccess;
  };

  return {
    isPremium,
    checkAccess,
    requireAccess,
    openPaywallModal,
  };
}
