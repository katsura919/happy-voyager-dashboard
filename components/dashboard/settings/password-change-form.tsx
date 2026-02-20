"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Lock, Eye, EyeOff, Loader2, Check, AlertCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type SaveStatus = "idle" | "saving" | "success";

export function PasswordChangeForm() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

    const passwordStrength = getPasswordStrength(newPassword);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        setSaveStatus("saving");

        try {
            const supabase = createClient();

            // Re-authenticate with current password first
            const { data: userData } = await supabase.auth.getUser();
            const email = userData.user?.email;

            if (email && currentPassword) {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password: currentPassword,
                });
                if (signInError) throw new Error("Current password is incorrect.");
            }

            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;

            setSaveStatus("success");
            toast.success("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => setSaveStatus("idle"), 4000);
        } catch (err: unknown) {
            setSaveStatus("idle");
            toast.error(err instanceof Error ? err.message : "Something went wrong.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
            {/* Security banner */}
            <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/10 rounded-[16px]">
                <ShieldCheck size={18} className="text-primary mt-0.5 shrink-0" />
                <div>
                    <p className="text-sm font-medium text-foreground">Keep your account secure</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Use at least 8 characters with a mix of letters, numbers, and symbols.
                    </p>
                </div>
            </div>

            {/* Current Password */}
            <PasswordField
                label="Current Password"
                value={currentPassword}
                show={showCurrent}
                onToggle={() => setShowCurrent((v) => !v)}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Required unless this is your first time"
            />

            {/* Divider */}
            <div className="border-t border-white/5" />

            {/* New Password */}
            <PasswordField
                label="New Password"
                value={newPassword}
                show={showNew}
                onToggle={() => setShowNew((v) => !v)}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create a strong password"
                required
            />

            {/* Strength Meter */}
            {newPassword.length > 0 && (
                <div className="space-y-2 -mt-2">
                    <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map((level) => (
                            <div
                                key={level}
                                className={cn(
                                    "h-1.5 flex-1 rounded-full transition-all duration-300",
                                    level <= passwordStrength.score
                                        ? passwordStrength.color
                                        : "bg-white/10"
                                )}
                            />
                        ))}
                    </div>
                    <p className={cn("text-xs font-medium", passwordStrength.textColor)}>
                        {passwordStrength.label}
                    </p>
                </div>
            )}

            {/* Confirm Password */}
            <PasswordField
                label="Confirm New Password"
                value={confirmPassword}
                show={showConfirm}
                onToggle={() => setShowConfirm((v) => !v)}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                required
            />

            {/* Match indicator */}
            {confirmPassword.length > 0 && (
                <p className={cn(
                    "text-xs flex items-center gap-1.5 -mt-2",
                    newPassword === confirmPassword ? "text-green-400" : "text-red-400"
                )}>
                    {newPassword === confirmPassword
                        ? <><Check size={12} /> Passwords match</>
                        : <><AlertCircle size={12} /> Passwords do not match</>
                    }
                </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end pt-2">
                <button
                    type="submit"
                    disabled={saveStatus === "saving"}
                    className={cn(
                        "inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all",
                        saveStatus === "saving"
                            ? "bg-primary/50 text-primary-foreground cursor-not-allowed"
                            : saveStatus === "success"
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-primary text-primary-foreground hover:opacity-90"
                    )}
                >
                    {saveStatus === "saving" && <Loader2 size={14} className="animate-spin" />}
                    {saveStatus === "success" && <Check size={14} />}
                    {saveStatus === "saving" ? "Updating..." : saveStatus === "success" ? "Updated!" : "Update Password"}
                </button>
            </div>
        </form>
    );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function PasswordField({
    label,
    value,
    show,
    onToggle,
    onChange,
    placeholder,
    required,
}: {
    label: string;
    value: string;
    show: boolean;
    onToggle: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
}) {
    return (
        <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Lock size={12} />
                {label}
            </label>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="w-full px-4 py-3 pr-12 bg-background/50 border border-white/10 rounded-[14px] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        </div>
    );
}

function getPasswordStrength(password: string) {
    const score =
        (password.length >= 8 ? 1 : 0) +
        (/[A-Z]/.test(password) ? 1 : 0) +
        (/[0-9]/.test(password) ? 1 : 0) +
        (/[^A-Za-z0-9]/.test(password) ? 1 : 0);

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500", textColor: "text-red-400" };
    if (score === 2) return { score: 2, label: "Fair", color: "bg-orange-400", textColor: "text-orange-400" };
    if (score === 3) return { score: 3, label: "Good", color: "bg-yellow-400", textColor: "text-yellow-400" };
    return { score: 4, label: "Strong", color: "bg-green-400", textColor: "text-green-400" };
}


