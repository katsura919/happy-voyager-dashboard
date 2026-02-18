"use client";

import { useState, useEffect } from 'react';
import { MoreHorizontal, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from "@/lib/utils";

export function ProductDotWidget() {
    const [dots, setDots] = useState<{ id: string; color: string }[]>([]);

    useEffect(() => {
        const rows = 5;
        const cols = 14;
        const items = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const seed = Math.random();
                let color = 'bg-zinc-700 dark:bg-zinc-800'; // Default gray
                if (seed > 0.8) color = 'bg-primary'; // Lime
                else if (seed > 0.6) color = 'bg-foreground'; // White/Black
                else if (seed > 0.5) color = 'bg-secondary'; // Orange

                items.push({ id: `${i}-${j}`, color });
            }
        }
        setDots(items);
    }, []);

    return (
        <div className="bg-card rounded-[32px] p-6 flex flex-col h-full relative overflow-hidden border border-white/5 shadow-sm">
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-muted-foreground font-bold text-xs tracking-wider uppercase">Product</h3>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="flex gap-8 mb-8">
                <div>
                    <div className="flex items-center gap-1 mb-1">
                        <ArrowUp size={12} className="text-primary" />
                        <span className="text-3xl font-bold text-foreground">2,8%</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">Partners</p>
                </div>
                <div>
                    <div className="flex items-center gap-1 mb-1">
                        <ArrowDown size={12} className="text-secondary" />
                        <span className="text-3xl font-bold text-foreground">3,2%</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">Owners</p>
                </div>
            </div>

            <div className="flex-1 flex items-end">
                <div className="grid grid-cols-[repeat(14,1fr)] gap-2 w-full">
                    {dots.map((dot) => (
                        <div key={dot.id} className={cn("aspect-square rounded-full w-1.5 h-1.5 opacity-80", dot.color)} />
                    ))}
                </div>
            </div>
        </div>
    );
}
