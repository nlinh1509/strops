import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession();

    // 1. Kiểm tra session và email
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập" },
        { status: 401 },
      );
    }

    // 2. TÌM ID CỦA USER THÔNG QUA EMAIL
    const { data: userDb, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (userError || !userDb) {
      return NextResponse.json(
        { error: "Không tìm thấy tài khoản trong Database" },
        { status: 400 },
      );
    }

    const userId = userDb.id; // Đây chính là cái ID chuẩn của Supabase nè!

    // 3. Lấy data từ form
    const body = await request.json();
    const { name, target_score } = body;

    // 4. Update vào bảng profiles
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: userId,
        display_name: name,
        target_score: target_score,
      })
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    return NextResponse.json({ message: "Cập nhật thành công", data });
  } catch (error: any) {
    console.error("API Profile Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Lấy thông tin cơ bản từ bảng profiles
    const { data: userDb } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (!userDb) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userDb.id)
      .maybeSingle();

    // 2. Tự chế (Mock) dữ liệu nâng cao để nuôi giao diện
    // Sau này làm xong Exam Engine, bạn sẽ viết lệnh query từ bảng user_results/exam_attempts để thay thế cục này.
    const mockData = {
      // Data thật từ database
      display_name: profile?.display_name || session?.user?.name,
      target_score: profile?.target_score || 0,
      streak_count: profile?.streak_count || 5, // Lấy từ cột streak_count trong ảnh của bạn, mặc định cho 5 ngày nếu trống

      // Data mô phỏng để giao diện sống động
      stats: {
        highest_score: 720,
        study_hours: "14h 30m",
        full_tests_count: 4,
        rank: "#42",
      },
      parts_analysis: {
        p1: 90,
        p2: 85,
        p3: 80,
        p4: 75,
        p5: 70,
        p6: 60,
        p7: 45,
      },
      history: [
        {
          id: "attempt_1",
          title: "ETS 2024 - Test 1",
          subtitle: "Full Test • Hôm qua",
          score: "720",
          badge: "+50 điểm",
          isPractice: false,
        },
        {
          id: "attempt_2",
          title: "Part 1: Photographs",
          subtitle: "Practice • 2 ngày trước",
          score: "8/10",
          badge: "Hoàn thành",
          isPractice: true,
        },
      ],
    };

    return NextResponse.json(mockData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
