import Part1Layout from "@/components/layouts/Part1Layout";
import Part2Layout from "@/components/layouts/Part2Layout";
import Part3Layout from "@/components/layouts/Part3Layout";
import Part4Layout from "@/components/layouts/Part4Layout";
import { supabase } from "@/lib/supabase";

import { mockPart3 } from "@/data/mockData"; // Đã xóa mockPart2 đi

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU TỪ SUPABASE CHO LISTENING ---
// (Lưu ý: Giữ nguyên như cũ, vì từ DB có thể ra null)
interface DBQuestion {
  id: number;
  question_number: number;
  content: string;
  image_url: string | null; 
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string | null; 
}

interface DBQuestionGroup {
  id: number;
  passage_text: string;
  audio_url: string | null; 
  questions: DBQuestion[];
}

export default async function ListeningTestPage({
  params,
  searchParams,
}: {
  params: Promise<{ partId: string; testId: string }>;
  searchParams: Promise<{ year?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const partId = resolvedParams.partId;
  const testIdRaw = resolvedParams.testId;

  // Lấy ra số 1, 2, 3 từ chữ "test-1"
  const testNum = parseInt(testIdRaw.replace(/\D/g, ""), 10);
  const examYear = parseInt(resolvedSearchParams.year || "2026", 10);

  // TÌM ID THẬT CỦA ĐỀ THI
  const { data: currentExam, error: examError } = await supabase
    .from("exams")
    .select("id")
    .eq("exam_year", examYear)
    .ilike("title", `%Test ${testNum}%`)
    .single();

  if (examError || !currentExam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
          search_off
        </span>
        <h2 className="text-2xl font-bold text-slate-700">
          Không tìm thấy đề thi!
        </h2>
      </div>
    );
  }

  const realExamId = currentExam.id;

  // ====================================================================
  // XỬ LÝ PART 1
  // ====================================================================
  if (partId === "part-1") {
    const { data: groups, error } = await supabase
      .from("question_groups")
      .select(
        `
        id,
        passage_text,
        audio_url,
        questions (
          id, question_number, content, image_url, option_a, option_b, option_c, option_d, correct_answer, explanation
        )
      `,
      )
      .eq("exam_id", realExamId)
      .eq("part", 1)
      .order("id", { ascending: true });

    if (error || !groups || groups.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
            headset_off
          </span>
          <h2 className="text-2xl font-bold text-slate-700">
            Chưa có dữ liệu Part 1
          </h2>
        </div>
      );
    }

    const typedGroups = groups as unknown as DBQuestionGroup[];

    // 🔥 LÀM SẠCH VÀ CHUẨN HÓA DATA TRƯỚC KHI ĐƯA VÀO LAYOUT
    const cleanPart1Data = typedGroups.map((group) => ({
      id: group.id,
      passage_text: group.passage_text || "",
      audio_url: group.audio_url || "", 
      questions: group.questions
        .sort((a, b) => a.question_number - b.question_number)
        .map((q) => ({
          id: q.id,
          question_number: q.question_number,
          content: q.content || "",
          image_url: q.image_url || "", 
          option_a: q.option_a || "",
          option_b: q.option_b || "",
          option_c: q.option_c || "",
          option_d: q.option_d || "",
          correct_answer: q.correct_answer || "",
          explanation: q.explanation || "Chưa có giải thích.",
        })),
    }));

    return <Part1Layout data={cleanPart1Data} />;
  }

  // ====================================================================
  // XỬ LÝ PART 2
  // ====================================================================
  if (partId === "part-2") {
    const { data: groups, error } = await supabase
      .from("question_groups")
      .select(
        `
        id,
        passage_text,
        audio_url,
        questions (
          id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation
        )
      `,
      )
      .eq("exam_id", realExamId)
      .eq("part", 2)
      .order("id", { ascending: true });

    if (error || !groups || groups.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
            headset_off
          </span>
          <h2 className="text-2xl font-bold text-slate-700">
            Chưa có dữ liệu Part 2
          </h2>
        </div>
      );
    }

    const typedGroups = groups as unknown as DBQuestionGroup[];

    // 🔥 LÀM SẠCH DATA PART 2 (Không cần map image_url vì Part 2 không có ảnh)
    const cleanPart2Data = typedGroups.map((group) => ({
      id: group.id,
      passage_text: group.passage_text || "",
      audio_url: group.audio_url || "",
      questions: group.questions
        .sort((a, b) => a.question_number - b.question_number)
        .map((q) => ({
          id: q.id,
          question_number: q.question_number,
          content: q.content || "",
          option_a: q.option_a || "",
          option_b: q.option_b || "",
          option_c: q.option_c || "",
          option_d: q.option_d || "",
          correct_answer: q.correct_answer || "",
          explanation: q.explanation || "Chưa có giải thích.",
        })),
    }));

    return <Part2Layout data={cleanPart2Data} />;
  }

  // ====================================================================
  // XỬ LÝ PART 3, 4 (Tạm thời giữ placeholder)
  // ====================================================================
  if (partId === "part-3") {
    return <Part3Layout data={mockPart3} />;
  }

  if (partId === "part-4") {
    return <Part4Layout data={mockPart3} />;
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] font-sans">
      <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
        headphones
      </span>
      <h2 className="text-2xl font-bold text-slate-700">Đang xây dựng...</h2>
    </div>
  );
}