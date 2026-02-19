"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Heart, Calendar, Diamond, Settings, Plus, X, Menu, BookOpen, Search } from 'lucide-react';
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard", icon: Heart },
    { title: "Blog", href: "/dashboard/blog", icon: BookOpen },
    { title: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    { title: "Diamond", href: "/dashboard/diamond", icon: Diamond },
    { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

/** Isolated so usePathname() is always inside a Suspense boundary */
function SidebarNav() {
    const pathname = usePathname();
    return (
        <nav className="flex flex-col gap-6 flex-1 items-center justify-center">
            {sidebarItems.map((item) => {
                const isActive =
                    pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        title={item.title}
                        className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                            isActive
                                ? "bg-card text-foreground border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        )}
                    >
                        <item.icon size={20} />
                    </Link>
                );
            })}
        </nav>
    );
}

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Toggle Button */}
            <div className="fixed top-4 left-4 z-50 md:hidden">
                <Button variant="ghost" size="icon" onClick={toggle}>
                    <Menu />
                </Button>
            </div>

            {/* Mobile Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={toggle}
            />

            <aside
                className={cn(
                    "fixed md:static inset-y-0 left-0 z-50 flex flex-col items-center py-8 px-4 w-24 bg-card md:bg-transparent border-r md:border-r-0 border-white/5 transition-transform duration-300 ease-in-out gap-6",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Logo */}
                <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center shrink-0">
                    <span className="text-background font-black text-xl">N</span>
                </div>

                {/* Nav — wrapped in Suspense so usePathname() doesn't block prerender */}
                <Suspense
                    fallback={
                        <nav className="flex flex-col gap-6 flex-1 items-center justify-center">
                            {sidebarItems.map((item) => (
                                <div key={item.href} className="w-12 h-12 rounded-full bg-white/5 animate-pulse" />
                            ))}
                        </nav>
                    }
                >
                    <SidebarNav />
                </Suspense>

                {/* Bottom utilities (from old Header) */}
                <div className="flex flex-col items-center gap-4 mt-auto shrink-0">
                    {/* Theme switcher */}
                    <ThemeSwitcher />

                    {/* User avatar */}
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                            <span className="text-xs font-bold">AD</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center border border-black font-bold text-white">
                            2
                        </div>
                    </div>
                </div>

                {/* Close button for mobile */}
                <button className="md:hidden text-muted-foreground shrink-0" onClick={toggle}>
                    <X size={24} />
                </button>
            </aside>
        </>
    );
}
