"use client";

import { Suspense, useState } from "react";
import { BlogEditor } from "@/components/blog/blog-editor";
import { ArrowLeft, Save, Tag, Calendar, Image as ImageIcon, Globe, Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Travel Tips", "Destinations", "Food & Culture", "Budget Travel", "Safety", "Luxury", "Family Travel", "Eco Travel", "Digital Nomad", "Cruises"];

function NewBlogPageInner() {
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [status, setStatus] = useState<"draft" | "published">("draft");
    const [isSaving, setIsSaving] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase().replace(/,/g, "");
            if (!tags.includes(newTag)) setTags([...tags, newTag]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const handleSave = async (publishStatus: "draft" | "published") => {
        setIsSaving(true);
        setStatus(publishStatus);
        await new Promise((r) => setTimeout(r, 1000));
        setIsSaving(false);
        // TODO: wire up to actual API
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/blog"
                        className="w-9 h-9 rounded-full bg-card border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/30 transition-all"
                    >
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-foreground uppercase">New Post</h1>
                        <p className="text-xs text-muted-foreground">{wordCount} words</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleSave("draft")}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/30 transition-all disabled:opacity-50"
                    >
                        <Save size={14} />
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSave("published")}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-5 py-2 rounded-full text-sm bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        <Globe size={14} />
                        {isSaving ? "Publishing..." : "Publish"}
                    </button>
                </div>
            </div>

            {/* Main Layout */}
            <div className="flex gap-6 flex-1 min-h-0">
                {/* Editor Area */}
                <div className="flex-1 flex flex-col gap-4 min-w-0">
                    {/* Title */}
                    <div className="bg-card rounded-[20px] border border-white/5 px-6 py-4">
                        <input
                            type="text"
                            placeholder="Post title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent text-2xl font-black text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                        />
                    </div>

                    {/* Excerpt */}
                    <div className="bg-card rounded-[20px] border border-white/5 px-6 py-4">
                        <textarea
                            placeholder="Write a short excerpt or summary..."
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            rows={2}
                            className="w-full bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none"
                        />
                    </div>

                    {/* Rich Text Editor */}
                    <div className="bg-card rounded-[20px] border border-white/5 flex flex-col flex-1 overflow-hidden">
                        <BlogEditor onWordCountChange={setWordCount} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-72 shrink-0 flex flex-col gap-4">
                    {/* Status */}
                    <div className="bg-card rounded-[20px] border border-white/5 p-5">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Status</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setStatus("draft")}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-medium border transition-all",
                                    status === "draft"
                                        ? "bg-zinc-700/50 text-zinc-300 border-zinc-600"
                                        : "border-white/10 text-muted-foreground hover:border-white/30"
                                )}
                            >
                                <Lock size={12} /> Draft
                            </button>
                            <button
                                onClick={() => setStatus("published")}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-medium border transition-all",
                                    status === "published"
                                        ? "bg-primary/20 text-primary border-primary/40"
                                        : "border-white/10 text-muted-foreground hover:border-white/30"
                                )}
                            >
                                <Globe size={12} /> Published
                            </button>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="bg-card rounded-[20px] border border-white/5 p-5">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Tag size={12} /> Category
                        </h3>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tags */}
                    <div className="bg-card rounded-[20px] border border-white/5 p-5">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Tag size={12} /> Tags
                        </h3>
                        <input
                            type="text"
                            placeholder="Add tag, press Enter..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            className="w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors mb-3"
                        />
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/50 border border-white/10 text-xs text-muted-foreground"
                                    >
                                        {tag}
                                        <button onClick={() => handleRemoveTag(tag)} className="text-muted-foreground hover:text-foreground ml-0.5">×</button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cover Image */}
                    <div className="bg-card rounded-[20px] border border-white/5 p-5">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                            <ImageIcon size={12} /> Cover Image
                        </h3>
                        <input
                            type="text"
                            placeholder="Paste image URL..."
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            className="w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                        {coverImage ? (
                            <div className="mt-3 rounded-xl overflow-hidden aspect-video">
                                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="mt-3 rounded-xl border border-dashed border-white/10 aspect-video flex items-center justify-center text-muted-foreground/30">
                                <ImageIcon size={32} />
                            </div>
                        )}
                    </div>

                    {/* Publish Date */}
                    <div className="bg-card rounded-[20px] border border-white/5 p-5">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Calendar size={12} /> Publish Date
                        </h3>
                        <input
                            type="date"
                            defaultValue={new Date().toISOString().split("T")[0]}
                            className="w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function NewBlogPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-full text-muted-foreground text-sm">Loading editor...</div>}>
            <NewBlogPageInner />
        </Suspense>
    );
}
