"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Heart, Calendar, Diamond, Settings, Plus, X, Menu } from 'lucide-react';
import { useState } from "react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
    {
        title: "Heart",
        href: "/dashboard",
        icon: Heart,
    },
    {
        title: "Calendar",
        href: "/dashboard/calendar",
        icon: Calendar,
    },
    {
        title: "Diamond",
        href: "/dashboard/diamond",
        icon: Diamond,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Function to toggle sidebar logic if we were passing it down, 
    // but for now keeping it self-contained or compatible with layout
    const toggle = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Toggle Button (Visible only on mobile when closed) */}
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
                    "fixed md:static inset-y-0 left-0 z-50 flex flex-col items-center justify-between py-8 px-4 w-24 bg-card md:bg-transparent border-r md:border-r-0 border-white/5 transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Logo */}
                <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center mb-8 shrink-0">
                    <span className="text-background font-black text-xl">N</span>
                </div>

                <nav className="flex flex-col gap-6 flex-1 items-center justify-center">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                                    isActive
                                        ? "bg-card text-foreground border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] dark:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                )}
                            >
                                <item.icon size={20} />
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Action */}
                <button className="w-12 h-12 bg-card rounded-full flex items-center justify-center hover:bg-white/10 transition-colors mt-auto group shrink-0 border border-white/5">
                    <Plus size={24} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>

                {/* Close button for mobile */}
                <button className="md:hidden mt-4 text-muted-foreground" onClick={toggle}>
                    <X size={24} />
                </button>

            </aside>
        </>
    );
}
