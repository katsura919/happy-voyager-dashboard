import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import { generateOtp, createOtpToken } from "@/lib/otp-store";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const code = generateOtp();
    const otpToken = createOtpToken(email, code);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Your password reset code",
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: auto;">
          <h2>Password Reset</h2>
          <p>Use the code below to reset your password. It expires in <strong>10 minutes</strong>.</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 20px; background: #f4f4f4; border-radius: 8px;">
            ${code}
          </div>
          <p style="color: #888; font-size: 12px; margin-top: 16px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, otpToken });
  } catch (error) {
    console.error("send-otp error:", error);
    return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
  }
}
