"use client";

import { CodeBlock, Objectives, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_2_3_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">PixiJS Particles และ Effects</h1>

      <Objectives
        items={[
          "สร้าง Particle System",
          "Visual Effects: Fire, Smoke, Sparks",
          "Custom Particle Behaviors",
          "Performance Optimization",
        ]}
      />

      <Section title="Particle Container" icon="✨">
        <p className="mb-4">
          <strong>ParticleContainer</strong> optimized สำหรับแสดง sprites จำนวนมากที่เหมือนกัน:
        </p>

        <CodeBlock
          title="ParticleContainer Basics"
          language="javascript"
          code={`
import * as PIXI from 'pixi.js';

// ParticleContainer - optimized for many similar sprites
const particleContainer = new PIXI.ParticleContainer(10000, {
  scale: true,
  position: true,
  rotation: true,
  alpha: true,
  uvs: false,
  tint: false
});

app.stage.addChild(particleContainer);

// Create particles
const particles = [];

for (let i = 0; i < 1000; i++) {
  const particle = new PIXI.Sprite(particleTexture);
  particle.x = Math.random() * app.screen.width;
  particle.y = Math.random() * app.screen.height;
  particle.scale.set(0.5 + Math.random() * 0.5);
  particle.alpha = 0.5 + Math.random() * 0.5;
  
  // Custom properties
  particle.vx = (Math.random() - 0.5) * 2;
  particle.vy = (Math.random() - 0.5) * 2;
  particle.life = Math.random() * 100;
  
  particleContainer.addChild(particle);
  particles.push(particle);
}

// Update particles
app.ticker.add((delta) => {
  particles.forEach(p => {
    p.x += p.vx * delta;
    p.y += p.vy * delta;
    p.life -= delta;
    p.alpha = p.life / 100;
    
    // Respawn
    if (p.life <= 0) {
      p.x = Math.random() * app.screen.width;
      p.y = Math.random() * app.screen.height;
      p.life = 100;
      p.alpha = 1;
    }
  });
});
          `}
        />
      </Section>

      <Section title="Particle System Class" icon="🔥">
        <CodeBlock
          title="Reusable Particle System"
          language="javascript"
          code={`
class ParticleSystem {
  constructor(app, texture, config = {}) {
    this.app = app;
    this.texture = texture;
    this.particles = [];
    this.emitting = false;
    
    // Config
    this.config = {
      maxParticles: config.maxParticles || 500,
      emitRate: config.emitRate || 10,    // per frame
      lifetime: config.lifetime || 60,     // frames
      
      // Position
      x: config.x || 0,
      y: config.y || 0,
      spread: config.spread || 20,
      
      // Velocity
      speed: config.speed || 3,
      speedVariance: config.speedVariance || 1,
      angle: config.angle || -Math.PI / 2,  // up
      angleVariance: config.angleVariance || Math.PI / 6,
      
      // Appearance
      startScale: config.startScale || 1,
      endScale: config.endScale || 0,
      startAlpha: config.startAlpha || 1,
      endAlpha: config.endAlpha || 0,
      tint: config.tint || 0xffffff,
      
      // Physics
      gravity: config.gravity || 0,
      ...config
    };
    
    // Container
    this.container = new PIXI.ParticleContainer(this.config.maxParticles, {
      scale: true,
      position: true,
      rotation: true,
      alpha: true
    });
    
    // Pool
    this.pool = [];
    for (let i = 0; i < this.config.maxParticles; i++) {
      const p = new PIXI.Sprite(texture);
      p.anchor.set(0.5);
      p.visible = false;
      this.container.addChild(p);
      this.pool.push(p);
    }
    
    app.stage.addChild(this.container);
    app.ticker.add(this.update, this);
  }
  
  emit(count = 1) {
    for (let i = 0; i < count; i++) {
      this.spawnParticle();
    }
  }
  
  startEmitting() {
    this.emitting = true;
  }
  
  stopEmitting() {
    this.emitting = false;
  }
  
  spawnParticle() {
    const p = this.pool.find(p => !p.visible);
    if (!p) return;
    
    const cfg = this.config;
    
    // Position
    p.x = cfg.x + (Math.random() - 0.5) * cfg.spread;
    p.y = cfg.y + (Math.random() - 0.5) * cfg.spread;
    
    // Velocity
    const angle = cfg.angle + (Math.random() - 0.5) * cfg.angleVariance * 2;
    const speed = cfg.speed + (Math.random() - 0.5) * cfg.speedVariance * 2;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
    
    // Appearance
    p.scale.set(cfg.startScale);
    p.alpha = cfg.startAlpha;
    p.tint = cfg.tint;
    
    // Life
    p.life = cfg.lifetime;
    p.maxLife = cfg.lifetime;
    
    p.visible = true;
    this.particles.push(p);
  }
  
  update(delta) {
    const cfg = this.config;
    
    // Emit
    if (this.emitting) {
      for (let i = 0; i < cfg.emitRate; i++) {
        this.spawnParticle();
      }
    }
    
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Physics
      p.vy += cfg.gravity * delta;
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      
      // Life
      p.life -= delta;
      const lifeRatio = p.life / p.maxLife;
      
      // Interpolate
      p.scale.set(cfg.endScale + (cfg.startScale - cfg.endScale) * lifeRatio);
      p.alpha = cfg.endAlpha + (cfg.startAlpha - cfg.endAlpha) * lifeRatio;
      
      // Dead?
      if (p.life <= 0) {
        p.visible = false;
        this.particles.splice(i, 1);
      }
    }
  }
  
  setPosition(x, y) {
    this.config.x = x;
    this.config.y = y;
  }
  
  destroy() {
    this.app.ticker.remove(this.update, this);
    this.container.destroy({ children: true });
  }
}
          `}
        />
      </Section>

      <Section title="Effect Presets" icon="🎆">
        <CodeBlock
          title="Fire, Smoke, Sparks"
          language="javascript"
          code={`
// ─────────────────────────────────
// FIRE EFFECT
// ─────────────────────────────────
const fireConfig = {
  x: 400,
  y: 500,
  maxParticles: 300,
  emitRate: 5,
  lifetime: 40,
  spread: 20,
  speed: 4,
  speedVariance: 1,
  angle: -Math.PI / 2,
  angleVariance: Math.PI / 8,
  startScale: 0.8,
  endScale: 0,
  startAlpha: 0.8,
  endAlpha: 0,
  gravity: -0.05,  // float up
  tint: 0xff6600
};

const fire = new ParticleSystem(app, fireTexture, fireConfig);
fire.startEmitting();

// ─────────────────────────────────
// SMOKE EFFECT
// ─────────────────────────────────
const smokeConfig = {
  x: 400,
  y: 480,
  maxParticles: 100,
  emitRate: 1,
  lifetime: 120,
  spread: 30,
  speed: 1,
  angle: -Math.PI / 2,
  angleVariance: Math.PI / 6,
  startScale: 0.3,
  endScale: 2,
  startAlpha: 0.4,
  endAlpha: 0,
  gravity: -0.02,
  tint: 0x888888
};

const smoke = new ParticleSystem(app, smokeTexture, smokeConfig);
smoke.startEmitting();

// ─────────────────────────────────
// SPARKS / EXPLOSION
// ─────────────────────────────────
function createExplosion(x, y) {
  const explosionConfig = {
    x, y,
    maxParticles: 100,
    emitRate: 0,  // manual emit
    lifetime: 30,
    spread: 10,
    speed: 8,
    speedVariance: 3,
    angle: 0,
    angleVariance: Math.PI,  // all directions
    startScale: 0.5,
    endScale: 0,
    startAlpha: 1,
    endAlpha: 0,
    gravity: 0.2,
    tint: 0xffcc00
  };
  
  const explosion = new ParticleSystem(app, sparkTexture, explosionConfig);
  explosion.emit(50);  // burst
  
  // Auto cleanup
  setTimeout(() => explosion.destroy(), 2000);
}

// ─────────────────────────────────
// RAIN
// ─────────────────────────────────
const rainConfig = {
  x: app.screen.width / 2,
  y: -20,
  maxParticles: 500,
  emitRate: 10,
  lifetime: 100,
  spread: app.screen.width,
  speed: 10,
  angle: Math.PI / 2 + 0.2,  // down-right
  angleVariance: 0.1,
  startScale: 0.3,
  endScale: 0.3,
  startAlpha: 0.6,
  endAlpha: 0.3,
  gravity: 0.1,
  tint: 0x8888ff
};

const rain = new ParticleSystem(app, rainTexture, rainConfig);
rain.startEmitting();
          `}
        />
      </Section>

      <Section title="Collectible Effects" icon="⭐">
        <CodeBlock
          title="Coin Collection Effect"
          language="javascript"
          code={`
function collectCoin(coin) {
  // Sparkle burst
  for (let i = 0; i < 10; i++) {
    const sparkle = new PIXI.Sprite(sparkleTexture);
    sparkle.anchor.set(0.5);
    sparkle.x = coin.x;
    sparkle.y = coin.y;
    sparkle.scale.set(0.5);
    
    const angle = (Math.PI * 2 / 10) * i;
    sparkle.vx = Math.cos(angle) * 3;
    sparkle.vy = Math.sin(angle) * 3;
    
    app.stage.addChild(sparkle);
    
    // Animate
    const startTime = Date.now();
    const duration = 500;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1) {
        sparkle.destroy();
        return;
      }
      
      sparkle.x += sparkle.vx;
      sparkle.y += sparkle.vy;
      sparkle.alpha = 1 - progress;
      sparkle.scale.set(0.5 * (1 - progress));
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  // Score popup
  const scoreText = new PIXI.Text('+10', {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffd700,
    fontWeight: 'bold'
  });
  scoreText.anchor.set(0.5);
  scoreText.x = coin.x;
  scoreText.y = coin.y;
  app.stage.addChild(scoreText);
  
  // Animate score
  const startY = coin.y;
  let frame = 0;
  
  app.ticker.add(function scoreAnim(delta) {
    frame += delta;
    scoreText.y = startY - frame * 2;
    scoreText.alpha = 1 - (frame / 30);
    
    if (frame >= 30) {
      scoreText.destroy();
      app.ticker.remove(scoreAnim);
    }
  });
  
  // Remove coin
  coin.destroy();
}
          `}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Effect", "Config Key Points"]}
          rows={[
            ["Fire", "gravity: negative, tint: orange"],
            ["Smoke", "endScale > startScale, gray tint"],
            ["Sparks", "angleVariance: PI, short life"],
            ["Rain", "angle: down, high emit rate"],
            ["Explosion", "burst emit, all angles"],
          ]}
        />

        <TipBox type="success">
          <strong>🎉 จบ Phase 2 แล้ว!</strong>
          <br />
          Phase 3: 3D Games with Three.js!
        </TipBox>
      </Section>
    </div>
  );
}
