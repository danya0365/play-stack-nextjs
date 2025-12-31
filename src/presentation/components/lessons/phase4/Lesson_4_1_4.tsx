"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_1_4() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Audio และ Sound Effects</h1>

      <Objectives
        items={[
          "Web Audio API พื้นฐาน",
          "Sound Manager Class",
          "Positional Audio (3D Sound)",
          "Music และ Dynamic Audio",
        ]}
      />

      <Section title="Web Audio API" icon="🔊">
        <CodeBlock
          title="Audio Context Basics"
          language="javascript"
          code={`
// Create audio context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// ─────────────────────────────────
// Load audio file
// ─────────────────────────────────
async function loadSound(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

// ─────────────────────────────────
// Play sound
// ─────────────────────────────────
function playSound(buffer, volume = 1, loop = false) {
  const source = audioCtx.createBufferSource();
  const gainNode = audioCtx.createGain();
  
  source.buffer = buffer;
  source.loop = loop;
  
  gainNode.gain.value = volume;
  
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  source.start(0);
  
  return { source, gainNode };
}

// Usage
let jumpSound;
loadSound('sounds/jump.wav').then(buffer => {
  jumpSound = buffer;
});

function onJump() {
  if (jumpSound) {
    playSound(jumpSound, 0.5);
  }
}
          `}
        />

        <TipBox type="warning">
          <strong>Browser Policy:</strong> Audio context ต้อง resume หลัง user interaction!
        </TipBox>

        <CodeBlock
          title="Resume on Click"
          language="javascript"
          code={`
document.addEventListener('click', () => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}, { once: true });
          `}
        />
      </Section>

      <Section title="Sound Manager" icon="🎵">
        <CodeBlock
          title="Complete Sound Manager"
          language="javascript"
          code={`
class SoundManager {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.sounds = new Map();
    this.music = null;
    this.musicGain = null;
    
    this.masterVolume = 1;
    this.sfxVolume = 1;
    this.musicVolume = 0.5;
    
    // Master gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    
    // Resume on interaction
    document.addEventListener('click', () => {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }, { once: true });
  }
  
  // ─────────────────────────────────
  // Load sounds
  // ─────────────────────────────────
  async load(name, url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
    this.sounds.set(name, audioBuffer);
    return audioBuffer;
  }
  
  async loadAll(soundMap) {
    const promises = Object.entries(soundMap).map(([name, url]) => 
      this.load(name, url)
    );
    await Promise.all(promises);
    console.log('All sounds loaded!');
  }
  
  // ─────────────────────────────────
  // Play SFX
  // ─────────────────────────────────
  play(name, options = {}) {
    const buffer = this.sounds.get(name);
    if (!buffer) {
      console.warn(\`Sound '\${name}' not found\`);
      return null;
    }
    
    const {
      volume = 1,
      pitch = 1,
      loop = false,
      pan = 0
    } = options;
    
    const source = this.ctx.createBufferSource();
    const gainNode = this.ctx.createGain();
    const panNode = this.ctx.createStereoPanner();
    
    source.buffer = buffer;
    source.loop = loop;
    source.playbackRate.value = pitch;
    
    gainNode.gain.value = volume * this.sfxVolume * this.masterVolume;
    panNode.pan.value = pan;
    
    source.connect(gainNode);
    gainNode.connect(panNode);
    panNode.connect(this.masterGain);
    
    source.start(0);
    
    return {
      source,
      stop: () => source.stop(),
      setVolume: (v) => gainNode.gain.value = v * this.sfxVolume * this.masterVolume
    };
  }
  
  // ─────────────────────────────────
  // Play with random pitch (variety)
  // ─────────────────────────────────
  playVaried(name, options = {}) {
    const pitch = 0.9 + Math.random() * 0.2;  // 0.9 - 1.1
    return this.play(name, { ...options, pitch });
  }
  
  // ─────────────────────────────────
  // Music
  // ─────────────────────────────────
  playMusic(name, fadeIn = 1) {
    // Stop current music
    this.stopMusic(fadeIn);
    
    const buffer = this.sounds.get(name);
    if (!buffer) return;
    
    const source = this.ctx.createBufferSource();
    const gainNode = this.ctx.createGain();
    
    source.buffer = buffer;
    source.loop = true;
    
    // Fade in
    gainNode.gain.value = 0;
    gainNode.gain.linearRampToValueAtTime(
      this.musicVolume * this.masterVolume,
      this.ctx.currentTime + fadeIn
    );
    
    source.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    source.start(0);
    
    this.music = source;
    this.musicGain = gainNode;
  }
  
  stopMusic(fadeOut = 1) {
    if (this.music && this.musicGain) {
      const gain = this.musicGain;
      const source = this.music;
      
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + fadeOut);
      
      setTimeout(() => {
        source.stop();
      }, fadeOut * 1000);
    }
    
    this.music = null;
    this.musicGain = null;
  }
  
  // ─────────────────────────────────
  // Volume controls
  // ─────────────────────────────────
  setMasterVolume(value) {
    this.masterVolume = value;
    this.masterGain.gain.value = value;
  }
  
  setSFXVolume(value) {
    this.sfxVolume = value;
  }
  
  setMusicVolume(value) {
    this.musicVolume = value;
    if (this.musicGain) {
      this.musicGain.gain.value = value * this.masterVolume;
    }
  }
}

// ─────────────────────────────────
// Usage
// ─────────────────────────────────
const audio = new SoundManager();

await audio.loadAll({
  jump: 'sounds/jump.wav',
  shoot: 'sounds/shoot.wav',
  hit: 'sounds/hit.wav',
  coin: 'sounds/coin.wav',
  explosion: 'sounds/explosion.wav',
  music_menu: 'music/menu.mp3',
  music_game: 'music/game.mp3'
});

// Play sounds
audio.play('jump');
audio.playVaried('shoot');
audio.play('hit', { volume: 0.8, pan: -0.5 });

// Music
audio.playMusic('music_game', 2);  // 2 second fade in
          `}
        />
      </Section>

      <Section title="Positional Audio (3D)" icon="🎧">
        <CodeBlock
          title="3D Sound"
          language="javascript"
          code={`
class Positional3DAudio {
  constructor(audioCtx) {
    this.ctx = audioCtx;
    
    // Set listener (player position)
    this.listener = this.ctx.listener;
    
    // Modern API
    if (this.listener.positionX) {
      this.listener.positionX.value = 0;
      this.listener.positionY.value = 0;
      this.listener.positionZ.value = 0;
      this.listener.forwardX.value = 0;
      this.listener.forwardY.value = 0;
      this.listener.forwardZ.value = -1;
    }
  }
  
  // ─────────────────────────────────
  // Update listener position
  // ─────────────────────────────────
  updateListener(position, forward) {
    if (this.listener.positionX) {
      this.listener.positionX.value = position.x;
      this.listener.positionY.value = position.y;
      this.listener.positionZ.value = position.z;
      
      this.listener.forwardX.value = forward.x;
      this.listener.forwardY.value = forward.y;
      this.listener.forwardZ.value = forward.z;
    }
  }
  
  // ─────────────────────────────────
  // Play 3D sound
  // ─────────────────────────────────
  play3D(buffer, position, options = {}) {
    const {
      volume = 1,
      refDistance = 1,
      maxDistance = 100,
      rolloffFactor = 1
    } = options;
    
    const source = this.ctx.createBufferSource();
    const panner = this.ctx.createPanner();
    const gainNode = this.ctx.createGain();
    
    source.buffer = buffer;
    
    // Panner settings
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = refDistance;
    panner.maxDistance = maxDistance;
    panner.rolloffFactor = rolloffFactor;
    
    // Set position
    panner.positionX.value = position.x;
    panner.positionY.value = position.y;
    panner.positionZ.value = position.z;
    
    gainNode.gain.value = volume;
    
    source.connect(panner);
    panner.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    source.start(0);
    
    return {
      source,
      panner,
      setPosition: (x, y, z) => {
        panner.positionX.value = x;
        panner.positionY.value = y;
        panner.positionZ.value = z;
      }
    };
  }
}

// Usage (in game loop)
function update() {
  // Update listener to player position
  audio3d.updateListener(
    camera.position,
    camera.getWorldDirection(new THREE.Vector3())
  );
}

// Play explosion at world position
audio3d.play3D(explosionBuffer, { x: 10, y: 0, z: 5 });
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "AudioContext คืออะไร?",
              options: ["ไฟล์เสียง", "Core ของ Web Audio API", "HTML element", "Video player"],
              correctIndex: 1,
              explanation: "AudioContext เป็น core ที่ใช้สร้างและเชื่อม audio nodes"
            },
            {
              question: "GainNode ใช้ทำอะไร?",
              options: ["เปลี่ยน pitch", "ควบคุมเสียง (volume)", "ทำ 3D", "เล่นวน"],
              correctIndex: 1,
              explanation: "GainNode ควบคุมความดังของเสียง"
            },
            {
              question: "PannerNode ใช้ทำอะไร?",
              options: ["เล่นวน", "3D positional audio", "ควบคุม volume", "บันทึก"],
              correctIndex: 1,
              explanation: "PannerNode ทำให้เสียงมาจากตำแหน่งใน 3D space"
            },
            {
              question: "ทำไม AudioContext ต้อง resume หลัง user interaction?",
              options: ["Bug ของ browser", "Browser policy ป้องกัน autoplay เสียงรบกวน", "ประหยัด memory", "ไม่จำเป็น"],
              correctIndex: 1,
              explanation: "Browser บล็อก autoplay audio เพื่อ user experience"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "Use Case"]}
          rows={[
            ["AudioContext", "Core audio processing"],
            ["GainNode", "Volume control"],
            ["StereoPanner", "Left/Right panning"],
            ["PannerNode", "3D positional audio"],
            ["playbackRate", "Pitch/speed control"],
          ]}
        />

        <ProgressCheck
          items={[
            "ใช้ Web Audio API ได้",
            "สร้าง Sound Manager ได้",
            "ใช้ 3D Positional Audio ได้",
            "จัดการ music fade in/out ได้",
            "พร้อมเรียน Performance Optimization!"
          ]}
        />

        <TipBox type="success">
          <strong>🎉 จบ Phase 4 Module 4.1!</strong>
          <br />
          บทต่อไป: Performance Optimization!
        </TipBox>
      </Section>
    </div>
  );
}
