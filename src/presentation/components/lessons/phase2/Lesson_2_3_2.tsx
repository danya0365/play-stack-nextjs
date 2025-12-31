"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_2_3_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">PixiJS Rendering และ Filters</h1>

      <Objectives
        items={[
          "Graphics API สำหรับวาดรูปทรง",
          "Blend Modes และ Tinting",
          "Filters สำหรับ visual effects",
          "Masks และ Clipping",
        ]}
      />

      <Section title="Graphics API" icon="🖌️">
        <CodeBlock
          title="Drawing Shapes"
          language="javascript"
          code={`
import * as PIXI from 'pixi.js';

const graphics = new PIXI.Graphics();

// ─────────────────────────────────
// Rectangles
// ─────────────────────────────────
graphics.beginFill(0x4ade80);      // fill color
graphics.lineStyle(2, 0xffffff);    // stroke
graphics.drawRect(50, 50, 100, 80);
graphics.endFill();

// Rounded rectangle
graphics.beginFill(0x60a5fa);
graphics.drawRoundedRect(200, 50, 100, 80, 15);
graphics.endFill();

// ─────────────────────────────────
// Circle & Ellipse
// ─────────────────────────────────
graphics.beginFill(0xf472b6);
graphics.drawCircle(100, 200, 40);  // x, y, radius
graphics.endFill();

graphics.beginFill(0xa78bfa);
graphics.drawEllipse(250, 200, 60, 40);  // x, y, radiusX, radiusY
graphics.endFill();

// ─────────────────────────────────
// Polygon
// ─────────────────────────────────
const points = [
  400, 150,   // point 1
  450, 200,   // point 2
  430, 260,   // point 3
  370, 260,   // point 4
  350, 200    // point 5
];
graphics.beginFill(0xfbbf24);
graphics.drawPolygon(points);
graphics.endFill();

// ─────────────────────────────────
// Lines
// ─────────────────────────────────
graphics.lineStyle(4, 0xef4444);
graphics.moveTo(500, 100);
graphics.lineTo(600, 200);
graphics.lineTo(550, 280);

// Bezier curve
graphics.lineStyle(3, 0x22d3ee);
graphics.moveTo(50, 350);
graphics.bezierCurveTo(100, 300, 200, 400, 250, 350);

app.stage.addChild(graphics);
          `}
        />
      </Section>

      <Section title="Blend Modes" icon="🎨">
        <CodeBlock
          title="Blending Examples"
          language="javascript"
          code={`
// Available blend modes
const blendModes = {
  NORMAL: PIXI.BLEND_MODES.NORMAL,
  ADD: PIXI.BLEND_MODES.ADD,           // Glow effect
  MULTIPLY: PIXI.BLEND_MODES.MULTIPLY, // Shadows
  SCREEN: PIXI.BLEND_MODES.SCREEN,     // Lighten
  OVERLAY: PIXI.BLEND_MODES.OVERLAY,
  DARKEN: PIXI.BLEND_MODES.DARKEN,
  LIGHTEN: PIXI.BLEND_MODES.LIGHTEN,
  COLOR_DODGE: PIXI.BLEND_MODES.COLOR_DODGE,
  COLOR_BURN: PIXI.BLEND_MODES.COLOR_BURN,
  HARD_LIGHT: PIXI.BLEND_MODES.HARD_LIGHT,
  SOFT_LIGHT: PIXI.BLEND_MODES.SOFT_LIGHT,
  DIFFERENCE: PIXI.BLEND_MODES.DIFFERENCE,
  EXCLUSION: PIXI.BLEND_MODES.EXCLUSION
};

// Apply to sprite
const glowSprite = new PIXI.Sprite(glowTexture);
glowSprite.blendMode = PIXI.BLEND_MODES.ADD;

// Example: Light overlay
const lightOverlay = new PIXI.Graphics();
lightOverlay.beginFill(0xffff00, 0.3);
lightOverlay.drawCircle(400, 300, 100);
lightOverlay.endFill();
lightOverlay.blendMode = PIXI.BLEND_MODES.ADD;

// Example: Shadow
const shadow = new PIXI.Graphics();
shadow.beginFill(0x000000, 0.5);
shadow.drawEllipse(player.x, player.y + 50, 30, 10);
shadow.endFill();
shadow.blendMode = PIXI.BLEND_MODES.MULTIPLY;
          `}
        />
      </Section>

      <Section title="Filters" icon="✨">
        <CodeBlock
          title="Built-in Filters"
          language="javascript"
          code={`
// ─────────────────────────────────
// Blur Filter
// ─────────────────────────────────
const blurFilter = new PIXI.BlurFilter();
blurFilter.blur = 5;
background.filters = [blurFilter];

// ─────────────────────────────────
// Color Matrix Filter
// ─────────────────────────────────
const colorMatrix = new PIXI.ColorMatrixFilter();

// Grayscale
colorMatrix.greyscale(0.5);

// Sepia
colorMatrix.sepia();

// Brightness
colorMatrix.brightness(1.5, false);

// Contrast
colorMatrix.contrast(1.2, false);

// Hue rotation
colorMatrix.hue(180, false);

// Saturation
colorMatrix.saturate(0.5, false);

// Apply
sprite.filters = [colorMatrix];

// ─────────────────────────────────
// Alpha Filter
// ─────────────────────────────────
const alphaFilter = new PIXI.AlphaFilter(0.5);
container.filters = [alphaFilter];

// ─────────────────────────────────
// Noise Filter
// ─────────────────────────────────
const noiseFilter = new PIXI.NoiseFilter();
noiseFilter.noise = 0.3;
noiseFilter.seed = Math.random();

// Animate noise
app.ticker.add(() => {
  noiseFilter.seed = Math.random();
});
          `}
        />

        <TipBox type="tip">
          <strong>Performance:</strong> Filters ใช้ GPU มาก 
          ใช้กับ sprites น้อยๆ และ blur ค่าต่ำๆ เพื่อ performance ที่ดี
        </TipBox>
      </Section>

      <Section title="Filter Effects" icon="🔥">
        <CodeBlock
          title="Visual Effects"
          language="javascript"
          code={`
// ─────────────────────────────────
// Glow Effect
// ─────────────────────────────────
// Install: npm install @pixi/filter-glow
import { GlowFilter } from '@pixi/filter-glow';

const glowFilter = new GlowFilter({
  distance: 15,
  outerStrength: 2,
  innerStrength: 0,
  color: 0x00ffff,
  quality: 0.5
});

player.filters = [glowFilter];

// ─────────────────────────────────
// Outline Effect
// ─────────────────────────────────
import { OutlineFilter } from '@pixi/filter-outline';

const outlineFilter = new OutlineFilter(2, 0xffffff);
selectedItem.filters = [outlineFilter];

// ─────────────────────────────────
// Displacement (Distortion)
// ─────────────────────────────────
const displacementSprite = PIXI.Sprite.from('displacement.png');
displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

const displacementFilter = new PIXI.DisplacementFilter(displacementSprite);
displacementFilter.scale.set(30);

app.stage.filters = [displacementFilter];

// Animate
app.ticker.add(() => {
  displacementSprite.x += 1;
  displacementSprite.y += 1;
});

// ─────────────────────────────────
// Multiple Filters
// ─────────────────────────────────
const filters = [
  new PIXI.BlurFilter(2),
  new GlowFilter({ color: 0xff0000, distance: 10 }),
  colorMatrix
];

sprite.filters = filters;
          `}
        />
      </Section>

      <Section title="Masks" icon="🎭">
        <CodeBlock
          title="Masking Sprites"
          language="javascript"
          code={`
// ─────────────────────────────────
// Graphics Mask
// ─────────────────────────────────
const mask = new PIXI.Graphics();
mask.beginFill(0xffffff);
mask.drawCircle(400, 300, 100);
mask.endFill();

// Apply mask
sprite.mask = mask;

// ─────────────────────────────────
// Sprite Mask
// ─────────────────────────────────
const maskSprite = new PIXI.Sprite(maskTexture);
sprite.mask = maskSprite;

// ─────────────────────────────────
// Animated Mask (Spotlight)
// ─────────────────────────────────
const spotlight = new PIXI.Graphics();
spotlight.beginFill(0xffffff);
spotlight.drawCircle(0, 0, 150);
spotlight.endFill();

gameContainer.mask = spotlight;

app.ticker.add(() => {
  // Follow mouse
  spotlight.x = mouse.x;
  spotlight.y = mouse.y;
});

// ─────────────────────────────────
// Reveal Effect
// ─────────────────────────────────
const revealMask = new PIXI.Graphics();
let revealRadius = 0;

function revealAnimation() {
  revealRadius += 5;
  
  revealMask.clear();
  revealMask.beginFill(0xffffff);
  revealMask.drawCircle(400, 300, revealRadius);
  revealMask.endFill();
  
  if (revealRadius < 600) {
    requestAnimationFrame(revealAnimation);
  }
}

hiddenLayer.mask = revealMask;
revealAnimation();
          `}
        />
      </Section>

      <Section title="RenderTexture" icon="📸">
        <CodeBlock
          title="Rendering to Texture"
          language="javascript"
          code={`
// ─────────────────────────────────
// Create RenderTexture
// ─────────────────────────────────
const renderTexture = PIXI.RenderTexture.create({
  width: 256,
  height: 256
});

// Render container to texture
app.renderer.render(container, { renderTexture });

// Use as sprite
const snapshot = new PIXI.Sprite(renderTexture);
app.stage.addChild(snapshot);

// ─────────────────────────────────
// Trail Effect
// ─────────────────────────────────
const trailTexture = PIXI.RenderTexture.create({
  width: app.screen.width,
  height: app.screen.height
});

const trailSprite = new PIXI.Sprite(trailTexture);
trailSprite.alpha = 0.9;

app.ticker.add(() => {
  // Render current frame to trail
  app.renderer.render(app.stage, { renderTexture: trailTexture });
  
  // Fade effect
  trailSprite.alpha = 0.95;
});

// ─────────────────────────────────
// Minimap
// ─────────────────────────────────
const minimapTexture = PIXI.RenderTexture.create({
  width: 200,
  height: 150
});

const minimap = new PIXI.Sprite(minimapTexture);
minimap.x = app.screen.width - 210;
minimap.y = 10;
app.stage.addChild(minimap);

function updateMinimap() {
  const scale = 0.1;
  gameWorld.scale.set(scale);
  app.renderer.render(gameWorld, { renderTexture: minimapTexture });
  gameWorld.scale.set(1);
}
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "BLEND_MODES.ADD ใช้สร้าง effect แบบไหน?",
              options: ["Shadow", "Glow / สว่าง", "Blur", "Grayscale"],
              correctIndex: 1,
              explanation: "ADD blend mode ทำให้สีสว่างขึ้น เหมาะกับ glow effect"
            },
            {
              question: "ColorMatrixFilter ใช้ทำอะไร?",
              options: ["สร้างรูปทรง", "ปรับสี (grayscale, sepia, brightness)", "สร้าง particles", "โหลด assets"],
              correctIndex: 1,
              explanation: "ColorMatrixFilter ใช้ปรับสีและ tone ของภาพ"
            },
            {
              question: "Mask ใน PixiJS ใช้ทำอะไร?",
              options: ["ใส่สี", "ตัดแสดงเฉพาะส่วน (spotlight, reveal)", "สร้าง animation", "โหลด textures"],
              correctIndex: 1,
              explanation: "Mask ซ่อนส่วนของภาพตามรูปร่างที่กำหนด"
            },
            {
              question: "RenderTexture ใช้ทำอะไร?",
              options: ["โหลดภาพ", "Render เป็น texture (สำหรับ trail, minimap)", "สร้าง sprites", "จัดการ physics"],
              correctIndex: 1,
              explanation: "RenderTexture ใช้ render objects เป็น texture สำหรับ effects ต่างๆ"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Feature", "Use Case"]}
          rows={[
            ["Graphics", "วาดรูปทรง (rect, circle, polygon)"],
            ["Blend Modes", "ADD=glow, MULTIPLY=shadow"],
            ["BlurFilter", "Depth of field, UI blur"],
            ["ColorMatrix", "Color grading, grayscale"],
            ["Masks", "Spotlight, reveal, UI clipping"],
            ["RenderTexture", "Trails, minimap, screenshots"],
          ]}
        />

        <ProgressCheck
          items={[
            "ใช้ Graphics API วาดรูปทรงได้",
            "เข้าใจ Blend Modes แต่ละแบบ",
            "ใช้ Filters สร้าง visual effects ได้",
            "ใช้ Masks สร้าง spotlight/reveal ได้",
            "พร้อมเรียน Particles!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Particles และ Effects! 🎆</strong>
        </TipBox>
      </Section>
    </div>
  );
}
