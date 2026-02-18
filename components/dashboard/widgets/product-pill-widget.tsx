"use client";

import { MoreHorizontal } from 'lucide-react';
import { cn } from "@/lib/utils";

interface PillData {
    id: number;
    topVal: number;
    bottomVal: number;
    topColor: 'white' | 'primary' | 'secondary';
    bottomColor: 'white' | 'primary' | 'secondary';
    heightPercent: number; // For the pill height relative to container
}

const mockData: PillData[] = [
    { id: 1, topVal: 52, bottomVal: 81, topColor: 'white', bottomColor: 'secondary', heightPercent: 60 },
    { id: 2, topVal: 96, bottomVal: 25, topColor: 'primary', bottomColor: 'secondary', heightPercent: 90 },
    { id: 3, topVal: 48, bottomVal: 51, topColor: 'primary', bottomColor: 'white', heightPercent: 50 },
    { id: 4, topVal: 80, bottomVal: 49, topColor: 'primary', bottomColor: 'secondary', heightPercent: 70 },
    { id: 5, topVal: 34, bottomVal: 67, topColor: 'secondary', bottomColor: 'primary', heightPercent: 40 },
    { id: 6, topVal: 92, bottomVal: 28, topColor: 'primary', bottomColor: 'white', heightPercent: 95 },
    { id: 7, topVal: 58, bottomVal: 20, topColor: 'primary', bottomColor: 'secondary', heightPercent: 65 },
    { id: 8, topVal: 84, bottomVal: 39, topColor: 'secondary', bottomColor: 'primary', heightPercent: 85 },
    { id: 9, topVal: 36, bottomVal: 72, topColor: 'white', bottomColor: 'secondary', heightPercent: 45 },
];

export function ProductPillWidget() {
    return (
        <div className="bg-card rounded-[32px] p-6 flex flex-col h-full border border-white/5 shadow-sm">
            <div className="flex justify-between items-start mb-8">
                <h3 className="text-muted-foreground font-bold text-xs tracking-wider uppercase">Product</h3>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Chart Area */}
            <div className="flex-1 flex items-center justify-between px-2 relative min-h-[200px]">
                {mockData.map((item) => (
                    <PillColumn key={item.id} data={item} />
                ))}
            </div>

            {/* Footer Legend */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/5">
                <div className="flex items-center gap-6">
                    <LegendItem color="bg-foreground" label="Resources" />
                    <LegendItem color="bg-primary" label="Valid" />
                    <LegendItem color="bg-secondary" label="Invalid" />
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                    Total: <span className="text-foreground ml-1">1,012</span>
                </div>
            </div>
        </div>
    );
}

const PillColumn = ({ data }: { data: PillData }) => {
    const getColorClass = (c: string) => {
        switch (c) {
            case 'primary': return 'bg-primary text-primary-foreground';
            case 'secondary': return 'bg-secondary text-secondary-foreground';
            default: return 'bg-foreground text-background';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-2 relative group w-10">
            {/* Dashed background line */}
            <div className="absolute inset-y-0 w-px border-l border-dashed border-zinc-700/50 dark:border-zinc-700 h-full -z-10 group-hover:border-zinc-500 transition-colors" />

            {/* Container for pills ensuring they are vertically centered but spaced based on heightPercent */}
            <div
                className="flex flex-col justify-between items-center w-full transition-all duration-500 ease-out"
                style={{ height: `${data.heightPercent}%` }}
            >
                <div className={cn("w-10 h-14 rounded-full flex items-center justify-center text-xs font-bold shadow-lg", getColorClass(data.topColor))}>
                    {data.topVal}
                </div>

                {/* Middle dot */}
                <div className={cn("w-2 h-2 rounded-full", data.topColor === 'secondary' ? 'bg-secondary' : 'bg-primary')} />

                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-lg", getColorClass(data.bottomColor))}>
                    {data.bottomVal}
                </div>
            </div>
        </div>
    );
};

const LegendItem = ({ color, label }: { color: string; label: string }) => (
    <div className="flex items-center gap-2">
        <div className={cn("w-3 h-3 rounded-full border-[3px] border-card outline outline-1 outline-white/20", color)} />
        <span className="text-xs text-muted-foreground">{label}</span>
    </div>
);
