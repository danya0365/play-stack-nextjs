"use client";

import { MainModal } from "@/src/presentation/components/ui/main/MainModal";
import { RetroModal } from "@/src/presentation/components/ui/retro/RetroModal";
import { useAuthStore } from "@/src/presentation/stores/authStore";
import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import { useState } from "react";

export function LoginModal() {
  const { showLoginModal, closeLoginModal, login } = useAuthStore();
  const { layout } = useLayoutStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-100 dark:bg-red-900/30 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label
          className={
            layout === "retro"
              ? "retro-input-label"
              : "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          }
        >
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={layout === "retro" ? "retro-input" : "main-input"}
          placeholder="your@email.com"
          required
        />
      </div>

      <div>
        <label
          className={
            layout === "retro"
              ? "retro-input-label"
              : "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          }
        >
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={layout === "retro" ? "retro-input" : "main-input"}
          placeholder="••••••••"
          required
        />
      </div>

      <div className="pt-2">
        {layout === "retro" ? (
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="retro-btn retro-btn-primary flex-1"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
            <button
              type="button"
              onClick={closeLoginModal}
              className="retro-btn"
            >
              ยกเลิก
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="w-full main-btn main-btn-primary"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        )}
      </div>

      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
        ใช้ Demo: ใส่ email และ password อะไรก็ได้
      </p>
    </form>
  );

  if (layout === "retro") {
    return (
      <RetroModal
        isOpen={showLoginModal}
        onClose={closeLoginModal}
        title="🔐 Login"
      >
        {formContent}
      </RetroModal>
    );
  }

  return (
    <MainModal
      isOpen={showLoginModal}
      onClose={closeLoginModal}
      title="🔐 เข้าสู่ระบบ"
    >
      {formContent}
    </MainModal>
  );
}
