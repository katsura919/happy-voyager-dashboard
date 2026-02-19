"use client";

import { useState } from "react";
import { UserCircle, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccountSettingsForm } from "./account-settings-form";
import { PasswordChangeForm } from "./password-change-form";

type Tab = "account" | "password";

const TABS: { id: Tab; label: string; icon: React.ElementType; description: string }[] = [
    {
        id: "account",
        label: "Account",
        icon: UserCircle,
        description: "Update your personal information and avatar",
    },
    {
        id: "password",
        label: "Password",
        icon: KeyRound,
        description: "Change your password and manage security",
    },
];

export function SettingsTabs() {
    const [activeTab, setActiveTab] = useState<Tab>("account");
    const current = TABS.find((t) => t.id === activeTab)!;

    return (
        <div className="bg-card rounded-[28px] border border-white/5 overflow-hidden">
            {/* Tab Bar */}
            <div className="flex gap-1 p-2 border-b border-white/5 bg-background/20">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                            activeTab === tab.id
                                ? "bg-card text-foreground shadow-sm border border-white/10"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        )}
                    >
                        <tab.icon size={15} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
                {/* Section heading */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <current.icon size={18} className="text-primary" />
                        {current.label} Settings
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">{current.description}</p>
                </div>

                {/* Animated panel swap */}
                <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                    {activeTab === "account" && <AccountSettingsForm />}
                    {activeTab === "password" && <PasswordChangeForm />}
                </div>
            </div>
        </div>
    );
}
