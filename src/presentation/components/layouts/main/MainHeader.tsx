"use client";

import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import { useTheme } from "next-themes";
import Link from "next/link";

export function MainHeader() {
  const { theme, setTheme } = useTheme();
  const { toggleLayout } = useLayoutStore();

  const navLinks = [
    { href: "/", label: "หน้าแรก", icon: "🏠" },
    { href: "/courses", label: "คอร์สเรียน", icon: "📚" },
    { href: "/playground", label: "Playground", icon: "🎮" },
    { href: "/projects", label: "ผลงาน", icon: "🏆" },
  ];

  return (
    <header className="main-header">
      <div className="main-header-container">
        {/* Logo */}
        <Link href="/" className="main-logo">
          <span className="main-logo-icon">🎮</span>
          <span className="main-logo-text">Play Stack</span>
        </Link>

        {/* Navigation */}
        <nav className="main-nav">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="main-nav-link">
              <span className="main-nav-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="main-header-actions">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="main-icon-button"
            title={theme === "dark" ? "เปลี่ยนเป็น Light Mode" : "เปลี่ยนเป็น Dark Mode"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Layout Toggle */}
          <button
            onClick={toggleLayout}
            className="main-icon-button"
            title="เปลี่ยนเป็น Retro Layout"
          >
            💾
          </button>

          {/* Login Button */}
          <button className="main-button-primary">เข้าสู่ระบบ</button>
        </div>
      </div>
    </header>
  );
}
