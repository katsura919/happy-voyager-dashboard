"use client";

import { Search, ChevronDown, LayoutGrid } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function Header() {
    return (
        <div className="flex flex-col gap-8 w-full z-10 relative pb-5">
            {/* Top Bar */}
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4 md:gap-8">
                    {/* Tabs */}
                    <div className="hidden md:flex bg-card rounded-full p-1 border border-white/5">
                        <TabButton active>Check Box</TabButton>
                        <TabButton>Monitoring</TabButton>
                        <TabButton>Support</TabButton>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-6">
                    <ThemeSwitcher />
                    <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-white/5 transition-colors border border-white/5">
                        <Search size={18} className="text-muted-foreground" />
                    </button>

                    <div className="flex items-center gap-3 pl-4 md:border-l border-white/10">
                        <div className="text-right hidden md:block">
                            <div className="text-sm font-semibold text-foreground">Admin User</div>
                            <div className="text-xs text-muted-foreground">@admin</div>
                        </div>
                        <div className="relative">
                            {/* Avatar placeholder */}
                            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                                <span className="text-xs font-bold">AD</span>
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center border border-black font-bold text-white">
                                2
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub Header / Filters */}
            {/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground uppercase font-sans">
                    Check Box
                </h1>

                <div className="flex flex-wrap items-center gap-3">
                    <FilterButton label="Date" value="Now" />
                    <FilterButton label="Product" value="All" />
                    <FilterButton label="Profile" value="Admin" />

                    <button className="w-10 h-10 rounded-full bg-card border border-white/10 flex items-center justify-center hover:bg-white/5 text-foreground ml-2">
                        <LayoutGrid size={18} />
                    </button>
                </div>
            </div> */}
        </div>
    );
}

const TabButton = ({ children, active }: { children: React.ReactNode; active?: boolean }) => (
    <button className={
        `px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200
    ${active
            ? 'bg-zinc-800 text-white shadow-lg shadow-black/20 dark:bg-zinc-700'
            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`
    }>
        <div className="flex items-center gap-2">
            {active && <div className="w-4 h-4 border border-white/20 rounded md:block hidden bg-primary"></div>}
            {children}
        </div>
    </button>
);

const FilterButton = ({ label, value }: { label: string; value: string }) => (
    <button className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-white/5 text-sm hover:bg-white/5 transition-colors text-foreground">
        <span className="text-muted-foreground">{label}:</span>
        <span className="font-medium">{value}</span>
        <ChevronDown size={14} className="text-muted-foreground ml-1" />
    </button>
);
