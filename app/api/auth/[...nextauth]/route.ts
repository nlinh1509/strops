import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // Hàm authorize sẽ chạy khi người dùng bấm nút Đăng Nhập
      async authorize(credentials) {
        // Kiểm tra xem người dùng có bỏ trống ô nào không
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Vui lòng nhập đầy đủ email và mật khẩu!");
        }

        // Lấy thông tin user từ Supabase dựa vào email
        const { data: user, error } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .maybeSingle();

        if (error) {
          throw new Error("Lỗi hệ thống khi kiểm tra tài khoản.");
        }

        // Nếu email không có trong DB, HOẶC có nhưng không có password (nghĩa là user này tạo bằng Google)
        if (!user || !user.password) {
          throw new Error(
            "Tài khoản không tồn tại hoặc bạn đang dùng Google để đăng nhập!",
          );
        }

        // Đọ sức mật khẩu: So sánh pass người dùng nhập với cái chuỗi băm trong DB
        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordMatch) {
          throw new Error("Mật khẩu không chính xác!");
        }

        // Nếu vượt qua hết ải trên -> Đăng nhập thành công! Trả về thông tin cho hệ thống
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar_url,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Lấy cả id luôn
          const { data: existingUser, error: selectError } = await supabaseAdmin
            .from("users")
            .select("id, email")
            .eq("email", user.email)
            .maybeSingle();

          if (selectError) return false;

          if (!existingUser) {
            console.log("🚀 [BẮT ĐẦU] Đang tạo user mới...");

            // 1. Tạo user trong bảng users
            const { data: newUser, error: insertError } = await supabaseAdmin
              .from("users")
              .insert([
                {
                  email: user.email,
                  name: user.name,
                  avatar_url: user.image,
                },
              ])
              .select("id")
              .single();

            if (insertError) {
              console.error("❌ [LỖI 1] Lỗi khi tạo bảng users:", insertError);
              return false;
            }

            console.log("✅ [THÀNH CÔNG 1] Đã tạo user, ID là:", newUser.id);
            console.log("🚀 [TIẾP TỤC] Bắt đầu tạo profile tương ứng...");

            // 2. Tạo profile trống tương ứng trong bảng profiles
            const { error: profileError } = await supabaseAdmin
              .from("profiles")
              .insert([
                {
                  id: newUser.id,
                  display_name: user.name,
                  avatar_url: user.image,
                },
              ]);

            if (profileError) {
              console.error(
                "❌ [LỖI 2] Lỗi khi tạo bảng profiles:",
                profileError,
              );
            } else {
              console.log("✅ [THÀNH CÔNG 2] Đã tạo profile xong xuôi!");
            }

            user.id = newUser.id;
          }
          return true;
        } catch (error) {
          return false;
        }
      }
      return true;
    },

    // THÊM CALLBACKS SESSION & JWT ĐỂ GIỮ LẠI USER.ID
    async jwt({ token, user }) {
      // Khi user vừa đăng nhập xong
      if (user) {
        // Tìm xem user này trong Supabase có ID là gì
        const { data } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("email", user.email) // Hoặc eq username/sdt sau này
          .single();

        if (data) {
          token.id = data.id; // Gắn chuẩn UUID của Supabase vào token
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        // Nhét id từ token sang session để lúc nào mình gọi useSession() cũng lấy được
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
