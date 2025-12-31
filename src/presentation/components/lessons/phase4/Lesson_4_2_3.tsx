"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_2_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Deployment และ Publishing</h1>

      <Objectives
        items={[
          "Build และ optimize สำหรับ production",
          "Hosting options (Vercel, itch.io, etc.)",
          "PWA สำหรับ installable games",
          "SEO และ social sharing",
        ]}
      />

      <Section title="Production Build" icon="📦">
        <CodeBlock
          title="Build Configuration"
          language="javascript"
          code={`
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',  // relative paths for hosting anywhere
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    
    // Minify
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // remove console.log
        drop_debugger: true
      }
    },
    
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['phaser', 'three'],
          utils: ['./src/utils/index.js']
        }
      }
    },
    
    // Source maps (disabled for production)
    sourcemap: false,
    
    // Assets
    assetsInlineLimit: 4096  // inline small assets
  },
  
  // Optimize deps
  optimizeDeps: {
    include: ['phaser', 'three']
  }
});
          `}
        />

        <CodeBlock
          title="Build Commands"
          language="bash"
          code={`
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Analyze bundle
npm run build -- --report
          `}
        />
      </Section>

      <Section title="Asset Optimization" icon="🖼️">
        <CodeBlock
          title="Image & Audio Optimization"
          language="bash"
          code={`
# Install tools
npm install -D imagemin imagemin-webp sharp

# Convert images to WebP
# Create script: scripts/optimize-assets.js
          `}
        />

        <CodeBlock
          title="Asset Optimization Script"
          language="javascript"
          code={`
// scripts/optimize-assets.js
import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'fs';
import { join, extname, basename } from 'path';

const inputDir = './assets/images';
const outputDir = './public/assets/images';

// Ensure output directory exists
mkdirSync(outputDir, { recursive: true });

// Process images
const files = readdirSync(inputDir);

for (const file of files) {
  const ext = extname(file).toLowerCase();
  const name = basename(file, ext);
  
  if (['.png', '.jpg', '.jpeg'].includes(ext)) {
    // Convert to WebP
    await sharp(join(inputDir, file))
      .webp({ quality: 80 })
      .toFile(join(outputDir, \`\${name}.webp\`));
    
    // Create thumbnail
    await sharp(join(inputDir, file))
      .resize(128, 128)
      .webp({ quality: 60 })
      .toFile(join(outputDir, \`\${name}_thumb.webp\`));
    
    console.log(\`Optimized: \${file}\`);
  }
}

// Audio: Use FFmpeg to convert to OGG/MP3
// ffmpeg -i input.wav -c:a libvorbis -q:a 5 output.ogg
          `}
        />

        <TipBox type="tip">
          <strong>Asset Tips:</strong>
          <ul className="mt-2 space-y-1">
            <li>• ใช้ WebP แทน PNG/JPG (30-50% smaller)</li>
            <li>• Audio: OGG สำหรับ web, MP3 fallback</li>
            <li>• Spritesheet รวม sprites ลด HTTP requests</li>
            <li>• Lazy load assets ที่ยังไม่ใช้</li>
          </ul>
        </TipBox>
      </Section>

      <Section title="Hosting Options" icon="🌐">
        <Table
          headers={["Platform", "Best For", "Free Tier"]}
          rows={[
            ["itch.io", "Indie games, game jams", "✅ Yes"],
            ["Vercel", "Next.js, React games", "✅ Yes"],
            ["Netlify", "Static sites", "✅ Yes"],
            ["GitHub Pages", "Simple hosting", "✅ Yes"],
            ["Cloudflare Pages", "Global CDN", "✅ Yes"],
            ["Newgrounds", "Flash-style games", "✅ Yes"],
          ]}
        />

        <CodeBlock
          title="Deploy to itch.io"
          language="bash"
          code={`
# 1. Build your game
npm run build

# 2. Zip the dist folder
cd dist
zip -r ../my-game.zip .

# 3. Upload to itch.io
# - Go to itch.io/game/new
# - Upload my-game.zip
# - Set "Kind of project" to "HTML"
# - Set viewport dimensions
# - Enable "Embed in page"
          `}
        />

        <CodeBlock
          title="Deploy to Vercel"
          language="bash"
          code={`
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect GitHub repo
# - Go to vercel.com
# - Import project from GitHub
# - Auto-deploy on push
          `}
        />
      </Section>

      <Section title="PWA (Installable Game)" icon="📱">
        <CodeBlock
          title="PWA Setup"
          language="json"
          code={`
// public/manifest.json
{
  "name": "My Awesome Game",
  "short_name": "MyGame",
  "description": "An awesome web game",
  "start_url": "/",
  "display": "fullscreen",
  "orientation": "landscape",
  "background_color": "#1a1a2e",
  "theme_color": "#4ade80",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
          `}
        />

        <CodeBlock
          title="Service Worker"
          language="javascript"
          code={`
// public/sw.js
const CACHE_NAME = 'my-game-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/game.js',
  '/assets/style.css',
  '/assets/sprites/player.png',
  '/assets/audio/music.mp3'
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch (cache-first)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Activate (cleanup old caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
          `}
        />

        <CodeBlock
          title="Register Service Worker"
          language="html"
          code={`
<!-- index.html -->
<link rel="manifest" href="/manifest.json">

<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('SW registered'));
}
</script>
          `}
        />
      </Section>

      <Section title="SEO & Social Sharing" icon="🔗">
        <CodeBlock
          title="Meta Tags"
          language="html"
          code={`
<!-- index.html -->
<head>
  <title>My Awesome Game - Play Free Online</title>
  <meta name="description" content="Play My Awesome Game for free! 
    An exciting adventure with stunning graphics.">
  
  <!-- Open Graph (Facebook, Discord) -->
  <meta property="og:title" content="My Awesome Game">
  <meta property="og:description" content="Play for free!">
  <meta property="og:image" content="https://mygame.com/preview.jpg">
  <meta property="og:url" content="https://mygame.com">
  <meta property="og:type" content="website">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="My Awesome Game">
  <meta name="twitter:description" content="Play for free!">
  <meta name="twitter:image" content="https://mygame.com/preview.jpg">
  
  <!-- Viewport for mobile -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, 
    maximum-scale=1.0, user-scalable=no">
  
  <!-- Prevent zoom on double-tap -->
  <meta name="apple-mobile-web-app-capable" content="yes">
</head>
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "WebP ดีกว่า PNG/JPG อย่างไร?",
              options: ["สวยกว่า", "ขนาดเล็กกว่า 30-50%", "รองรับหลาย browsers กว่า", "เร็วกว่า"],
              correctIndex: 1,
              explanation: "WebP มีขนาดเล็กกว่า แต่คุณภาพใกล้เคียง"
            },
            {
              question: "PWA คืออะไร?",
              options: ["PHP Web App", "Progressive Web App (ติดตั้งได้เหมือน app)", "Portable Web Archive", "Public Web Access"],
              correctIndex: 1,
              explanation: "PWA ทำให้ website ติดตั้งลงเครื่องและทำงาน offline ได้"
            },
            {
              question: "Service Worker ใช้ทำอะไร?",
              options: ["เล่นเกม", "Cache files สำหรับใช้งาน offline", "ส่ง notifications", "วิเคราะห์ข้อมูล"],
              correctIndex: 1,
              explanation: "Service Worker cache files ทำให้เกมทำงาน offline ได้"
            },
            {
              question: "OG tags ใช้ทำอะไร?",
              options: ["เล่นเกม", "แสดง preview เมื่อ share link บน social media", "ติดตั้ง analytics", "เพิ่มความเร็ว"],
              correctIndex: 1,
              explanation: "Open Graph tags กำหนดรูปและข้อความเมื่อ share"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Step", "Action"]}
          rows={[
            ["1. Build", "npm run build, minify, optimize"],
            ["2. Assets", "WebP images, compressed audio"],
            ["3. Test", "Preview build locally"],
            ["4. Deploy", "itch.io, Vercel, etc."],
            ["5. PWA", "Manifest + Service Worker"],
            ["6. Share", "OG tags, screenshots"],
          ]}
        />

        <ProgressCheck
          items={[
            "Build production ได้",
            "Optimize assets ได้",
            "Deploy ลง hosting ได้",
            "ตั้งค่า PWA ได้",
            "พร้อมสำหรับ Phase 5: Career!"
          ]}
        />

        <TipBox type="success">
          <strong>🎉 จบ Phase 4: Advanced Concepts!</strong>
          <br />
          Phase 5: Career Preparation!
        </TipBox>
      </Section>
    </div>
  );
}
