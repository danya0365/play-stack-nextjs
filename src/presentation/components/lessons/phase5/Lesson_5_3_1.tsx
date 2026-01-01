"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_5_3_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Ad Integration</h1>

      <Objectives
        items={[
          "เข้าใจ Ad Types สำหรับเกม",
          "ใช้ Google AdSense",
          "Implement Rewarded Ads",
          "Best practices",
        ]}
      />

      <Section title="Ad Types" icon="📺">
        <Table
          headers={["Type", "Description", "Best For"]}
          rows={[
            ["Banner", "แถบโฆษณาที่แสดงตลอด", "Free-to-play, casual"],
            ["Interstitial", "เต็มจอ ระหว่าง levels", "Between stages"],
            ["Rewarded", "ดูโฆษณาได้รางวัล", "Extra lives, powerups"],
            ["Native", "กลมกลืนกับ UI", "In-game stores"],
          ]}
        />

        <TipBox type="tip">
          <strong>Rewarded ads มี CTR ดีที่สุด</strong> เพราะ player เลือกดูเอง
          และได้รับสิ่งตอบแทน
        </TipBox>
      </Section>

      <Section title="Google AdSense" icon="📊">
        <CodeBlock
          title="Setup AdSense"
          language="html"
          code={`
<!-- ใน index.html -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX"
     crossorigin="anonymous"></script>

<!-- Banner Ad Unit -->
<div class="ad-container">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-XXXXXXXX"
       data-ad-slot="1234567890"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>
    (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
          `}
        />

        <CodeBlock
          title="Show Ad Between Levels"
          language="typescript"
          code={`
class AdManager {
  private adsLoaded = false;
  
  showInterstitial() {
    if (!this.adsLoaded) return;
    
    // Show interstitial ad
    (window as any).adsbygoogle.push({});
  }
  
  onLevelComplete(level: number) {
    // Show ad every 3 levels
    if (level % 3 === 0) {
      this.showInterstitial();
    }
  }
}
          `}
        />
      </Section>

      <Section title="Rewarded Ads" icon="🎁">
        <CodeBlock
          title="Implement Rewarded Ad"
          language="typescript"
          code={`
// Using Google AdMob for web
class RewardedAdManager {
  private rewardedAd: any;
  
  async load() {
    // Load rewarded ad
    this.rewardedAd = await google.ima.AdsLoader.load({
      adUnitId: 'ca-pub-XXXX/YYYY',
      type: 'rewarded'
    });
  }
  
  show(onReward: () => void, onClose: () => void) {
    if (!this.rewardedAd) {
      onClose();
      return;
    }
    
    this.rewardedAd.show();
    
    this.rewardedAd.addEventListener('rewarded', (reward) => {
      console.log('User earned reward:', reward);
      onReward();
    });
    
    this.rewardedAd.addEventListener('closed', () => {
      onClose();
      this.load(); // Preload next ad
    });
  }
}

// Usage
const adManager = new RewardedAdManager();
await adManager.load();

// When player clicks "Watch Ad for Extra Life"
function onWatchAdClick() {
  adManager.show(
    () => {
      player.lives++;
      updateUI();
    },
    () => {
      resumeGame();
    }
  );
}
          `}
        />
      </Section>

      <Section title="Best Practices" icon="✅">
        <Table
          headers={["Do", "Don't"]}
          rows={[
            ["Show ads at natural breaks", "Interrupt gameplay"],
            ["Offer value for watching", "Force ads too often"],
            ["Test ad placement A/B", "Assume one size fits all"],
            ["Respect user time", "Make ads unskippable always"],
          ]}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Ad type ไหนที่ player ชอบมากที่สุด?",
              options: ["Banner", "Interstitial", "Rewarded", "Pop-up"],
              correctIndex: 2,
              explanation: "Rewarded ads ให้ player เลือกเองและได้รับ reward ตอบแทน"
            },
            {
              question: "ควรแสดง ads เมื่อไหร่?",
              options: ["ตลอดเวลา", "ระหว่าง gameplay", "ที่ natural breaks", "ไม่ควรแสดง"],
              correctIndex: 2,
              explanation: "แสดงที่ natural breaks เช่น between levels เพื่อไม่รบกวน gameplay"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <ProgressCheck
          items={[
            "เข้าใจ ad types",
            "Setup AdSense ได้",
            "Implement rewarded ads ได้",
            "พร้อมเรียน In-App Purchases!"
          ]}
        />
      </Section>
    </div>
  );
}
