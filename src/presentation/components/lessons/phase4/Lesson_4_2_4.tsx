"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_2_4() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">XR Development (VR/AR)</h1>

      <Objectives
        items={[
          "ทำความเข้าใจ WebXR API",
          "ตั้งค่า VR mode ใน Babylon.js",
          "จัดการ XR controllers",
          "สร้าง immersive experiences",
        ]}
      />

      <Section title="WebXR Overview" icon="🥽">
        <Table
          headers={["Term", "Description"]}
          rows={[
            ["VR", "Virtual Reality - immersive 3D environment"],
            ["AR", "Augmented Reality - overlay on real world"],
            ["XR", "Extended Reality - umbrella term for VR/AR/MR"],
            ["WebXR", "Browser API for XR experiences"],
          ]}
        />

        <TipBox type="info">
          <strong>Babylon.js XR:</strong> มี built-in XR support ที่ดีที่สุดใน web 3D engines
        </TipBox>
      </Section>

      <Section title="Basic VR Setup" icon="🎮">
        <CodeBlock
          title="Enable VR Mode"
          language="typescript"
          code={`
import { WebXRDefaultExperience } from "@babylonjs/core";

// ─────────────────────────────────
// Create default XR experience
// ─────────────────────────────────
const xrHelper = await scene.createDefaultXRExperienceAsync({
  floorMeshes: [ground],          // Meshes to teleport to
  disableTeleportation: false,    // Enable teleport
  optionalFeatures: true
});

// Check if XR is supported
if (!xrHelper.baseExperience) {
  console.log("WebXR not supported");
  return;
}

// ─────────────────────────────────
// Enter/Exit VR
// ─────────────────────────────────
// UI button is created automatically

// Programmatic enter
await xrHelper.baseExperience.enterXRAsync(
  "immersive-vr",
  "local-floor"  // or "bounded-floor", "unbounded"
);

// Exit VR
xrHelper.baseExperience.exitXRAsync();

// ─────────────────────────────────
// XR State events
// ─────────────────────────────────
xrHelper.baseExperience.onStateChangedObservable.add((state) => {
  switch(state) {
    case WebXRState.ENTERING_XR:
      console.log("Entering VR...");
      break;
    case WebXRState.IN_XR:
      console.log("In VR mode");
      break;
    case WebXRState.EXITING_XR:
      console.log("Exiting VR...");
      break;
  }
});
          `}
        />
      </Section>

      <Section title="XR Controllers" icon="🎯">
        <CodeBlock
          title="Handle Controllers"
          language="typescript"
          code={`
// ─────────────────────────────────
// Access controllers
// ─────────────────────────────────
xrHelper.input.onControllerAddedObservable.add((controller) => {
  console.log("Controller added:", controller.uniqueId);
  
  // Get hand (left/right)
  const handedness = controller.inputSource.handedness;
  
  // Controller mesh
  controller.onMotionControllerInitObservable.add((motionController) => {
    // Access buttons
    const trigger = motionController.getComponent("xr-standard-trigger");
    const grip = motionController.getComponent("xr-standard-squeeze");
    const thumbstick = motionController.getComponent("xr-standard-thumbstick");
    
    // ─────────────────────────────────
    // Button events
    // ─────────────────────────────────
    if (trigger) {
      trigger.onButtonStateChangedObservable.add((component) => {
        if (component.pressed) {
          console.log("Trigger pressed!");
          shoot();
        }
      });
    }
    
    if (grip) {
      grip.onButtonStateChangedObservable.add((component) => {
        if (component.pressed) {
          grabObject();
        } else {
          releaseObject();
        }
      });
    }
    
    // ─────────────────────────────────
    // Thumbstick movement
    // ─────────────────────────────────
    if (thumbstick) {
      thumbstick.onAxisValueChangedObservable.add((values) => {
        const { x, y } = values;
        movePlayer(x, y);
      });
    }
  });
});

// Controller removed
xrHelper.input.onControllerRemovedObservable.add((controller) => {
  console.log("Controller removed:", controller.uniqueId);
});
          `}
        />
      </Section>

      <Section title="Teleportation" icon="🚀">
        <CodeBlock
          title="Teleport Setup"
          language="typescript"
          code={`
// ─────────────────────────────────
// Default teleportation
// ─────────────────────────────────
const xrHelper = await scene.createDefaultXRExperienceAsync({
  floorMeshes: [ground, platform1, platform2],
  disableTeleportation: false
});

// ─────────────────────────────────
// Custom teleportation
// ─────────────────────────────────
const teleportation = xrHelper.teleportation;

// Change teleport snap rotation
teleportation.rotationAngle = Math.PI / 8;  // 22.5 degrees

// Teleport options
teleportation.backwardsMovementEnabled = true;
teleportation.parabolicRayEnabled = true;

// Custom teleport events
teleportation.onBeforeTeleportObservable.add((targetPosition) => {
  console.log("Teleporting to:", targetPosition);
});

// ─────────────────────────────────
// Add/remove floor meshes dynamically
// ─────────────────────────────────
teleportation.addFloorMesh(newPlatform);
teleportation.removeFloorMesh(oldPlatform);
          `}
        />
      </Section>

      <Section title="Hand Tracking" icon="✋">
        <CodeBlock
          title="Hand Tracking Setup"
          language="typescript"
          code={`
// ─────────────────────────────────
// Enable hand tracking
// ─────────────────────────────────
const xrHelper = await scene.createDefaultXRExperienceAsync({
  inputOptions: {
    doNotLoadControllerMeshes: false
  }
});

const featuresManager = xrHelper.baseExperience.featuresManager;

// Enable hand tracking feature
const handTracking = featuresManager.enableFeature(
  WebXRFeatureName.HAND_TRACKING,
  "latest",
  {
    xrInput: xrHelper.input
  }
);

// ─────────────────────────────────
// Access hand joints
// ─────────────────────────────────
handTracking.onHandAddedObservable.add((hand) => {
  console.log("Hand added:", hand.xrController.inputSource.handedness);
  
  // Get finger joints
  const indexTip = hand.getJointMesh(XRHandJoint.INDEX_FINGER_TIP);
  const thumbTip = hand.getJointMesh(XRHandJoint.THUMB_TIP);
  
  // Detect pinch gesture
  scene.registerBeforeRender(() => {
    if (indexTip && thumbTip) {
      const distance = Vector3.Distance(
        indexTip.absolutePosition,
        thumbTip.absolutePosition
      );
      
      if (distance < 0.02) {
        onPinch();
      }
    }
  });
});
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "WebXR คืออะไร?",
              options: ["Game engine", "Browser API สำหรับ VR/AR", "3D modeling tool", "Physics engine"],
              correctIndex: 1,
              explanation: "WebXR เป็น Browser API ที่ให้ access VR/AR devices"
            },
            {
              question: "floorMeshes ใช้ทำอะไร?",
              options: ["วาดพื้น", "กำหนด meshes ที่ teleport ได้", "เพิ่ม gravity", "Collision detection"],
              correctIndex: 1,
              explanation: "floorMeshes กำหนดว่า meshes ไหนที่ผู้เล่น teleport ไปได้"
            },
            {
              question: "xr-standard-trigger คืออะไร?",
              options: ["ปุ่ม grip", "ปุ่ม trigger บน controller", "Thumbstick", "Menu button"],
              correctIndex: 1,
              explanation: "xr-standard-trigger คือปุ่ม trigger (นิ้วชี้) บน VR controller"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Feature", "คำอธิบาย"]}
          rows={[
            ["createDefaultXRExperienceAsync", "สร้าง XR experience อัตโนมัติ"],
            ["enterXRAsync", "เข้าสู่ VR mode"],
            ["floorMeshes", "Meshes สำหรับ teleportation"],
            ["onControllerAddedObservable", "Detect controllers"],
            ["Hand Tracking", "ติดตามมือและนิ้ว"],
          ]}
        />

        <ProgressCheck
          items={[
            "ตั้งค่า WebXR ใน Babylon.js ได้",
            "จัดการ VR controllers ได้",
            "ใช้ teleportation ได้",
            "เข้าใจ hand tracking",
            "พร้อมเรียน PlayCanvas!"
          ]}
        />

        <TipBox type="success">
          <strong>Module ต่อไป: PlayCanvas! ☁️</strong>
        </TipBox>
      </Section>
    </div>
  );
}
