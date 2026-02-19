import { Suspense } from "react";
import { SettingsTabs } from "@/components/dashboard/settings/settings-tabs";
import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Settings size={18} className="text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground uppercase">
                        Settings
                    </h1>
                    <p className="text-muted-foreground text-sm mt-0.5">
                        Manage your account preferences and security
                    </p>
                </div>
            </div>

            {/* Tabs & Content */}
            <Suspense
                fallback={
                    <div className="bg-card rounded-[28px] border border-white/5 p-8 space-y-6 animate-pulse">
                        <div className="flex gap-2">
                            <div className="h-9 w-36 rounded-full bg-white/5" />
                            <div className="h-9 w-36 rounded-full bg-white/5" />
                        </div>
                        <div className="space-y-4">
                            <div className="h-24 rounded-[20px] bg-white/5" />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-14 rounded-[14px] bg-white/5" />
                                <div className="h-14 rounded-[14px] bg-white/5" />
                                <div className="h-14 rounded-[14px] bg-white/5" />
                                <div className="h-14 rounded-[14px] bg-white/5" />
                            </div>
                            <div className="h-20 rounded-[14px] bg-white/5" />
                        </div>
                    </div>
                }
            >
                <SettingsTabs />
            </Suspense>
        </div>
    );
}
