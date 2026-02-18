"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";

const sidebarItems = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Blogs",
        href: "/dashboard/blogs",
        icon: FileText,
    },
    {
        title: "Comments",
        href: "/dashboard/comments",
        icon: MessageSquare,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "relative flex flex-col border-r bg-card transition-all duration-300 ease-in-out h-screen sticky top-0",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            <div className="flex items-center justify-between p-4 border-b h-16">
                {!isCollapsed && (
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent truncate">
                        Dashboard
                    </span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", isCollapsed && "mx-auto")}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-2">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                                isCollapsed && "justify-center px-2"
                            )}
                        >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {!isCollapsed && <span>{item.title}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t flex flex-col gap-4">
                {!isCollapsed && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Theme</span>
                        <ThemeSwitcher />
                    </div>
                )}
                {isCollapsed && (
                    <div className="flex justify-center">
                        <ThemeSwitcher />
                    </div>
                )}

                <form action="/auth/signout" method="post">
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10",
                            isCollapsed && "justify-center p-2"
                        )}
                        type="submit"
                    >
                        <LogOut className="h-5 w-5" />
                        {!isCollapsed && "Sign Out"}
                    </Button>
                </form>
            </div>
        </aside>
    );
}
