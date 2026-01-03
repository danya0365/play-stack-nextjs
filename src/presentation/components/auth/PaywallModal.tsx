"use client";

import { useAuthStore } from "@/src/presentation/stores/authStore";
import Link from "next/link";

export function PaywallModal() {
  const { showPaywallModal, closePaywallModal, upgradeToPro, isLoggedIn } = useAuthStore();

  if (!showPaywallModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={closePaywallModal}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={closePaywallModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            เนื้อหา Premium
          </h2>
          <p className="text-gray-400 mb-6">
            อัพเกรดเป็น Pro เพื่อเข้าถึงบทเรียนทั้งหมด 53 บท
          </p>

          {/* Benefits */}
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6 text-left">
            <ul className="space-y-2">
              {[
                "✅ เข้าถึงทุก Phase (53 บทเรียน)",
                "✅ Certificate เมื่อเรียนจบ",
                "✅ Priority Support",
                "✅ Updates ตลอดชีพ",
              ].map((item, i) => (
                <li key={i} className="text-gray-300 text-sm">{item}</li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl text-gray-400 line-through">฿1,999</span>
              <span className="text-4xl font-bold text-white">฿999</span>
            </div>
            <div className="text-green-400 text-sm">ประหยัด 50% - จ่ายครั้งเดียว</div>
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/checkout/pro"
                  className="block w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all"
                  onClick={closePaywallModal}
                >
                  🚀 อัพเกรดเป็น Pro
                </Link>
                {/* Demo: instant upgrade */}
                <button
                  onClick={upgradeToPro}
                  className="block w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all text-sm"
                >
                  ⚡ Demo: อัพเกรดทันที (ฟรี)
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all"
                  onClick={closePaywallModal}
                >
                  เข้าสู่ระบบเพื่อซื้อ
                </Link>
                <button
                  onClick={closePaywallModal}
                  className="block w-full py-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  ยังไม่พร้อม
                </button>
              </>
            )}
          </div>

          {/* Guarantee */}
          <p className="text-gray-500 text-xs mt-4">
            🛡️ รับประกันคืนเงิน 30 วัน
          </p>
        </div>
      </div>
    </div>
  );
}
