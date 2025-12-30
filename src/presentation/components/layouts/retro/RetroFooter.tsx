"use client";

export function RetroFooter() {
  return (
    <footer className="retro-footer">
      <div className="retro-statusbar">
        <div className="retro-statusbar-section retro-statusbar-main">
          <span className="retro-statusbar-icon">✅</span>
          <span>Done</span>
        </div>
        <div className="retro-statusbar-section retro-statusbar-zone">
          <span className="retro-statusbar-icon">🌐</span>
          <span>Internet</span>
        </div>
      </div>
    </footer>
  );
}
