"use client";

import { ForumPost, forumPosts } from "@/src/data/master/community";
import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import { useState } from "react";

export function CommunityView() {
  const { layout } = useLayoutStore();
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", name: "ทั้งหมด", icon: "📁" },
    { id: "question", name: "คำถาม", icon: "❓" },
    { id: "showcase", name: "โชว์ผลงาน", icon: "🏆" },
    { id: "discussion", name: "พูดคุย", icon: "💬" },
    { id: "help", name: "ขอความช่วยเหลือ", icon: "🆘" },
  ];

  const filteredPosts = forumPosts
    .filter((p) => filter === "all" || p.category === filter)
    .filter(
      (p) =>
        searchTerm === "" ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const getCategoryStyle = (cat: string) => {
    switch (cat) {
      case "question":
        return "bg-blue-100 text-blue-700";
      case "showcase":
        return "bg-green-100 text-green-700";
      case "discussion":
        return "bg-purple-100 text-purple-700";
      case "help":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (layout === "retro") {
    return (
      <div className="retro-page h-full overflow-auto">
        {/* Header */}
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">👥 Community Forum</span>
          <p className="text-xs py-1">
            พูดคุย ถามคำถาม และแชร์ผลงานกับ Play Stack Community!
          </p>
        </div>

        {/* Search & Filter */}
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">🔍 Search</span>
          <input
            type="text"
            placeholder="ค้นหา..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="retro-input w-full text-xs mt-1"
          />
          <div className="flex flex-wrap gap-1 mt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`retro-btn text-xs ${
                  filter === cat.id ? "bg-blue-900 text-white" : ""
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">📝 Posts ({filteredPosts.length})</span>
          <div className="space-y-2 mt-2">
            {filteredPosts.map((post) => (
              <div key={post.id} className="retro-card text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-lg">{post.authorAvatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {post.isPinned && <span>📌</span>}
                      <span className="font-bold">{post.title}</span>
                    </div>
                    <p className="text-gray-600 line-clamp-1 mt-1">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-gray-500">
                      <span>{post.authorName}</span>
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.replies}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
            👥 Community Forum
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            พูดคุย ถามคำถาม และแชร์ผลงานกับ Play Stack Community!
          </p>
        </div>

        {/* Search */}
        <div className="main-card mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="🔍 ค้นหาโพสต์..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="main-input flex-1"
            />
            <button className="main-btn main-btn-primary">
              ✏️ สร้างโพสต์
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === cat.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} getCategoryStyle={getCategoryStyle} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">🔍</div>
            <p>ไม่พบโพสต์ที่ตรงกับการค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PostCard({
  post,
  getCategoryStyle,
}: {
  post: ForumPost;
  getCategoryStyle: (cat: string) => string;
}) {
  return (
    <div className="main-card group cursor-pointer hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="text-3xl">{post.authorAvatar}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {post.isPinned && (
              <span className="text-red-500" title="Pinned">
                📌
              </span>
            )}
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${getCategoryStyle(post.category)}`}
            >
              {post.category}
            </span>
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
            {post.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {post.content}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span>{post.authorName}</span>
            <span>❤️ {post.likes}</span>
            <span>💬 {post.replies} replies</span>
            <span className="ml-auto">{post.createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
