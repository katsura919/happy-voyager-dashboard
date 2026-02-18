"use client";

import { MoreHorizontal, Disc, Twitter, Facebook, Dribbble, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineItem {
    id: number;
    dateLabel: string;
    tasks: Task[];
}

interface Task {
    id: string;
    start: number; // 0-30 grid range
    end: number;
    color: 'primary' | 'secondary' | 'white';
    count: number;
    icons: React.ReactNode[];
}

const timelineData: TimelineItem[] = [
    {
        id: 1,
        dateLabel: '30.09',
        tasks: [
            { id: 't1', start: 6, end: 14, color: 'primary', count: 16, icons: [<Disc size={16} key="1" />] }
        ]
    },
    {
        id: 2,
        dateLabel: '29.09',
        tasks: [
            { id: 't2', start: 19, end: 29, color: 'secondary', count: 29, icons: [<Gamepad2 size={16} key="1" />] }
        ]
    },
    {
        id: 3,
        dateLabel: '28.09',
        tasks: [
            {
                id: 't3', start: 8, end: 18, color: 'white', count: 15, icons: [
                    <div key="1" className="w-5 h-5 rounded-full bg-zinc-300" />,
                    <div key="2" className="w-5 h-5 rounded-full bg-zinc-400" />,
                    <div key="3" className="w-5 h-5 rounded-full bg-zinc-500" />
                ]
            }
        ]
    },
    {
        id: 4,
        dateLabel: '27.09',
        tasks: [
            { id: 't4', start: 10, end: 21, color: 'primary', count: 21, icons: [<Dribbble size={16} key="1" className="text-pink-600" />] }
        ]
    },
    {
        id: 5,
        dateLabel: '26.09',
        tasks: [
            { id: 't5', start: 4, end: 10, color: 'white', count: 10, icons: [<Gamepad2 size={16} key="1" className="text-indigo-500" />] }
        ]
    },
    {
        id: 6,
        dateLabel: '25.09',
        tasks: [
            { id: 't6', start: 11, end: 17, color: 'secondary', count: 15, icons: [<Facebook size={16} key="1" className="text-white" />] },
            {
                id: 't7', start: 18, end: 29, color: 'primary', count: 19, icons: [
                    <div key="1" className="w-5 h-5 rounded-full bg-zinc-300" />,
                    <div key="2" className="w-5 h-5 rounded-full bg-zinc-400" />,
                    <div key="3" className="w-5 h-5 rounded-full bg-zinc-500" />,
                    <div key="4" className="w-5 h-5 rounded-full bg-zinc-600" />
                ]
            }
        ]
    },
    {
        id: 7,
        dateLabel: '24.09',
        tasks: [
            { id: 't8', start: 12, end: 18, color: 'white', count: 8, icons: [<Twitter size={16} key="1" className="text-blue-400" />] }
        ]
    },
];

export function TimelineWidget() {
    return (
        <div className="bg-card rounded-[32px] p-8 flex flex-col h-full border border-white/5 relative shadow-sm">
            <div className="flex justify-between items-start mb-10">
                <h3 className="text-foreground font-bold text-sm tracking-wider uppercase">Projects Timeline</h3>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Timeline Grid */}
            <div className="flex-1 relative flex flex-col">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 flex pl-12">
                    {[0, 5, 10, 15, 20, 25, 30].map((val, i) => (
                        <div key={i} className="flex-1 border-l border-dashed border-zinc-700/50 dark:border-zinc-700 h-full relative first:border-0">
                            <span className="absolute -bottom-6 -left-2 text-[10px] text-muted-foreground font-medium">{val}</span>
                        </div>
                    ))}
                </div>

                {/* Rows */}
                <div className="relative z-10 flex flex-col justify-between h-full pb-6 gap-6">
                    {timelineData.map((row) => (
                        <div key={row.id} className="flex items-center h-12 relative w-full group">
                            {/* Date Label */}
                            <div className="w-12 text-xs font-medium text-muted-foreground shrink-0 tabular-nums">
                                {row.dateLabel}
                            </div>

                            {/* Task Area */}
                            <div className="flex-1 h-full relative mx-4">
                                {/* Render tasks */}
                                {row.tasks.map(task => (
                                    <TimelineBar key={task.id} task={task} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-700/50 dark:border-zinc-700">
                <div className="flex items-center gap-6">
                    <LegendItem color="bg-primary" label="Customer" />
                    <LegendItem color="bg-secondary" label="Product" />
                    <LegendItem color="bg-foreground" label="Web" />
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                    Total: <span className="text-foreground ml-1">284</span>
                </div>
            </div>
        </div>
    );
}

const TimelineBar = ({ task }: { task: Task }) => {
    // Calculate position and width based on 0-30 scale
    // We assume the container width maps to 30 units
    const left = `${(task.start / 30) * 100}%`;
    const width = `${((task.end - task.start) / 30) * 100}%`;

    const getColorClasses = (c: string) => {
        switch (c) {
            case 'primary': return 'bg-primary text-black shadow-[0_0_15px_rgba(190,242,100,0.3)]';
            case 'secondary': return 'bg-secondary text-black shadow-[0_0_15px_rgba(251,146,60,0.3)]';
            default: return 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)] dark:bg-zinc-200';
        }
    };

    return (
        <div
            className={cn("absolute top-1/2 -translate-y-1/2 h-10 rounded-full flex items-center justify-between px-1.5 transition-all hover:scale-105 hover:z-20 cursor-pointer", getColorClasses(task.color))}
            style={{ left, width }}
        >
            <div className="flex items-center -space-x-1 pl-1">
                {task.icons.map((icon, i) => (
                    <div key={i} className="relative z-10 w-6 h-6 flex items-center justify-center bg-transparent rounded-full overflow-hidden">
                        {icon}
                    </div>
                ))}
            </div>
            <span className="text-[10px] font-bold mr-3">{task.count}</span>
        </div>
    );
};

const LegendItem = ({ color, label }: { color: string; label: string }) => (
    <div className="flex items-center gap-2">
        <div className={cn("w-3 h-3 rounded-full border-[3px] border-card outline outline-1 outline-white/20", color)} />
        <span className="text-xs text-muted-foreground">{label}</span>
    </div>
);
