import { redirect } from "next/navigation";
import Hero from "../../components/Hero";
import { supabase } from "../../lib/supabase";

// 🔥 THÊM DÒNG NÀY ĐỂ TẮT CACHE, LUÔN LẤY DATA MỚI NHẤT TỪ SUPABASE
export const revalidate = 0;

export default async function Home() {
  redirect("exams/listening");

  // Bốc thử dữ liệu từ mây về
  const { data: exams, error } = await supabase
    .from("exams")
    .select("*")
    .order("id", { ascending: true }); // Tui thêm sắp xếp theo ID cho đẹp

  return (
    <main>
      {/* test supabase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 space-y-6">
        {/* HIỂN THỊ LỖI NẾU CÓ */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500">
                error
              </span>
              <p className="text-red-700 font-bold">
                Lỗi kết nối: {error?.message}{" "}
              </p>
            </div>
          </div>
        )}

        {/* BẢNG THỐNG KÊ CHI TIẾT KHO DỮ LIỆU */}
        {!error && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-500">
                  database
                </span>
                KIỂM TRA DỮ LIỆU HỆ THỐNG
              </h2>
              <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full animate-pulse">
                LIVE DATA
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {exams?.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-400 transition-all shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Cột 1: Thông tin đề */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">
                          ID: {exam.id}
                        </span>
                        <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">
                          Năm: {exam.exam_year}
                        </span>
                      </div>
                      <h3 className="font-black text-slate-900 text-lg">
                        {exam.title}
                      </h3>
                      <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                        {exam.category}
                      </p>
                    </div>

                    {/* Cột 2: Trạng thái các Part */}
                    <div className="flex flex-wrap gap-3">
                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl min-w-[120px]">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Cấu trúc đề
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${exam.id ? "bg-emerald-500" : "bg-slate-300"}`}
                          ></span>
                          <span className="text-sm font-bold text-slate-700">
                            Part 5 (30 câu)
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl min-w-[120px]">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Người tham gia
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm text-slate-400">
                            group
                          </span>
                          <span className="text-sm font-bold text-slate-700">
                            {exam.participants_count || 0} lượt
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl min-w-[120px]">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Ngày tạo
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm text-slate-400">
                            calendar_today
                          </span>
                          <span className="text-sm font-bold text-slate-700">
                            {new Date(exam.created_at).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Cột 3: Hành động */}
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all">
                        <span className="material-symbols-outlined">
                          visibility
                        </span>
                      </button>
                      <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden md:block"></div>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
                        SẴN SÀNG
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {exams?.length === 0 && (
                <div className="py-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium italic">
                    Chưa có dữ liệu nào được tìm thấy. Sếp hãy chạy lệnh SQL
                    Seed nhé!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Hero />
      </section>
    </main>
  );
}
