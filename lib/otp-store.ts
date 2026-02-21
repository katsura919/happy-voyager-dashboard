/**
 * Stateless signed token helpers for OTP and password reset.
 * Uses HMAC-SHA256 so nothing is stored in memory — survives server restarts.
 */
import crypto from "crypto";

// Falls back to service role key so no extra env var is required,
// but you can add RESET_TOKEN_SECRET to .env.local for extra isolation.
function getSecret(): string {
  return (
    process.env.RESET_TOKEN_SECRET ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "change-me-in-production"
  );
}

function sign(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(data)
    .digest("base64url");
  return `${data}.${sig}`;
}

function verify<T>(token: string): T | null {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(data)
    .digest("base64url");
  try {
    if (
      sig.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
    )
      return null;
  } catch {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(data, "base64url").toString()) as T;
  } catch {
    return null;
  }
}

const OTP_TTL_S = 10 * 60; // 10 minutes
const RESET_TTL_S = 15 * 60; // 15 minutes

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** Returns a signed token embedding the email + code. Send this to the client. */
export function createOtpToken(email: string, code: string): string {
  return sign({
    email: email.toLowerCase(),
    code,
    exp: Math.floor(Date.now() / 1000) + OTP_TTL_S,
  });
}

/** Verifies the signed otpToken AND that the user-supplied code matches. */
export function verifyOtpToken(otpToken: string, code: string): string | null {
  const payload = verify<{ email: string; code: string; exp: number }>(
    otpToken,
  );
  if (!payload) return null;
  if (Math.floor(Date.now() / 1000) > payload.exp) return null;
  if (payload.code !== code) return null;
  return payload.email;
}

/** Returns a signed reset token embedding the email. Pass in the URL. */
export function createResetToken(email: string): string {
  return sign({
    email: email.toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + RESET_TTL_S,
  });
}

/** Verifies the reset token and returns the email, or null if invalid/expired. */
export function verifyResetToken(resetToken: string): string | null {
  const payload = verify<{ email: string; exp: number }>(resetToken);
  if (!payload) return null;
  if (Math.floor(Date.now() / 1000) > payload.exp) return null;
  return payload.email;
}
