import { NextRequest, NextResponse } from "next/server";
import { verifyResetToken } from "@/lib/otp-store";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { resetToken, newPassword } = await req.json();

    if (!resetToken || !newPassword) {
      return NextResponse.json(
        { error: "Reset token and new password are required" },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const email = verifyResetToken(resetToken);

    if (!email) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    const admin = createAdminClient();

    // listUsers returns up to 1000 users per page — sufficient for this app
    let userId: string | null = null;
    let page = 1;
    const perPage = 1000;

    while (true) {
      const { data, error: listError } = await admin.auth.admin.listUsers({
        page,
        perPage,
      });
      if (listError) throw listError;

      const match = data.users.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase(),
      );
      if (match) {
        userId = match.id;
        break;
      }
      if (data.users.length < perPage) break; // no more pages
      page++;
    }

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update password via admin
    const { error: updateError } = await admin.auth.admin.updateUserById(
      userId,
      { password: newPassword },
    );
    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("reset-password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 },
    );
  }
}
