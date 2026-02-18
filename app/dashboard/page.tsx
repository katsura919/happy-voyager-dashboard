import { StatsCard } from "@/components/dashboard/stats-card";
import { FileText, MessageSquare, Users, Activity } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Blogs"
                    value="12"
                    description="+2 from last month"
                    icon={FileText}
                />
                <StatsCard
                    title="Total Comments"
                    value="345"
                    description="+18% from last month"
                    icon={MessageSquare}
                />
                <StatsCard
                    title="Active Users"
                    value="573"
                    description="+201 since last hour"
                    icon={Users}
                />
                <StatsCard
                    title="Activity"
                    value="+573"
                    description="+201 since last hour"
                    icon={Activity}
                />
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                {/* Placeholder for Recent Activity or Charts */}
                <div className="col-span-4 bg-card rounded-xl border shadow-sm p-6 min-h-[300px] flex items-center justify-center text-muted-foreground">
                    Recent Activity / Chart Placeholder
                </div>
                <div className="col-span-3 bg-card rounded-xl border shadow-sm p-6 min-h-[300px] flex items-center justify-center text-muted-foreground">
                    Recent Comments Placeholder
                </div>
            </div>
        </div>
    );
}
