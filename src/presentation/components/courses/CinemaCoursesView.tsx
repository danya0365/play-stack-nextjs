"use client";

import { getLessonsByModuleId, Lesson } from "@/src/data/master/lessons";
import { getModulesByPhaseId, Module } from "@/src/data/master/modules";
import { Phase } from "@/src/data/master/phases";
import { getLessonComponent, hasLessonComponent } from "@/src/presentation/components/lessons";
import { useBackgroundMusic } from "@/src/presentation/hooks/useBackgroundMusic";
import { useTTS } from "@/src/presentation/hooks/useTTS";
import { CoursesViewModel } from "@/src/presentation/presenters/courses/CoursesPresenter";
import { useCinemaStore } from "@/src/presentation/stores/cinemaStore";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface CinemaCoursesViewProps {
  viewModel: CoursesViewModel;
}

interface LessonWithContext {
  lesson: Lesson;
  phase: Phase;
  module: Module;
}

interface SlideData {
  html: string;
  text: string; // Plain text for TTS
}

export function CinemaCoursesView({ viewModel }: CinemaCoursesViewProps) {
  const { phases } = viewModel;
  
  // Stores
  const cinema = useCinemaStore();
  
  // Hooks  
  const tts = useTTS();
  const music = useBackgroundMusic();
  
  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Build flat list of all lessons
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
  const currentLessonData = allLessons[cinema.currentLessonIndex];
  const LessonComponent = currentLessonData ? getLessonComponent(currentLessonData.lesson.id) : null;
  
  // Extract slides from rendered content
  const [slides, setSlides] = useState<SlideData[]>([]);
  
  // Extract slides and add data-slide attributes
  useEffect(() => {
    if (contentRef.current) {
      const timer = setTimeout(() => {
        const content = contentRef.current;
        if (!content) return;
        
        // Find .lesson-content inside (the actual content wrapper from LessonComponent)
        const lessonContent = content.querySelector('.lesson-content') as HTMLElement;
        if (!lessonContent) return;
        
        // Hide ALL direct children of lesson-content (H1, Intro Card, sections, etc.)
        const allChildren = lessonContent.children;
        for (let i = 0; i < allChildren.length; i++) {
          (allChildren[i] as HTMLElement).style.display = 'none';
        }
        
        // Find all sections and add data-slide attribute
        const sections = lessonContent.querySelectorAll("section.mb-8");
        if (sections && sections.length > 0) {
          const extractedSlides = Array.from(sections).map((s, index) => {
            const el = s as HTMLElement;
            el.setAttribute('data-slide', String(index));
            // Show only first slide initially
            el.style.display = index === 0 ? 'block' : 'none';
            return {
              html: s.outerHTML,
              text: s.textContent || "",
            };
          });
          setSlides(extractedSlides);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentLessonData?.lesson.id, LessonComponent]);
  
  // Update visibility when slide changes
  useEffect(() => {
    if (contentRef.current && slides.length > 0) {
      const lessonContent = contentRef.current.querySelector('.lesson-content') as HTMLElement;
      if (!lessonContent) return;
      
      // Hide all direct children of lesson-content (H1, Intro Card, etc.)
      const allChildren = lessonContent.children;
      for (let i = 0; i < allChildren.length; i++) {
        (allChildren[i] as HTMLElement).style.display = 'none';
      }
      
      // Then show only the current section
      const sections = lessonContent.querySelectorAll("section.mb-8");
      sections.forEach((s, index) => {
        const el = s as HTMLElement;
        el.style.display = index === cinema.currentSlideIndex ? 'block' : 'none';
      });
    }
  }, [cinema.currentSlideIndex, slides.length]);
  
  // Current slide
  const currentSlide = slides[cinema.currentSlideIndex];
  const totalSlides = slides.length;
  const isLastSlide = cinema.currentSlideIndex >= totalSlides - 1;
  const isLastLesson = cinema.currentLessonIndex >= allLessons.length - 1;
  
  // Go to next slide or lesson
  const advanceToNext = useCallback(() => {
    if (isLastSlide) {
      if (!isLastLesson) {
        // Move to next lesson
        cinema.setLessonIndex(cinema.currentLessonIndex + 1);
      } else {
        // End of course
        cinema.pause();
      }
    } else {
      cinema.nextSlide();
    }
  }, [isLastSlide, isLastLesson, cinema]);
  
  // Speak current slide and auto-advance
  const speakAndAdvance = useCallback(async () => {
    if (!currentSlide || !cinema.isPlaying) return;
    
    // Fade out music
    if (cinema.isMusicEnabled) {
      music.fadeOut(300);
    }
    
    try {
      // Speak the slide content
      await tts.speak(currentSlide.text, {
        voiceType: cinema.voiceType,
        rate: cinema.speechRate,
      });
      
      // Fade in music
      if (cinema.isMusicEnabled) {
        music.fadeIn(cinema.musicVolume, 300);
      }
      
      // Wait before advancing
      if (cinema.isPlaying) {
        autoAdvanceTimerRef.current = setTimeout(() => {
          if (cinema.isPlaying) {
            advanceToNext();
          }
        }, cinema.autoAdvanceDelay * 1000);
      }
    } catch (e) {
      console.error('TTS error:', e);
      // Still advance even if TTS fails
      if (cinema.isPlaying) {
        autoAdvanceTimerRef.current = setTimeout(advanceToNext, 2000);
      }
    }
  }, [currentSlide, cinema, tts, music, advanceToNext]);
  
  // Auto-play effect
  useEffect(() => {
    if (cinema.isPlaying && currentSlide) {
      speakAndAdvance();
    }
    
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, [cinema.isPlaying, cinema.currentSlideIndex, currentSlide]);
  
  // Handle play/pause for music
  useEffect(() => {
    if (cinema.isPlaying && cinema.isMusicEnabled) {
      music.play();
    } else {
      music.pause();
    }
  }, [cinema.isPlaying, cinema.isMusicEnabled]);
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          cinema.togglePlayPause();
          if (!cinema.isPlaying) {
            tts.stop();
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          tts.stop();
          advanceToNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          tts.stop();
          cinema.prevSlide();
          break;
        case 'Escape':
          e.preventDefault();
          cinema.pause();
          tts.stop();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [cinema, tts, advanceToNext]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      tts.stop();
      music.pause();
      cinema.reset();
    };
  }, []);
  
  // Calculate total progress
  const totalProgress = allLessons.length > 0 
    ? ((cinema.currentLessonIndex + (totalSlides > 0 ? cinema.currentSlideIndex / totalSlides : 0)) / allLessons.length) * 100
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      
      {/* Header */}
      <header className="flex-shrink-0 h-16 px-4 md:px-6 flex items-center justify-between bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link
            href="/courses/tree"
            className="flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <span>←</span>
            <span className="hidden sm:inline">ออก</span>
          </Link>
          
          <div className="text-white">
            <div className="text-xs text-white/50">
              {currentLessonData?.phase.titleTh} → {currentLessonData?.module.titleTh}
            </div>
            <div className="font-medium">
              🎬 {currentLessonData?.lesson.titleTh}
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Voice Toggle */}
          <button
            onClick={() => cinema.setVoiceType(cinema.voiceType === 'male' ? 'female' : 'male')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              cinema.voiceType === 'female' 
                ? 'bg-pink-500/20 text-pink-300' 
                : 'bg-blue-500/20 text-blue-300'
            }`}
            title={cinema.voiceType === 'female' ? 'เสียงผู้หญิง' : 'เสียงผู้ชาย'}
          >
            {cinema.voiceType === 'female' ? '👩' : '👨'}
          </button>
          
          {/* Speed */}
          <select
            value={cinema.speechRate}
            onChange={(e) => cinema.setSpeechRate(parseFloat(e.target.value))}
            className="bg-white/10 text-white text-sm px-2 py-1.5 rounded-lg border border-white/20"
          >
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
          
          {/* Music Toggle */}
          <button
            onClick={() => cinema.toggleMusic()}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              cinema.isMusicEnabled 
                ? 'bg-green-500/20 text-green-300' 
                : 'bg-white/10 text-white/50'
            }`}
            title="เพลงพื้นหลัง"
          >
            {cinema.isMusicEnabled ? '🎵' : '🔇'}
          </button>
        </div>
      </header>
      
      {/* Main Content - One Slide at a Time */}
      <main className="flex-1 overflow-hidden p-4 md:p-8 flex items-start justify-center">
        <div 
          ref={contentRef}
          className="cinema-content max-w-4xl mx-auto w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-12 prose dark:prose-invert max-w-none max-h-full overflow-y-auto"
        >
          {LessonComponent ? (
            <LessonComponent />
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-pulse">🎬</div>
              <p className="text-slate-500">กำลังโหลดเนื้อหา...</p>
            </div>
          )}
        </div>
      </main>
      
      {/* CSS to show only current slide */}
      <style>{`
        .cinema-content .lesson-content > *:not(section.mb-8) {
          display: none !important;
        }
        .cinema-content .lesson-content section.mb-8 {
          display: none !important;
        }
        .cinema-content .lesson-content section.mb-8[data-slide="${cinema.currentSlideIndex}"] {
          display: block !important;
        }
      `}</style>
      
      {/* Footer Controls */}
      <footer className="flex-shrink-0 h-24 px-4 md:px-6 bg-black/30 backdrop-blur-sm border-t border-white/10">
        {/* Progress Bar */}
        <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          {/* Left - Lesson info */}
          <div className="text-white/60 text-sm">
            <span>บทที่ {cinema.currentLessonIndex + 1}/{allLessons.length}</span>
            <span className="mx-2">•</span>
            <span>สไลด์ {cinema.currentSlideIndex + 1}/{totalSlides}</span>
          </div>
          
          {/* Center - Playback Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                tts.stop();
                cinema.prevSlide();
              }}
              disabled={cinema.currentSlideIndex === 0 && cinema.currentLessonIndex === 0}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30 transition-all"
            >
              ⏮
            </button>
            
            <button
              onClick={() => {
                if (cinema.isPlaying) {
                  tts.stop();
                }
                cinema.togglePlayPause();
              }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 transition-all"
            >
              {cinema.isPlaying ? '⏸' : '▶️'}
            </button>
            
            <button
              onClick={() => {
                tts.stop();
                advanceToNext();
              }}
              disabled={isLastSlide && isLastLesson}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30 transition-all"
            >
              ⏭
            </button>
          </div>
          
          {/* Right - TTS Status */}
          <div className="text-white/60 text-sm flex items-center gap-2">
            {tts.isSpeaking && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                กำลังพูด...
              </span>
            )}
            {!tts.isSupported && (
              <span className="text-yellow-400">⚠️ TTS ไม่รองรับ</span>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
