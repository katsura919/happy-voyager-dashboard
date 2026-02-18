"use client";

import { MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

const data = [
    { name: '1', val1: 400, val2: 240 },
    { name: '2', val1: 300, val2: 139 },
    { name: '3', val1: 200, val2: 980 },
    { name: '4', val1: 278, val2: 390 },
    { name: '5', val1: 189, val2: 480 },
    { name: '6', val1: 239, val2: 380 },
    { name: '7', val1: 349, val2: 430 },
    { name: '8', val1: 400, val2: 240 },
    { name: '9', val1: 300, val2: 139 },
    { name: '10', val1: 200, val2: 980 },
];

export function CustomerWidget() {
    return (
        <div className="bg-card rounded-[32px] p-6 flex flex-col h-full relative overflow-hidden group border border-white/5 shadow-sm min-w-0">
            <div className="flex justify-between items-start mb-6 z-10">
                <h3 className="text-muted-foreground font-bold text-xs tracking-wider uppercase">Customer</h3>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="flex gap-8 mb-4 z-10">
                <div>
                    <div className="flex items-center gap-1 mb-1">
                        <ArrowUp size={12} className="text-primary" />
                        <span className="text-3xl font-bold text-foreground">2,4%</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">Web Surfing</p>
                </div>
                <div>
                    <div className="flex items-center gap-1 mb-1">
                        <ArrowDown size={12} className="text-secondary" />
                        <span className="text-3xl font-bold text-foreground">1,1%</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">Radio Station</p>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-24 w-full opacity-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <Line
                            type="monotone"
                            dataKey="val1"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={true}
                        />
                        <Line
                            type="monotone"
                            dataKey="val2"
                            stroke="hsl(var(--secondary))"
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
