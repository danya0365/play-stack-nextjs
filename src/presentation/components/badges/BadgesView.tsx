"use client";

import { Badge, badges, getRarityColor } from "@/src/data/master/badges";
import { useAuthStore } from "@/src/presentation/stores/authStore";
import { useLayoutStore } from "@/src/presentation/stores/layoutStore";

export function BadgesView() {
  const { layout } = useLayoutStore();
  const { user, isLoggedIn } = useAuthStore();

  const categories = [
    { id: "learning", name: "Learning", icon: "📚" },
    { id: "practice", name: "Practice", icon: "💻" },
    { id: "social", name: "Social", icon: "👥" },
    { id: "special", name: "Special", icon: "⭐" },
  ];

  // Mock earned badges for demo
  const earnedBadgeIds = isLoggedIn
    ? ["first-lesson", "code-runner", "early-bird"]
    : [];

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 dark:bg-gray-800";
      case "rare":
        return "bg-blue-50 dark:bg-blue-900/30";
      case "epic":
        return "bg-purple-50 dark:bg-purple-900/30";
      case "legendary":
        return "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30";
      default:
        return "bg-gray-100";
    }
  };

  if (layout === "retro") {
    return (
      <div className="retro-page h-full overflow-auto">
        {/* Header */}
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">🏅 Badges & Achievements</span>
          <p className="text-xs py-1">
            สะสม badges จากการเรียนและทำ challenge!
            {isLoggedIn && (
              <span className="ml-2 font-bold">
                คุณได้ {earnedBadgeIds.length}/{badges.length} badges
              </span>
            )}
          </p>
        </div>

        {/* Categories */}
        {categories.map((cat) => {
          const catBadges = badges.filter((b) => b.category === cat.id);
          return (
            <div key={cat.id} className="retro-groupbox">
              <span className="retro-groupbox-title">
                {cat.icon} {cat.name}
              </span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {catBadges.map((badge) => {
                  const isEarned = earnedBadgeIds.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`retro-card text-xs ${
                        isEarned ? "" : "opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{badge.icon}</span>
                        <div>
                          <div className="font-bold">{badge.nameTh}</div>
                          <div className="text-gray-600">
                            +{badge.points} pts
                          </div>
                        </div>
                        {isEarned && <span className="ml-auto">✅</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Main Layout
  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🏅 Badges & Achievements
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            สะสม badges จากการเรียนและทำ challenge!
          </p>
          {isLoggedIn && (
            <div className="mt-4 text-lg">
              คุณได้{" "}
              <span className="font-bold text-indigo-600">
                {earnedBadgeIds.length}
              </span>{" "}
              จาก {badges.length} badges
            </div>
          )}
        </div>

        {/* Categories */}
        {categories.map((cat) => {
          const catBadges = badges.filter((b) => b.category === cat.id);
          return (
            <div key={cat.id} className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {cat.icon} {cat.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catBadges.map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    isEarned={earnedBadgeIds.includes(badge.id)}
                    getRarityBg={getRarityBg}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BadgeCard({
  badge,
  isEarned,
  getRarityBg,
}: {
  badge: Badge;
  isEarned: boolean;
  getRarityBg: (rarity: string) => string;
}) {
  return (
    <div
      className={`main-card ${getRarityBg(badge.rarity)} ${
        isEarned ? "" : "opacity-60 grayscale"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">{badge.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {badge.nameTh}
            </h3>
            {isEarned && <span className="text-green-500">✅</span>}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {badge.descriptionTh}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-sm font-medium ${getRarityColor(badge.rarity)}`}>
              {badge.rarity.toUpperCase()}
            </span>
            <span className="text-sm text-indigo-600 font-medium">
              +{badge.points} pts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
