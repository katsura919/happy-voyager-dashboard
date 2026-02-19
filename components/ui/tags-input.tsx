"use client";

import * as React from "react";
import {
    Root as TagsInputRoot,
    Input as TagsInputInput,
    Item as TagsInputItem,
    ItemText as TagsInputItemText,
    ItemDelete as TagsInputItemDelete,
    Clear as TagsInputClear,
    type TagsInputRootProps,
} from "@diceui/tags-input";
import { cn } from "@/lib/utils";
import { X, RotateCcw } from "lucide-react";

export interface TagsInputProps extends TagsInputRootProps<string> {
    placeholder?: string;
    label?: string;
    onClear?: () => void;
}

export function TagsInput({
    value,
    onValueChange,
    placeholder = "Add tag...",
    label,
    className,
    disabled,
    onClear,
    ...props
}: TagsInputProps) {
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            {label && (
                <label className="text-sm font-medium text-muted-foreground">
                    {label}
                </label>
            )}

            <TagsInputRoot
                value={value}
                onValueChange={onValueChange}
                disabled={disabled}
                delimiter=","
                addOnPaste
                addOnTab
                className={cn("flex flex-col gap-2", disabled && "opacity-50 cursor-not-allowed")}
                {...props}
            >
                <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl border border-border bg-transparent ring-offset-background transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                    {value?.map((tag) => (
                        <TagsInputItem
                            key={tag}
                            value={tag}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-sm border border-border/50 transition-all hover:bg-secondary/80"
                        >
                            <TagsInputItemText className="text-xs font-medium">{tag}</TagsInputItemText>
                            <TagsInputItemDelete className="text-muted-foreground hover:text-foreground transition-colors ml-1 focus:outline-none">
                                <X size={12} />
                            </TagsInputItemDelete>
                        </TagsInputItem>
                    ))}

                    <TagsInputInput
                        placeholder={placeholder}
                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-[120px]"
                    />
                </div>

                <div className="flex w-full">
                    <TagsInputClear asChild>
                        <button
                            type="button"
                            onClick={onClear}
                            className="flex w-full items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors bg-card hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <RotateCcw size={12} />
                            Clear
                        </button>
                    </TagsInputClear>
                </div>
            </TagsInputRoot>
        </div>
    );
}
