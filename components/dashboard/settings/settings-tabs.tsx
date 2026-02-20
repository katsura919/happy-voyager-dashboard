"use client";

import { useState } from "react";
import { UserCircle, KeyRound, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccountSettingsForm } from "./account-settings-form";
import { PasswordChangeForm } from "./password-change-form";
import { TeamManagementForm } from "./team-management-form";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type Tab = "account" | "password" | "team";

const TABS: { id: Tab; label: string; icon: React.ElementType; description: string; adminOnly?: boolean }[] = [
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
    {
        id: "team",
        label: "Team",
        icon: Users,
        description: "Manage team members and roles",
        adminOnly: true,
    },
];

export function SettingsTabs({ userRole }: { userRole: string }) {
    const searchParams = useSearchParams();
    const urlTab = searchParams.get("tab") as Tab | null;

    const visibleTabs = TABS.filter((tab) => !tab.adminOnly || userRole === "admin");
    const [activeTab, setActiveTab] = useState<Tab>("account");

    useEffect(() => {
        if (urlTab && visibleTabs.some(t => t.id === urlTab)) {
            setActiveTab(urlTab);
        }
    }, [urlTab, visibleTabs]);

    const current = visibleTabs.find((t) => t.id === activeTab) || visibleTabs[0];

    return (
        <div className="bg-card rounded-[28px] border border-white/5 overflow-hidden">
            {/* Tab Bar */}
            <div className="flex gap-1 p-2 border-b border-white/5 bg-background/20">
                {visibleTabs.map((tab) => (
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
                    {activeTab === "team" && <TeamManagementForm />}
                </div>
            </div>
        </div>
    );
}
