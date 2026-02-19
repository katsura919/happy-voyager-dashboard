"use client";

import { Suspense, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BlogEditor, BlogEditorHandle } from "@/components/blog/blog-editor";
import { createBlogPost } from "@/hooks/blog";
import { uploadToCloudinary } from "@/hooks/cloudinary";
import { ArrowLeft, Save, Tag, ImageIcon, Upload, X, Loader2, ChevronDown } from "lucide-react";
import Link from "next/link";
import { TagsInput } from "@/components/ui/tags-input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Travel Tips", "Destinations", "Food & Culture", "Budget Travel", "Safety", "Luxury", "Family Travel", "Eco Travel", "Digital Nomad", "Cruises"];

function NewBlogPageInner() {
    const router = useRouter();
    const editorRef = useRef<BlogEditorHandle>(null);

    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [tags, setTags] = useState<string[]>([]);
    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [coverImagePreview, setCoverImagePreview] = useState("");
    const [status, setStatus] = useState<"draft" | "published">("draft");
    const [publishDate, setPublishDate] = useState(new Date().toISOString().split("T")[0]);
    const [wordCount, setWordCount] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    // TanStack Query mutation for creating a blog post
    const { mutate: savePost, isPending } = useMutation({
        mutationFn: createBlogPost,
        onSuccess: () => {
            toast.success(status === "published" ? "Post published!" : "Draft saved!");
            router.push("/dashboard/blog");
        },
        onError: (error: Error) => {
            toast.error(error.message ?? "Something went wrong");
        },
    });

    const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show local preview immediately
        const localPreview = URL.createObjectURL(file);
        setCoverImagePreview(localPreview);
        setCoverImageUrl(""); // clear until upload completes

        setIsUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setCoverImageUrl(url);
            setCoverImagePreview(url);
            toast.success("Cover image uploaded!");
        } catch (err: any) {
            toast.error(err.message ?? "Image upload failed");
            setCoverImagePreview("");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveCover = () => {
        setCoverImageUrl("");
        setCoverImagePreview("");
    };

    const handleSave = () => {
        if (!title.trim()) {
            toast.error("Please add a title before saving");
            return;
        }
        if (isUploading) {
            toast.error("Please wait for the image to finish uploading");
            return;
        }

        savePost({
            title,
            excerpt,
            content: editorRef.current?.getHTML() ?? "",
            cover_image_url: coverImageUrl,
            category,
            tags,
            status,
            publish_date: publishDate || null,
        });
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/blog"
                        className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-sidebar-foreground/30 transition-all"
                    >
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-foreground uppercase">New Post</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                                status === "published"
                                    ? "bg-primary/20 text-primary"
                                    : "bg-zinc-700/50 text-zinc-400"
                            )}>
                                {status}
                            </span>
                            <div className="h-3 w-px bg-border" />
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                                {wordCount} words
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-card border border-border rounded-full p-1 pr-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-muted/50 transition-colors focus:outline-none">
                                    <span className={cn(
                                        "w-2 h-2 rounded-full",
                                        status === "published" ? "bg-primary" : "bg-zinc-500"
                                    )} />
                                    {status === "published" ? "Published" : "Draft"}
                                    <ChevronDown size={14} className="text-muted-foreground opacity-50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuRadioGroup value={status} onValueChange={(val) => setStatus(val as "draft" | "published")}>
                                    <DropdownMenuRadioItem value="draft">Draft</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="published">Published</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isPending || isUploading}
                        className="flex items-center gap-2 px-5 py-2 rounded-full text-sm bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Save
                    </button>
                </div>
            </div>

            {/* Main Layout */}
            <div className="flex gap-6 flex-1 min-h-0">
                {/* Editor Area */}
                <div className="flex-1 flex flex-col gap-4 min-w-0">
                    {/* Title */}
                    <div className="bg-card rounded-[20px] border border-border px-6 py-4">
                        <input
                            type="text"
                            placeholder="Post title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent text-2xl font-black text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                        />
                    </div>

                    {/* Excerpt */}
                    <div className="bg-card rounded-[20px] border border-border px-6 py-4">
                        <textarea
                            placeholder="Write a short excerpt or summary..."
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            rows={2}
                            className="w-full bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none"
                        />
                    </div>

                    {/* Rich Text Editor */}
                    <div className="bg-card rounded-[20px] border border-border flex flex-col flex-1 overflow-hidden [&>div]:h-full">
                        <BlogEditor ref={editorRef} onWordCountChange={setWordCount} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-72 shrink-0 flex flex-col gap-4 overflow-y-auto">


                    {/* Category */}
                    <div className="bg-card rounded-[20px] border border-border p-5">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Tag size={12} /> Category
                        </h3>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-full flex items-center justify-between bg-background/50 border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors">
                                    {category}
                                    <ChevronDown size={14} className="text-muted-foreground opacity-50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start">
                                <DropdownMenuLabel>Select Category</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
                                    {CATEGORIES.map((cat) => (
                                        <DropdownMenuRadioItem key={cat} value={cat}>
                                            {cat}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Tags */}
                    <div className="bg-card rounded-[20px] border border-border p-5">
                        <TagsInput
                            label="Tags"
                            value={tags}
                            onValueChange={setTags}
                            placeholder="Add tag..."
                            max={5}
                            onClear={() => setTags([])}
                        />
                    </div>

                    {/* Cover Image */}
                    <div className="bg-card rounded-[20px] border border-border p-5">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                            <ImageIcon size={12} /> Cover Image
                        </h3>

                        {coverImagePreview ? (
                            <div className="relative rounded-xl overflow-hidden aspect-video">
                                <img src={coverImagePreview} alt="Cover" className="w-full h-full object-cover" />
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <Loader2 size={24} className="animate-spin text-white" />
                                    </div>
                                )}
                                {!isUploading && (
                                    <button
                                        onClick={handleRemoveCover}
                                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <label className="mt-1 rounded-xl border border-dashed border-border aspect-video flex flex-col items-center justify-center gap-2 text-muted-foreground/50 hover:border-sidebar-foreground/30 hover:text-muted-foreground transition-all cursor-pointer">
                                <Upload size={24} />
                                <span className="text-xs">Click to upload</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleCoverImageChange}
                                />
                            </label>
                        )}
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
