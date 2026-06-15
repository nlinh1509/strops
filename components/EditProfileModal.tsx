"use client";

import { useState, useEffect } from "react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentTarget: number;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentName,
  currentTarget,
}: EditProfileModalProps) {
  // State để quản lý dữ liệu trong form
  const [name, setName] = useState("");
  const [targetScore, setTargetScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Mỗi khi Modal mở ra, cập nhật lại giá trị hiện tại từ database vào form
  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setTargetScore(currentTarget);
    }
  }, [isOpen, currentName, currentTarget]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          target_score: Number(targetScore),
        }),
      });

      if (res.ok) {
        // Cập nhật thành công
        onClose();
        // Reload trang để các component khác cập nhật data mới từ DB
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert("Lỗi: " + errorData.error);
      }
    } catch (error) {
      console.error("Lỗi khi update profile:", error);
      alert("Đã có lỗi xảy ra khi kết nối server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Lớp nền mờ bên dưới */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Nội dung chính của Modal */}
      <div className="relative bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-800">
            Chỉnh sửa hồ sơ
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Cập nhật thông tin cá nhân và mục tiêu học tập của bạn.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nhập tên */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
              Tên hiển thị
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên của bạn..."
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-800"
              required
            />
          </div>

          {/* Nhập mục tiêu điểm */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
              Mục tiêu TOEIC (10 - 990)
            </label>
            <input
              type="number"
              min="10"
              max="990"
              step="5"
              value={targetScore}
              onChange={(e) => setTargetScore(Number(e.target.value))}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-black text-slate-800 text-lg"
              required
            />
          </div>

          {/* Nhóm nút bấm */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
