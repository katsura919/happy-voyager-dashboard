"use client";


import { Suspense, useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { BlogEditor, BlogEditorHandle } from "@/components/blog/blog-editor";
import { getBlogPost, updateBlogPost, deleteBlogPost, fetchBlogComments } from "@/hooks/blog";
import { uploadToCloudinary } from "@/hooks/cloudinary";
import {
    ArrowLeft, Save, Tag, ImageIcon,
    Upload, X, Loader2, Trash2, ExternalLink, ChevronDown, Eye,
    PenTool, BarChart3, MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { CommentsSection } from "@/components/blog/comments-section";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const CATEGORIES = [
    "Travel Tips", "Destinations", "Food & Culture", "Budget Travel",
    "Safety", "Luxury", "Family Travel", "Eco Travel", "Digital Nomad", "Cruises",
];

function EditBlogPageInner() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;
    const queryClient = useQueryClient();

    const editorRef = useRef<BlogEditorHandle>(null);
    const editorPopulated = useRef(false);

    // ── form state ──────────────────────────────────────────────────────────
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

    // ── fetch post ───────────────────────────────────────────────────────────
    const { data: post, isLoading, isError } = useQuery({
        queryKey: ["blog-post", slug],
        queryFn: () => getBlogPost(slug),
        enabled: !!slug,
    });

    const { data: comments } = useQuery({
        queryKey: ["blog-comments", post?.id],
        queryFn: () => fetchBlogComments(post!.id),
        enabled: !!post?.id,
    });

    // Populate form once post is loaded
    useEffect(() => {
        if (!post) return;
        setTitle(post.title);
        setExcerpt(post.excerpt ?? "");
        setCategory(post.category ?? CATEGORIES[0]);
        setTags(post.tags ?? []);
        setCoverImageUrl(post.cover_image_url ?? "");
        setCoverImagePreview(post.cover_image_url ?? "");
        setStatus(post.status);
        setPublishDate(
            post.publish_date
                ? new Date(post.publish_date).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0]
        );
    }, [post]);

    // Populate editor content after it mounts (editor may mount after post loads)
    useEffect(() => {
        if (post?.content && editorRef.current && !editorPopulated.current) {
            editorRef.current.setContent(post.content);
            editorPopulated.current = true;
        }
    });

    // ── mutation ────────────────────────────────────────────────────────────
    const { mutate: savePost, isPending } = useMutation({
        mutationFn: updateBlogPost,
        onSuccess: (updated) => {
            toast.success(updated.status === "published" ? "Post published!" : "Draft saved!");
            // Refresh the list page cache
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            queryClient.setQueryData(["blog-post", slug], updated);
        },
        onError: (error: Error) => {
            toast.error(error.message ?? "Something went wrong");
        },
    });

    const { mutate: deletePost, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            if (!post) return;
            await deleteBlogPost(post.id);
        },
        onSuccess: () => {
            toast.success("Post deleted");
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            router.push("/dashboard/blog");
        },
        onError: (error: Error) => {
            toast.error(error?.message || "Failed to delete post");
        },
    });

    // ── handlers ────────────────────────────────────────────────────────────
    const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const localPreview = URL.createObjectURL(file);
        setCoverImagePreview(localPreview);
        setCoverImageUrl("");
        setIsUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setCoverImageUrl(url);
            setCoverImagePreview(url);
            toast.success("Cover image uploaded!");
        } catch (err: any) {
            toast.error(err.message ?? "Image upload failed");
            setCoverImagePreview(coverImageUrl); // restore previous
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveCover = () => {
        setCoverImageUrl("");
        setCoverImagePreview("");
    };

    const handleSave = () => {
        if (!title.trim()) { toast.error("Please add a title before saving"); return; }
        if (isUploading) { toast.error("Please wait for the image to finish uploading"); return; }
        if (!post) return;

        savePost({
            id: post.id,
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

    // ── loading / error states ───────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <Loader2 size={32} className="animate-spin opacity-40" />
                <p className="text-sm">Loading post...</p>
            </div>
        );
    }

    if (isError || !post) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <p className="text-destructive font-medium">Post not found</p>
                <Link href="/dashboard/blog" className="text-sm underline underline-offset-4 hover:text-foreground">
                    Back to Blog
                </Link>
            </div>
        );
    }

    // ── render ───────────────────────────────────────────────────────────────
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
                        <h1 className="text-xl font-black tracking-tight text-foreground uppercase line-clamp-1 max-w-xs md:max-w-lg">
                            {title || "Untitled Post"}
                        </h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                                post.status === "published"
                                    ? "bg-primary/20 text-primary"
                                    : "bg-zinc-700/50 text-zinc-400"
                            )}>
                                {status}
                            </span>
                            <div className="h-3 w-px bg-border" />
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1">
                                <MessageSquare size={10} /> {comments?.length || 0} comments
                            </p>
                            <div className="h-3 w-px bg-border" />
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                                Updated {new Date(post.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                            <div className="h-3 w-px bg-border" />
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                                {wordCount} words
                            </p>
                            <div className="h-3 w-px bg-border" />
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1">
                                <Eye size={10} /> {post.views} views
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button
                                disabled={isDeleting || isPending || isUploading}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                title="Delete Post"
                            >
                                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the blog post "{title}".
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => deletePost()}
                                    className="bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white"
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

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
            <Tabs defaultValue="edit" className="flex flex-col flex-1 min-h-0">
                <div className="border-b border-border mb-6">
                    <TabsList className="bg-transparent p-0" variant="line">
                        <TabsTrigger
                            value="edit"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary px-4 pb-3 pt-2 bg-transparent"
                        >
                            <PenTool size={16} className="mr-2" />
                            Edit Content
                        </TabsTrigger>
                        <TabsTrigger
                            value="stats"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary px-4 pb-3 pt-2 bg-transparent"
                        >
                            <BarChart3 size={16} className="mr-2" />
                            Stats & Moderation
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="edit" className="flex gap-6 flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
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
                        <div className="bg-card rounded-[20px] border border-border flex flex-col flex-1 overflow-hidden [&>div]:h-full min-h-[500px]">
                            <BlogEditor
                                ref={editorRef}
                                onWordCountChange={setWordCount}
                                initialContent={post.content}
                            />
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
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Tag size={12} /> Tags
                            </h3>
                            <TagsInput
                                value={tags}
                                onValueChange={setTags}
                                placeholder="Add tags..."
                            />
                        </div>

                        {/* Cover Image */}
                        <div className="bg-card rounded-[20px] border border-border p-5">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                                <ImageIcon size={12} /> Cover Image
                            </h3>
                            <div className="relative group">
                                {coverImagePreview ? (
                                    <div className="relative aspect-video rounded-xl overflow-hidden border border-border">
                                        <img src={coverImagePreview} alt="Cover" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => document.getElementById("cover-upload")?.click()}
                                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                            >
                                                <Upload size={14} />
                                            </button>
                                            <button
                                                onClick={handleRemoveCover}
                                                className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="cover-upload"
                                        className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-border hover:border-sidebar-foreground/50 hover:bg-muted/50 transition-all cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center mb-2">
                                            <Upload size={16} className="text-muted-foreground" />
                                        </div>
                                        <p className="text-xs text-muted-foreground font-medium">Upload Cover</p>
                                    </label>
                                )}
                                <input
                                    id="cover-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleCoverImageChange}
                                    disabled={isUploading}
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="stats" className="flex flex-col gap-6 flex-1 min-h-0 mt-0 data-[state=inactive]:hidden overflow-y-auto">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-card rounded-xl border border-border p-5 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Eye size={16} />
                                <span className="text-xs font-medium uppercase tracking-wider">Total Views</span>
                            </div>
                            <p className="text-3xl font-black text-foreground">{post.views}</p>
                        </div>
                        <div className="bg-card rounded-xl border border-border p-5 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <MessageSquare size={16} />
                                <span className="text-xs font-medium uppercase tracking-wider">Comments</span>
                            </div>
                            {/* We could pass comment count here if we had it, but CommentsSection fetches it. 
                                For now, just show a placeholder or fetch it in the parent. 
                                Since CommentsSection fetches its own data, we can leave this dynamic or empty for now. 
                                Let's just show 'Manage below' or similar if we don't have the count readily available without refetching. 
                                Actually, we can just omit the count or put a placeholder. 
                            */}
                            <p className="text-3xl font-black text-foreground">-</p>
                        </div>
                        <div className="bg-card rounded-xl border border-border p-5 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Tag size={16} />
                                <span className="text-xs font-medium uppercase tracking-wider">Status</span>
                            </div>
                            <p className={cn("text-3xl font-black capitalize", post.status === "published" ? "text-primary" : "text-zinc-500")}>
                                {post.status}
                            </p>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="bg-card rounded-[20px] border border-border p-6">
                        <CommentsSection blogId={post.id} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default function EditBlogPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Loading editor...
            </div>
        }>
            <EditBlogPageInner />
        </Suspense>
    );
}
