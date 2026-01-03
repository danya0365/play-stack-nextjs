"use client";

import html2canvas from "html2canvas";
import { useRef, useState } from "react";

interface CertificateData {
  studentName: string;
  courseName: string;
  completedDate: string;
  certificateId: string;
  instructorName?: string;
}

interface CertificateProps {
  data: CertificateData;
  onClose?: () => void;
}

export function Certificate({ data, onClose }: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    setIsDownloading(true);
    
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      });
      
      const link = document.createElement("a");
      link.download = `PlayStack-Certificate-${data.certificateId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Failed to download certificate:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-auto">
      <div className="max-w-4xl w-full">
        {/* Actions */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">🎓 Certificate</h2>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              {isDownloading ? "⏳ กำลังดาวน์โหลด..." : "📥 ดาวน์โหลด PNG"}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
              >
                ✕ ปิด
              </button>
            )}
          </div>
        </div>

        {/* Certificate */}
        <div
          ref={certificateRef}
          className="relative bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 rounded-2xl p-8 border-4 border-purple-500/50 shadow-2xl"
        >
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-purple-400 rounded-tl-xl" />
          <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-purple-400 rounded-tr-xl" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-purple-400 rounded-bl-xl" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-purple-400 rounded-br-xl" />

          {/* Content */}
          <div className="text-center py-8 px-4">
            {/* Logo */}
            <div className="text-5xl mb-4">🎮</div>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              PLAY STACK
            </div>
            <div className="text-gray-400 text-sm mb-8">Game Development Academy</div>

            {/* Certificate Title */}
            <div className="text-lg text-gray-300 mb-2">Certificate of Completion</div>
            <div className="text-3xl font-bold text-white mb-8">
              ใบประกาศนียบัตร
            </div>

            {/* Divider */}
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-8 rounded-full" />

            {/* Recipient */}
            <div className="text-gray-400 mb-2">This is to certify that</div>
            <div className="text-4xl font-bold text-white mb-4 font-serif">
              {data.studentName}
            </div>

            {/* Course */}
            <div className="text-gray-400 mb-2">has successfully completed</div>
            <div className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-8">
              {data.courseName}
            </div>

            {/* Details */}
            <div className="flex justify-center gap-16 mb-8">
              <div>
                <div className="text-gray-400 text-sm">วันที่สำเร็จ</div>
                <div className="text-white font-semibold">{data.completedDate}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Certificate ID</div>
                <div className="text-white font-mono text-sm">{data.certificateId}</div>
              </div>
            </div>

            {/* Signature */}
            <div className="flex justify-center gap-16">
              <div className="text-center">
                <div className="w-40 h-0.5 bg-gray-500 mb-2" />
                <div className="text-gray-400 text-sm">{data.instructorName || "Play Stack Team"}</div>
                <div className="text-gray-500 text-xs">Instructor</div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex justify-center gap-4 mt-8">
              <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm">
                🎯 Verified
              </div>
              <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm">
                ✅ Completed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate certificate ID
export function generateCertificateId(userId: string, courseId: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `PS-${courseId.toUpperCase()}-${timestamp}-${random}`.toUpperCase();
}

// Format date for certificate
export function formatCertificateDate(date: Date = new Date()): string {
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
