"use client";

import {
    StudentProject,
    getFeaturedProjects,
    studentProjects,
} from "@/src/data/master/studentProjects";
import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import { useState } from "react";

export function ProjectsView() {
  const { layout } = useLayoutStore();
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"likes" | "plays" | "recent">("recent");

  const categories = [
    { id: "all", name: "ทั้งหมด", icon: "📁" },
    { id: "2d", name: "2D Games", icon: "🎮" },
    { id: "3d", name: "3D Games", icon: "🎲" },
    { id: "multiplayer", name: "Multiplayer", icon: "🌐" },
    { id: "casual", name: "Casual", icon: "🎯" },
  ];

  const filtered =
    filter === "all"
      ? studentProjects
      : studentProjects.filter((p) => p.category === filter);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "likes") return b.likes - a.likes;
    if (sortBy === "plays") return b.plays - a.plays;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const featured = getFeaturedProjects();

  if (layout === "retro") {
    return (
      <div className="retro-page h-full overflow-auto">
        {/* Header */}
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">🏆 Student Projects</span>
          <p className="text-xs py-1">
            ผลงานจากนักเรียน Play Stack - แรงบันดาลใจสำหรับโปรเจกต์ของคุณ!
          </p>
        </div>

        {/* Filters */}
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">🔍 Filter</span>
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

        {/* Projects Table */}
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">📁 Projects</span>
          <table className="w-full text-xs mt-2">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="text-left py-1 px-2">Project</th>
                <th className="text-left py-1 px-2">Author</th>
                <th className="text-left py-1 px-2">Engine</th>
                <th className="text-center py-1 px-2">Phase</th>
                <th className="text-center py-1 px-2">❤️</th>
                <th className="text-center py-1 px-2">▶️</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-gray-300 hover:bg-blue-900 hover:text-white"
                >
                  <td className="py-1 px-2">
                    <span className="mr-1">{project.thumbnail}</span>
                    {project.titleTh}
                    {project.featured && (
                      <span className="ml-1 text-yellow-600">⭐</span>
                    )}
                  </td>
                  <td className="py-1 px-2">
                    {project.authorAvatar} {project.author}
                  </td>
                  <td className="py-1 px-2">{project.engine}</td>
                  <td className="text-center py-1 px-2">
                    {project.phaseCompleted}
                  </td>
                  <td className="text-center py-1 px-2">{project.likes}</td>
                  <td className="text-center py-1 px-2">{project.plays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Main Layout
  return (
    <div className="h-full overflow-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🏆 Student Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            ผลงานจากนักเรียน Play Stack - แรงบันดาลใจสำหรับโปรเจกต์ของคุณ!
          </p>
        </div>

        {/* Featured */}
        {filter === "all" && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              ⭐ Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featured.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  filter === cat.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "likes" | "plays" | "recent")}
              className="main-select py-1 text-sm"
            >
              <option value="recent">ล่าสุด</option>
              <option value="likes">❤️ Likes</option>
              <option value="plays">▶️ Plays</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: StudentProject }) {
  return (
    <div className="main-card group cursor-pointer">
      {/* Thumbnail */}
      <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center text-6xl">
        {project.thumbnail}
      </div>

      {/* Content */}
      <div className="flex items-start gap-3">
        <span className="text-3xl">{project.authorAvatar}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
            {project.titleTh}
            {project.featured && (
              <span className="ml-2 text-yellow-500">⭐</span>
            )}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            by {project.author}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
        {project.descriptionTh}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mt-3">
        {project.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>❤️ {project.likes}</span>
          <span>▶️ {project.plays}</span>
        </div>
        <span className="text-xs text-gray-400">{project.engine}</span>
      </div>
    </div>
  );
}
