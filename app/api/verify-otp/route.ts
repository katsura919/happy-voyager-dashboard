import { NextRequest, NextResponse } from "next/server";
import { verifyOtpToken, createResetToken } from "@/lib/otp-store";

export async function POST(req: NextRequest) {
  try {
    const { otpToken, code } = await req.json();

    if (!otpToken || !code) {
      return NextResponse.json(
        { error: "Token and code are required" },
        { status: 400 },
      );
    }

    const email = verifyOtpToken(otpToken, code);

    if (!email) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 400 },
      );
    }

    // Issue a signed stateless reset token
    const resetToken = createResetToken(email);

    return NextResponse.json({ success: true, resetToken });
  } catch (error) {
    console.error("verify-otp error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
