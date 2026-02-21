

import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardAuthCheck } from "@/components/dashboard/dashboard-auth-check";
import { Suspense } from "react";


export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full bg-muted/40 overflow-hidden">
            <Suspense>
                <DashboardAuthCheck />
            </Suspense>
            <Sidebar />

            {/* Main Content Area with padding for floating effect */}
            <div className="flex-1 h-full p-6 overflow-hidden bg-card">
                <div className="flex flex-col h-full w-full rounded-[32px] bg-background overflow-hidden border border-white/5 shadow-2xl relative shadow-none">


                    {/* Scrollable Content */}
                    <main className="flex-1 overflow-y-auto p-4 pt-20 md:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
