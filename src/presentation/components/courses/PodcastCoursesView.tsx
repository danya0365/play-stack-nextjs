"use client";

import { getLessonsByModuleId, Lesson } from "@/src/data/master/lessons";
import { getModulesByPhaseId, Module } from "@/src/data/master/modules";
import { Phase } from "@/src/data/master/phases";
import { getLessonComponent, hasLessonComponent } from "@/src/presentation/components/lessons";
import { useTTS } from "@/src/presentation/hooks/useTTS";
import { CoursesViewModel } from "@/src/presentation/presenters/courses/CoursesPresenter";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface PodcastCoursesViewProps {
  viewModel: CoursesViewModel;
}

interface LessonWithContext {
  lesson: Lesson;
  phase: Phase;
  module: Module;
}

interface Slide {
  text: string;
}

export function PodcastCoursesView({ viewModel }: PodcastCoursesViewProps) {
  const { phases } = viewModel;
  
  // TTS
  const tts = useTTS();
  
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [voiceType, setVoiceType] = useState<'male' | 'female'>('female');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null); // minutes
  const [sleepTimeRemaining, setSleepTimeRemaining] = useState<number | null>(null); // seconds
  
  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Build flat list of all lessons with components
  const allLessons = useMemo<LessonWithContext[]>(() => {
    const list: LessonWithContext[] = [];
    phases.forEach(phase => {
      const modules = getModulesByPhaseId(phase.id);
      modules.forEach(mod => {
        const lessons = getLessonsByModuleId(mod.id);
        lessons.forEach(lesson => {
          if (hasLessonComponent(lesson.id)) {
            list.push({ lesson, phase, module: mod });
          }
        });
      });
    });
    return list;
  }, [phases]);
  
  // Current lesson
  const currentLessonData = allLessons[currentLessonIndex];
  const LessonComponent = currentLessonData ? getLessonComponent(currentLessonData.lesson.id) : null;
  
  // Extract slides
  const [slides, setSlides] = useState<Slide[]>([]);
  
  useEffect(() => {
    if (contentRef.current) {
      const timer = setTimeout(() => {
        const sections = contentRef.current?.querySelectorAll("section.mb-8");
        if (sections) {
          const extractedSlides = Array.from(sections).map(s => ({
            text: s.textContent || "",
          }));
          setSlides(extractedSlides);
          setCurrentSlideIndex(0);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentLessonData?.lesson.id, LessonComponent]);
  
  // Sleep timer logic
  useEffect(() => {
    if (sleepTimer !== null && isPlaying) {
      setSleepTimeRemaining(sleepTimer * 60);
      
      sleepTimerRef.current = setInterval(() => {
        setSleepTimeRemaining(prev => {
          if (prev === null || prev <= 0) {
            // Time's up - stop playback
            setIsPlaying(false);
            tts.stop();
            setSleepTimer(null);
            if (sleepTimerRef.current) {
              clearInterval(sleepTimerRef.current);
            }
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        if (sleepTimerRef.current) {
          clearInterval(sleepTimerRef.current);
        }
      };
    }
  }, [sleepTimer, isPlaying]);
  
  // Advance to next
  const advanceToNext = useCallback(() => {
    const isLastSlide = currentSlideIndex >= slides.length - 1;
    const isLastLesson = currentLessonIndex >= allLessons.length - 1;
    
    if (isLastSlide) {
      if (!isLastLesson) {
        setCurrentLessonIndex(prev => prev + 1);
        setCurrentSlideIndex(0);
      } else {
        setIsPlaying(false);
      }
    } else {
      setCurrentSlideIndex(prev => prev + 1);
    }
  }, [currentSlideIndex, slides.length, currentLessonIndex, allLessons.length]);
  
  // Speak current content
  const speakCurrent = useCallback(async () => {
    if (!isPlaying || slides.length === 0) return;
    
    const currentText = slides[currentSlideIndex]?.text;
    if (!currentText) {
      advanceToNext();
      return;
    }
    
    try {
      await tts.speak(currentText, {
        voiceType,
        rate: speechRate,
      });
      
      // Move to next after speaking
      if (isPlaying) {
        setTimeout(advanceToNext, 1000);
      }
    } catch {
      // Continue even if TTS fails
      if (isPlaying) {
        setTimeout(advanceToNext, 2000);
      }
    }
  }, [isPlaying, slides, currentSlideIndex, voiceType, speechRate, tts, advanceToNext]);
  
  // Auto-play effect
  useEffect(() => {
    if (isPlaying && slides.length > 0) {
      speakCurrent();
    }
  }, [isPlaying, currentSlideIndex, slides.length]);
  
  // Toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      tts.stop();
    }
    setIsPlaying(!isPlaying);
  };
  
  // Cleanup
  useEffect(() => {
    return () => {
      tts.stop();
      if (sleepTimerRef.current) {
        clearInterval(sleepTimerRef.current);
      }
    };
  }, []);
  
  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Progress
  const totalSlides = allLessons.reduce((acc, l) => {
    // Estimate 8 slides per lesson
    return acc + 8;
  }, 0);
  const currentProgress = (currentLessonIndex * 8 + currentSlideIndex) / totalSlides * 100;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900">
      {/* Hidden content for extracting text */}
      <div className="hidden" ref={contentRef}>
        {LessonComponent && <LessonComponent />}
      </div>
      
      {/* Header */}
      <header className="flex-shrink-0 p-4 flex items-center justify-between">
        <Link
          href="/courses"
          className="flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <span>←</span>
          <span className="hidden sm:inline">ออก</span>
        </Link>
        
        {/* Sleep Timer */}
        <div className="flex items-center gap-2">
          {sleepTimeRemaining && (
            <span className="text-white/70 text-sm">
              💤 {formatTime(sleepTimeRemaining)}
            </span>
          )}
          <select
            value={sleepTimer || ""}
            onChange={(e) => setSleepTimer(e.target.value ? parseInt(e.target.value) : null)}
            className="bg-white/10 text-white text-sm px-3 py-1.5 rounded-lg border border-white/20"
          >
            <option value="">ไม่จับเวลา</option>
            <option value="5">5 นาที</option>
            <option value="15">15 นาที</option>
            <option value="30">30 นาที</option>
            <option value="60">1 ชั่วโมง</option>
          </select>
        </div>
      </header>
      
      {/* Main Content - Album Art Style */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        {/* Artwork */}
        <div className="w-64 h-64 md:w-80 md:h-80 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-purple-500/30 flex items-center justify-center mb-8 animate-pulse-slow">
          <span className="text-8xl md:text-9xl">🎧</span>
        </div>
        
        {/* Lesson Info */}
        <div className="text-white mb-2">
          <div className="text-white/50 text-sm mb-1">
            {currentLessonData?.phase.icon} {currentLessonData?.phase.titleTh}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {currentLessonData?.lesson.titleTh || "กำลังโหลด..."}
          </h1>
          <p className="text-white/60 text-sm">
            บทที่ {currentLessonIndex + 1} / {allLessons.length}
          </p>
        </div>
        
        {/* Speaking indicator */}
        {tts.isSpeaking && (
          <div className="flex items-center gap-2 text-green-400 mt-4">
            <div className="flex gap-1">
              <span className="w-1 h-4 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-6 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-4 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm">กำลังอ่าน...</span>
          </div>
        )}
      </main>
      
      {/* Footer Controls */}
      <footer className="flex-shrink-0 p-6 bg-black/30 backdrop-blur-sm">
        {/* Progress */}
        <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
        
        {/* Controls Row */}
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Voice */}
          <button
            onClick={() => setVoiceType(voiceType === 'male' ? 'female' : 'male')}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
              voiceType === 'female' 
                ? 'bg-pink-500/30 text-pink-300' 
                : 'bg-blue-500/30 text-blue-300'
            }`}
          >
            {voiceType === 'female' ? '👩' : '👨'}
          </button>
          
          {/* Skip Back */}
          <button
            onClick={() => {
              tts.stop();
              if (currentSlideIndex > 0) {
                setCurrentSlideIndex(prev => prev - 1);
              } else if (currentLessonIndex > 0) {
                setCurrentLessonIndex(prev => prev - 1);
              }
            }}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-all"
          >
            ⏮
          </button>
          
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-white text-purple-900 flex items-center justify-center text-3xl shadow-lg shadow-white/20 hover:scale-105 transition-all"
          >
            {isPlaying ? '⏸' : '▶️'}
          </button>
          
          {/* Skip Forward */}
          <button
            onClick={() => {
              tts.stop();
              advanceToNext();
            }}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-all"
          >
            ⏭
          </button>
          
          {/* Speed */}
          <button
            onClick={() => {
              const speeds = [0.75, 1, 1.25, 1.5, 2];
              const currentIdx = speeds.indexOf(speechRate);
              const nextIdx = (currentIdx + 1) % speeds.length;
              setSpeechRate(speeds[nextIdx]);
            }}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-all"
          >
            {speechRate}x
          </button>
        </div>
        
        {/* TTS Status */}
        {!tts.isSupported && (
          <div className="text-center mt-4 text-yellow-400 text-sm">
            ⚠️ เบราว์เซอร์ไม่รองรับการอ่านออกเสียง
          </div>
        )}
      </footer>
      
      {/* Pulse animation for artwork */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
