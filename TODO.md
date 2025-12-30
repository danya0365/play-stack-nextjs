# 🎮 Play Stack - TODO List

> **Platform:** Next.js Game Development Course Website  
> **Architecture:** Clean Architecture + SOLID Principles  
> **Data Strategy:** Mock Data → Supabase Integration

---

## ✅ Project Setup (Complete)

- [x] **Dual Layout System**
  - [x] MainLayout - Modern design with animations (react-spring)
  - [x] RetroLayout - Windows 98 / IE5 Browser style
  - [x] Layout switching via header button
  - [x] Theme Toggle (dark/light mode with next-themes)
  - [x] Full-screen design (no scroll, app-like experience)

- [x] **Reusable Components (per Layout)**
  - [x] Modal component (Main + Retro styles)
  - [x] Input component (Main + Retro styles)
  - [x] Select component (Main + Retro styles)
  - [x] Button component (Main + Retro styles)
  - [x] Popover component (Main + Retro styles)

- [x] **Homepage (app/page.tsx)**
  - [x] Hero section with course overview
  - [x] Learning path preview
  - [x] All components dual-styled for layout switching

---

## ✅ Master Data Setup (Complete)

- [x] **Course Data Structure**
  - [x] Phases (5 phases) - `/src/data/master/phases.ts`
  - [x] Modules (16 modules) - `/src/data/master/modules.ts`
  - [x] Lessons (sample) - `/src/data/master/lessons.ts`
  - [x] Projects (sample) - `/src/data/master/projects.ts`
  - [x] Course config, Learning Paths, Certificates - `/src/data/master/index.ts`

- [x] **Mock Repositories**
  - [x] `ICourseRepository.ts` - Domain interface
  - [x] `IUserProgressRepository.ts` - Domain interface
  - [x] `MockCourseRepository.ts` - Mock implementation
  - [x] `MockUserProgressRepository.ts` - Mock with localStorage

---


## 📁 Mock Repository

- [ ] **Mock Data**
  - [ ] `/src/data/master/courses.ts` - Course definitions
  - [ ] `/src/data/master/phases.ts` - Phase data
  - [ ] `/src/data/master/modules.ts` - Module data
  - [ ] `/src/data/master/lessons.ts` - Lesson content
  - [ ] `/src/data/mock/users.ts` - Mock users
  - [ ] `/src/data/mock/progress.ts` - Mock progress data

- [ ] **Mock Repositories**
  - [ ] `/src/domain/repositories/ICourseRepository.ts`
  - [ ] `/src/infrastructure/repositories/MockCourseRepository.ts`
  - [ ] `/src/infrastructure/repositories/SupabaseCourseRepository.ts` (later)

---

## 📄 Pages (Following CREATE_PAGE_PATTERN.md)

### Phase 1: Core Pages
- [ ] Homepage `/` - Course overview & hero
- [ ] Courses `/courses` - All course listing
- [ ] Course Detail `/courses/[phase]` - Phase overview
- [ ] Module `/courses/[phase]/[module]` - Module lessons
- [ ] Lesson `/courses/[phase]/[module]/[lesson]` - Lesson content

### Phase 2: Interactive Pages
- [ ] Playground `/playground` - Code sandbox
- [ ] Projects `/projects` - Project showcase
- [ ] Profile `/profile` - User dashboard

### Phase 3: Community
- [ ] Community `/community` - Forum/discussions

---

## 🎨 Design System

- [ ] **CSS Files (Tailwind v4)**
  - [x] `main-layout.css` - Modern styles (exists)
  - [x] `retro-layout.css` - Windows 98 styles (exists)
  - [ ] Update CSS for new components as needed

- [ ] **Theme Configuration**
  - [ ] Light mode colors
  - [ ] Dark mode colors
  - [ ] Win98 color palette
  - [ ] Modern color palette

---

## 🔧 Technical Stack

- **Framework:** Next.js 16+
- **Styling:** Tailwind CSS v4
- **State:** Zustand
- **Animations:** react-spring
- **Themes:** next-themes
- **Forms:** react-hook-form + zod
- **Database:** Supabase (later phase)

---

## 📝 Notes

1. **Pattern Compliance:** All pages must follow `CREATE_PAGE_PATTERN.md`
2. **Mock First:** Build with mock data, Supabase repo comes after design completion
3. **Dual Layout:** Every component needs Main + Retro variants
4. **Full Screen:** No page scrolling, app-like experience
5. **SOLID Principles:** Clean Architecture throughout
