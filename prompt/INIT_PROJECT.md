1. ช่วยเขียน /Users/marosdeeuma/play-stack-nextjs/TODO.md สำหรับโปรเจค /Users/marosdeeuma/play-stack-nextjs

สร้างเว็บแอพ play-stack ตามฟีเจอร์ที่เขียนไว้ที่ /Users/marosdeeuma/play-stack-nextjs/prompt/FEATURES.md

โดยให้ทำ Master Data และ mock repo ด้วย mock data แล้วค่อยมาต่อ supabase repo หลังจาก ดีไซน์ ครบทุกหน้าแล้ว

โดยทุกครั้งที่สร้าง page.tsx ต้องทำตาม pattern ที่เขียนไว้ที่ /Users/marosdeeuma/play-stack-nextjs/prompt/CREATE_PAGE_PATTERN.md

ตามหลัก SOLID Clean

2. จากนั้นเริ่มพัฒนาโปรเจคอันดับแรกเลย ต้องสร้างหน้า Layout 2 แบบคือ MainLayout และ RetroLayout โดยแต่ละ Layout ต้องพร้อม Header Footer และใส่ Theme Toggle เพื่อทำ dark mode (ใช้ next-themes)

MainLayout และ RetroLayout ต้องให้ออกแบบให้ เป็น Full screen ห้าม scroll อารมณ์เหมือนใช้เว็บแอพ

โดย RetroLayout ให้ออกแบบ interface เหมือน Internet Explorer 5 Browser ตามรูป /Users/marosdeeuma/play-stack-nextjs/prompt/internet_explorer_5_on_windows_98.png

ส่วน MainLayout ให้ออกแบบ interface ให้ทันสมัย โดยสามารถใช้ react-spring สำหรับทำ animation เช่น carousel, hover animation, hover effect ต่างๆ

ทั้ง MainLayout และ RetroLayout ต้องมีการสร้าง Reuse Component (พวก Modal, Form, Input, Select, Popover) ให้สไตล์อิงตาม MainLayout และ RetroLayout เตรียมไว้ใช้ในหน้าอื่นๆด้วย

ให้ใช้ MainLayout เป็น layout หลักของหน้า และสามารถ switch layout ได้ด้วยการกดปุ่มที่ Header

ให้ใช้ tailwindcss v4 สำหรับทำ style ที่ /Users/marosdeeuma/play-stack-nextjs/public/styles/index.css แยกไฟล์ css 2 ไฟล์ คือ main-layout.css และ retro-layout.css

3. จากนั้น สร้างหน้า app/landing/page.tsx (ทุก compoment ต้องแยกตาม layout ที่ user เลือก)
