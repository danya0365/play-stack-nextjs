"use client";

import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function RetroHeader() {
  const { theme, setTheme } = useTheme();
  const { toggleLayout } = useLayoutStore();
  const pathname = usePathname();

  const menuItems = [
    { label: "File", underline: "F" },
    { label: "Edit", underline: "E" },
    { label: "View", underline: "V" },
    { label: "Favorites", underline: "A" },
    { label: "Tools", underline: "T" },
    { label: "Help", underline: "H" },
  ];

  const toolbarButtons = [
    { icon: "⬅️", label: "Back", disabled: false },
    { icon: "➡️", label: "Forward", disabled: true },
    { icon: "🔄", label: "Refresh", disabled: false },
    { icon: "🏠", label: "Home", disabled: false, href: "/" },
  ];

  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "Play Stack - Game Development Courses";
      case "/courses":
        return "คอร์สเรียน - Play Stack";
      case "/playground":
        return "Playground - Play Stack";
      case "/projects":
        return "ผลงาน - Play Stack";
      default:
        return "Play Stack - Game Development Courses";
    }
  };

  return (
    <header className="retro-header">
      {/* Title Bar */}
      <div className="retro-titlebar">
        <div className="retro-titlebar-left">
          <span className="retro-titlebar-icon">🌐</span>
          <span className="retro-titlebar-text">
            {getPageTitle()} - Microsoft Internet Explorer
          </span>
        </div>
        <div className="retro-titlebar-controls">
          <button className="retro-titlebar-btn">_</button>
          <button className="retro-titlebar-btn">□</button>
          <button className="retro-titlebar-btn retro-close">✕</button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="retro-menubar">
        {menuItems.map((item) => (
          <button key={item.label} className="retro-menu-item">
            {item.label.split(item.underline).map((part, i) => (
              <span key={i}>
                {part}
                {i === 0 && (
                  <span className="retro-menu-underline">{item.underline}</span>
                )}
              </span>
            ))}
          </button>
        ))}

        {/* Theme Toggle in Menu */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="retro-menu-item ml-auto"
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>

        {/* Layout Toggle */}
        <button onClick={toggleLayout} className="retro-menu-item">
          🎨 Modern
        </button>
      </div>

      {/* Toolbar */}
      <div className="retro-toolbar">
        {toolbarButtons.map((btn, index) => (
          <div key={index}>
            {btn.href ? (
              <Link href={btn.href} className="retro-toolbar-btn">
                <span className="retro-toolbar-icon">{btn.icon}</span>
                <span className="retro-toolbar-label">{btn.label}</span>
              </Link>
            ) : (
              <button
                className="retro-toolbar-btn"
                disabled={btn.disabled}
              >
                <span className="retro-toolbar-icon">{btn.icon}</span>
                <span className="retro-toolbar-label">{btn.label}</span>
              </button>
            )}
          </div>
        ))}
        <div className="retro-toolbar-separator" />
        <Link href="/courses" className="retro-toolbar-btn">
          <span className="retro-toolbar-icon">📚</span>
          <span className="retro-toolbar-label">Courses</span>
        </Link>
        <Link href="/playground" className="retro-toolbar-btn">
          <span className="retro-toolbar-icon">🎮</span>
          <span className="retro-toolbar-label">Play</span>
        </Link>
        <Link href="/projects" className="retro-toolbar-btn">
          <span className="retro-toolbar-icon">🏆</span>
          <span className="retro-toolbar-label">Projects</span>
        </Link>
      </div>

      {/* Address Bar */}
      <div className="retro-addressbar">
        <span className="retro-addressbar-label">Address</span>
        <div className="retro-addressbar-input-wrapper">
          <span className="retro-addressbar-icon">📄</span>
          <input
            type="text"
            className="retro-addressbar-input"
            value={`http://playstack.local${pathname}`}
            readOnly
          />
        </div>
        <button className="retro-addressbar-go">Go</button>
      </div>
    </header>
  );
}
