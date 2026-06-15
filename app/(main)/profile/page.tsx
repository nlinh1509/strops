"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import EditProfileModal from "@/components/EditProfileModal";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State để lưu data profile lấy từ database
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Fetch data từ API GET mình vừa tạo
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setProfileData(data);
          setIsLoadingProfile(false);
        })
        .catch(() => setIsLoadingProfile(false));
    }
  }, [status]);

  // Loading tổng thể
  if (
    status === "loading" ||
    (status === "authenticated" && isLoadingProfile)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* 1. HERO SECTION (Banner trên cùng) */}
      <div className="relative h-48 md:h-64 lg:h-80 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 lg:-mt-32 relative z-10">
        {/* 2. KHỐI AVATAR CHÍNH & MỤC TIÊU */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 shadow-2xl shadow-emerald-900/5 ring-1 ring-white flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 lg:gap-6 text-center md:text-left w-full">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-teal-300 rounded-full blur-lg opacity-50"></div>
              <div className="relative w-[100px] h-[100px] lg:w-[140px] lg:h-[140px] rounded-full ring-4 lg:ring-8 ring-white z-10 shadow-xl overflow-hidden bg-white">
                <Image
                  src={session?.user?.image || "/logo.png"}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-1 right-1 lg:bottom-2 lg:right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] lg:text-[10px] font-black px-2 py-0.5 lg:px-3 lg:py-1 rounded-full border-2 border-white z-20 shadow-sm">
                PRO
              </div>
            </div>

            <div className="mt-2 md:mt-0 flex-1 w-full">
              <h1 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {profileData?.display_name ||
                  session?.user?.name ||
                  "Nguyễn Văn A"}
              </h1>
              <p className="text-slate-500 text-sm lg:text-base font-medium mt-0.5 lg:mt-1 mb-3">
                {session?.user?.email || "nguyenvana@gmail.com"}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                <span className="px-3 py-1 lg:px-4 lg:py-1.5 bg-slate-100 text-slate-600 text-xs lg:text-sm font-bold rounded-full">
                  Học viên năng nổ
                </span>
                <div className="px-3 py-1 lg:px-4 lg:py-1.5 bg-orange-100 text-orange-600 text-xs lg:text-sm font-bold rounded-full flex items-center gap-2">
                  <span>🔥 Streak: 12 ngày</span>
                  <div className="flex items-center gap-0.5 ml-1 hidden lg:flex">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                  </div>
                </div>
              </div>

              {/* Thanh Progress Bar Mục Tiêu */}
              <div className="w-full max-w-md bg-slate-50 p-3 rounded-xl border border-slate-100 mt-4">
                <div className="flex justify-between text-xs lg:text-sm font-bold mb-1.5">
                  <span className="text-slate-600">
                    Mục tiêu: {profileData?.target_score || 0}
                  </span>
                  <span className="text-emerald-600">Hiện tại: 0</span>
                </div>
                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full relative"
                    style={{ width: "0%" }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 lg:px-8 lg:py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm lg:text-base font-bold rounded-xl lg:rounded-2xl transition-all shadow-xl shadow-slate-200 shrink-0 w-full md:w-auto mt-4 md:mt-0 cursor-pointer"
          >
            Chỉnh sửa hồ sơ
          </button>
        </div>

        {/* 3. THỐNG KÊ NHANH */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mt-6 lg:mt-8">
          {/* Ô 1 */}
          <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 hover:shadow-md">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-100 text-emerald-600 rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 lg:mb-4 shrink-0">
              <svg
                width="24"
                height="24"
                className="w-5 h-5 lg:w-6 lg:h-6 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <p className="text-slate-500 font-medium text-xs lg:text-sm line-clamp-1">
              Điểm cao nhất
            </p>
            <p className="text-2xl lg:text-3xl font-black text-slate-800 mt-1">
              0
            </p>
          </div>
          {/* Ô 2 */}
          <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 hover:shadow-md">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-sky-100 text-sky-600 rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 lg:mb-4 shrink-0">
              <svg
                width="24"
                height="24"
                className="w-5 h-5 lg:w-6 lg:h-6 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <p className="text-slate-500 font-medium text-xs lg:text-sm line-clamp-1">
              Giờ học tuần này
            </p>
            <p className="text-2xl lg:text-3xl font-black text-slate-800 mt-1">
              0h<span className="text-sm lg:text-lg text-slate-400"> 0m</span>
            </p>
          </div>
          {/* Ô 3 */}
          <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 hover:shadow-md">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 text-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 lg:mb-4 shrink-0">
              <svg
                width="24"
                height="24"
                className="w-5 h-5 lg:w-6 lg:h-6 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                ></path>
              </svg>
            </div>
            <p className="text-slate-500 font-medium text-xs lg:text-sm line-clamp-1">
              Đề Full Test đã làm
            </p>
            <p className="text-2xl lg:text-3xl font-black text-slate-800 mt-1">
              0
            </p>
          </div>
          {/* Ô 4 */}
          <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 hover:shadow-md">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-rose-100 text-rose-600 rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 lg:mb-4 shrink-0">
              <svg
                width="24"
                height="24"
                className="w-5 h-5 lg:w-6 lg:h-6 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <p className="text-slate-500 font-medium text-xs lg:text-sm line-clamp-1">
              Xếp hạng (Tháng)
            </p>
            <p className="text-2xl lg:text-3xl font-black text-slate-800 mt-1">
              --
            </p>
          </div>
        </div>

        {/* 4. BIỂU ĐỒ NĂNG LỰC 7 PARTS & HOẠT ĐỘNG GẦN ĐÂY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-6">
          {/* Thẻ Phân Tích Năng Lực (Đã cập nhật chia 7 Parts TOEIC) */}
          <div className="bg-white rounded-3xl lg:rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-end mb-5 lg:mb-6">
              <h3 className="text-lg lg:text-xl font-black text-slate-800">
                Phân tích 7 Parts
              </h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                Chưa có dữ liệu
              </span>
            </div>

            <div className="space-y-4">
              {/* Listening Group */}
              <div>
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Listening
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-[11px] lg:text-xs font-bold mb-1">
                      <span className="text-slate-700">P1: Photos</span>
                      <span className="text-slate-400">0%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full">
                      <div
                        className="h-full bg-slate-200 rounded-full"
                        style={{ width: "0%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] lg:text-xs font-bold mb-1">
                      <span className="text-slate-700">P2: Q-Resp</span>
                      <span className="text-slate-400">0%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full">
                      <div
                        className="h-full bg-slate-200 rounded-full"
                        style={{ width: "0%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] lg:text-xs font-bold mb-1">
                      <span className="text-slate-700">P3: Conv</span>
                      <span className="text-slate-400">0%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full">
                      <div
                        className="h-full bg-slate-200 rounded-full"
                        style={{ width: "0%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] lg:text-xs font-bold mb-1">
                      <span className="text-slate-700">P4: Talks</span>
                      <span className="text-slate-400">0%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full">
                      <div
                        className="h-full bg-slate-200 rounded-full"
                        style={{ width: "0%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Reading Group */}
              <div>
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Reading
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-[11px] lg:text-xs font-bold mb-1">
                      <span className="text-slate-700">P5: Incomp. Sent.</span>
                      <span className="text-slate-400">0%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full">
                      <div
                        className="h-full bg-slate-200 rounded-full"
                        style={{ width: "0%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] lg:text-xs font-bold mb-1">
                      <span className="text-slate-700">P6: Text Comp.</span>
                      <span className="text-slate-400">0%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full">
                      <div
                        className="h-full bg-slate-200 rounded-full"
                        style={{ width: "0%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex justify-between text-[11px] lg:text-xs font-bold mb-1">
                      <span className="text-slate-700">P7: Reading Comp.</span>
                      <span className="text-slate-400">0%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full">
                      <div
                        className="h-full bg-slate-200 rounded-full"
                        style={{ width: "0%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights cập nhật sát sườn bài thi hơn */}
            <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <p className="text-xs lg:text-sm font-bold text-indigo-800 flex items-start gap-2">
                <span className="shrink-0 text-lg">🤖</span>
                <span>
                  AI phân tích: Bạn chưa có dữ liệu làm bài. Hãy hoàn thành ít
                  nhất một Mini Test để xem phân tích nhé!
                </span>
              </p>
            </div>
          </div>

          {/* Thẻ Hoạt Động Gần Đây */}
          <div className="bg-white rounded-3xl lg:rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-5 lg:mb-6">
              <h3 className="text-lg lg:text-xl font-black text-slate-800">
                Lịch sử làm bài
              </h3>
              <Link
                href="/exams/history"
                className="text-xs lg:text-sm font-bold text-slate-500 hover:text-emerald-600 px-3 py-1.5 lg:px-4 lg:py-2 bg-slate-50 rounded-lg lg:rounded-xl transition-colors"
              >
                Xem tất cả
              </Link>
            </div>

            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <p className="text-slate-500 font-medium">
                Chưa có lịch sử làm bài
              </p>
              <Link
                href="/exams"
                className="text-emerald-600 font-bold text-sm mt-2 hover:underline"
              >
                Bắt đầu luyện tập ngay
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* TRUYỀN DATA VÀO MODAL EDIT */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentName={profileData?.display_name || session?.user?.name}
        currentTarget={profileData?.target_score || 0}
      />
    </div>
  );
}
