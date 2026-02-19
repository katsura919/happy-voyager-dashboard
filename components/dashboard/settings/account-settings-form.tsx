"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Mail, Phone, Globe, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Profile {
    full_name: string;
    email: string;
    phone: string;
    website: string;
    bio: string;
    avatar_url: string;
}

type SaveStatus = "idle" | "saving" | "success";

export function AccountSettingsForm() {
    const [profile, setProfile] = useState<Profile>({
        full_name: "",
        email: "",
        phone: "",
        website: "",
        bio: "",
        avatar_url: "",
    });
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setProfile({
                    full_name: user.user_metadata?.full_name ?? "",
                    email: user.email ?? "",
                    phone: user.user_metadata?.phone ?? "",
                    website: user.user_metadata?.website ?? "",
                    bio: user.user_metadata?.bio ?? "",
                    avatar_url: user.user_metadata?.avatar_url ?? "",
                });
            }
            setIsLoading(false);
        };
        load();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveStatus("saving");

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({
                email: profile.email,
                data: {
                    full_name: profile.full_name,
                    phone: profile.phone,
                    website: profile.website,
                    bio: profile.bio,
                    avatar_url: profile.avatar_url,
                },
            });

            if (error) throw error;
            setSaveStatus("success");
            toast.success("Profile updated successfully!");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch (err: unknown) {
            setSaveStatus("idle");
            toast.error(err instanceof Error ? err.message : "Something went wrong.");
        }
    };

    const handleChange = (field: keyof Profile) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setProfile((prev) => ({ ...prev, [field]: e.target.value }));

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={28} className="animate-spin text-muted-foreground opacity-40" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Row */}
            <div className="flex items-center gap-5 p-6 bg-background/40 rounded-[20px] border border-white/5">
                <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
                        {profile.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-2xl font-black text-primary/60">
                                {profile.full_name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase() || "?"}
                            </span>
                        )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center border-2 border-background cursor-pointer hover:opacity-80 transition-opacity">
                        <User size={12} className="text-primary-foreground" />
                    </div>
                </div>
                <div>
                    <p className="font-semibold text-foreground">{profile.full_name || "Set your name"}</p>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                    <FieldInput
                        className="mt-2 max-w-[280px]"
                        placeholder="Paste image URL for avatar"
                        value={profile.avatar_url}
                        onChange={handleChange("avatar_url")}
                    />
                </div>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FieldGroup label="Full Name" icon={User}>
                    <FieldInput
                        placeholder="Your full name"
                        value={profile.full_name}
                        onChange={handleChange("full_name")}
                        required
                    />
                </FieldGroup>

                <FieldGroup label="Email Address" icon={Mail}>
                    <FieldInput
                        type="email"
                        placeholder="you@example.com"
                        value={profile.email}
                        onChange={handleChange("email")}
                        required
                    />
                </FieldGroup>

                <FieldGroup label="Phone Number" icon={Phone}>
                    <FieldInput
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={profile.phone}
                        onChange={handleChange("phone")}
                    />
                </FieldGroup>

                <FieldGroup label="Website" icon={Globe}>
                    <FieldInput
                        type="url"
                        placeholder="https://yoursite.com"
                        value={profile.website}
                        onChange={handleChange("website")}
                    />
                </FieldGroup>
            </div>

            {/* Bio */}
            <FieldGroup label="Bio">
                <textarea
                    placeholder="A short bio about yourself..."
                    value={profile.bio}
                    onChange={handleChange("bio")}
                    rows={3}
                    className="w-full px-4 py-3 bg-background/50 border border-white/10 rounded-[14px] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors resize-none"
                />
            </FieldGroup>

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
                    {saveStatus === "saving" ? "Saving..." : saveStatus === "success" ? "Saved!" : "Save Changes"}
                </button>
            </div>
        </form>
    );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function FieldGroup({
    label,
    icon: Icon,
    children,
}: {
    label: string;
    icon?: React.ElementType;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {Icon && <Icon size={12} />}
                {label}
            </label>
            {children}
        </div>
    );
}

function FieldInput({
    className,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={cn(
                "w-full px-4 py-3 bg-background/50 border border-white/10 rounded-[14px] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors",
                className
            )}
        />
    );
}


