"use client";

import Link from "next/link";

export function MainFooter() {
  return (
    <footer className="main-footer">
      <div className="main-footer-container">
        <div className="main-footer-brand">
          <span className="main-footer-logo">🎮 Play Stack</span>
          <span className="main-footer-copyright">
            © 2024 Play Stack. All rights reserved.
          </span>
        </div>

        <nav className="main-footer-nav">
          <Link href="/about" className="main-footer-link">
            เกี่ยวกับ
          </Link>
          <Link href="/privacy" className="main-footer-link">
            นโยบายความเป็นส่วนตัว
          </Link>
          <Link href="/terms" className="main-footer-link">
            ข้อกำหนด
          </Link>
        </nav>
      </div>
    </footer>
  );
}
