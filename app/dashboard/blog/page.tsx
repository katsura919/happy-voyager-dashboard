"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, LayoutGrid, List, Plus, Calendar, Tag, MoreHorizontal, Loader2, FileText, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { fetchBlogPosts } from "@/hooks/blog";
import { BlogPost } from "@/types/blogs.types";

const LIMIT = 6;
const CATEGORIES = ["All", "Travel Tips", "Destinations", "Food & Culture", "Budget Travel", "Safety", "Luxury", "Family Travel", "Eco Travel", "Digital Nomad", "Cruises"];

type ViewMode = "grid" | "table";
type StatusFilter = "all" | "published" | "draft";

export default function BlogPage() {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [page, setPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    // Debounce search input so we don't fire a request on every keystroke
    const handleSearch = (val: string) => {
        setSearch(val);
        setPage(1);
        clearTimeout((handleSearch as any)._timer);
        (handleSearch as any)._timer = setTimeout(() => setDebouncedSearch(val), 400);
    };

    const handleCategory = (cat: string) => { setSelectedCategory(cat); setPage(1); };
    const handleStatus = (s: StatusFilter) => { setStatusFilter(s); setPage(1); };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["blog-posts", { page, limit: LIMIT, status: statusFilter, search: debouncedSearch, category: selectedCategory }],
        queryFn: () => fetchBlogPosts({
            page,
            limit: LIMIT,
            status: statusFilter === "all" ? undefined : statusFilter,
            search: debouncedSearch || undefined,
            category: selectedCategory === "All" ? undefined : selectedCategory,
        }),
        placeholderData: (prev) => prev,
    });

    const posts = data?.posts ?? [];
    const total = data?.total ?? 0;
    const totalPages = data?.totalPages ?? 1;

    // All filtering is now server-side
    const displayed = posts;

    return (
        <div className="flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground uppercase">Blog Posts</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {isLoading ? "Loading..." : `${total} post${total !== 1 ? "s" : ""} total`}
                    </p>
                </div>
                <Link
                    href="/dashboard/blog/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
                >
                    <Plus size={16} />
                    New Post
                </Link>
            </div>

            {/* Filters & Controls */}
            <div className="bg-card rounded-[24px] p-4 border border-border flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Status Filter */}
                        <div className="flex bg-background/50 rounded-full p-1 border border-border text-xs">
                            {(["all", "published", "draft"] as StatusFilter[]).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => handleStatus(s)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full capitalize transition-all",
                                        statusFilter === s ? "bg-card text-foreground font-medium shadow" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                        {/* View Toggle */}
                        <div className="flex bg-background/50 rounded-full p-1 border border-border">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all", viewMode === "grid" ? "bg-card text-foreground shadow" : "text-muted-foreground hover:text-foreground")}
                            >
                                <LayoutGrid size={15} />
                            </button>
                            <button
                                onClick={() => setViewMode("table")}
                                className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all", viewMode === "table" ? "bg-card text-foreground shadow" : "text-muted-foreground hover:text-foreground")}
                            >
                                <List size={15} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategory(cat)}
                            className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium transition-all border",
                                selectedCategory === cat
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-transparent text-muted-foreground border-border hover:border-sidebar-foreground/30 hover:text-foreground"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
                    <Loader2 size={36} className="animate-spin opacity-40" />
                    <p className="text-sm">Loading posts...</p>
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
                    <p className="text-lg font-medium text-destructive">Failed to load posts</p>
                    <p className="text-sm">Please try refreshing the page</p>
                </div>
            ) : displayed.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
                    <FileText size={40} className="opacity-30" />
                    <p className="text-lg font-medium">{total === 0 ? "No posts yet" : "No posts found"}</p>
                    <p className="text-sm">
                        {total === 0 ? "Create your first blog post to get started" : "Try adjusting your search or filters"}
                    </p>
                    {total === 0 && (
                        <Link
                            href="/dashboard/blog/new"
                            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                            <Plus size={16} /> New Post
                        </Link>
                    )}
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {displayed.map((post) => <BlogCard key={post.id} post={post} />)}
                </div>
            ) : (
                <BlogTable posts={displayed} />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between gap-4 mt-2">
                    <p className="text-xs text-muted-foreground">
                        Page {page} of {totalPages} · {total} posts
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1 || isLoading}
                            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-sidebar-foreground/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {/* Page number buttons — show up to 5 around current */}
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((item, idx) =>
                                    item === "..." ? (
                                        <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm">…</span>
                                    ) : (
                                        <button
                                            key={item}
                                            onClick={() => setPage(item as number)}
                                            disabled={isLoading}
                                            className={cn(
                                                "w-9 h-9 rounded-full text-sm font-medium transition-all",
                                                page === item
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                            )}
                                        >
                                            {item}
                                        </button>
                                    )
                                )}
                        </div>

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || isLoading}
                            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-sidebar-foreground/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Blog Card ---
function BlogCard({ post }: { post: BlogPost }) {
    return (
        <Link
            href={`/dashboard/blog/${post.slug}`}
            className="bg-card rounded-[24px] border border-border overflow-hidden group hover:border-sidebar-foreground/30 transition-all duration-300 flex flex-col"
        >
            <div className="relative h-44 overflow-hidden shrink-0 bg-zinc-800">
                {post.cover_image_url ? (
                    <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                        <FileText size={40} />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3">
                    <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        post.status === "published" ? "bg-primary text-primary-foreground" : "bg-zinc-700 text-zinc-300"
                    )}>
                        {post.status}
                    </span>
                </div>
                <div className="absolute top-3 right-3">
                    <button className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                        <MoreHorizontal size={14} />
                    </button>
                </div>
                {post.category && (
                    <div className="absolute bottom-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-black/50 backdrop-blur-sm text-white flex items-center gap-1">
                            <Tag size={10} /> {post.category}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-foreground text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
                    {post.excerpt || "No excerpt provided."}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-white">A</div>
                        <span className="text-xs text-muted-foreground">Author</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground mr-3">
                        <Eye size={11} />
                        {post.views}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar size={11} />
                        {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                </div>
            </div>
        </Link>
    );
}

// --- Blog Table ---
function BlogTable({ posts }: { posts: BlogPost[] }) {
    return (
        <div className="bg-card rounded-[24px] border border-border overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border">
                        <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Post</th>
                        <th className="text-left px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Category</th>
                        <th className="text-left px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Tags</th>
                        <th className="text-left px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Created</th>
                        <th className="text-left px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Views</th>
                        <th className="text-left px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-4 py-4"></th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post, i) => (
                        <tr
                            key={post.id}
                            onClick={() => window.location.href = `/dashboard/blog/${post.slug}`}
                            className={cn("border-b border-border hover:bg-muted/50 transition-colors cursor-pointer", i === posts.length - 1 && "border-b-0")}
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    {post.cover_image_url ? (
                                        <img src={post.cover_image_url} alt={post.title} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-muted-foreground/30 shrink-0">
                                            <FileText size={16} />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-foreground text-sm line-clamp-1">{post.title}</p>
                                        <p className="text-muted-foreground text-xs line-clamp-1 hidden sm:block">{post.excerpt}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-4 hidden md:table-cell">
                                {post.category && (
                                    <span className="px-2.5 py-1 rounded-full text-xs bg-background/50 border border-border text-muted-foreground whitespace-nowrap">
                                        {post.category}
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-4 hidden lg:table-cell">
                                <div className="flex flex-wrap gap-1">
                                    {post.tags?.slice(0, 2).map((tag) => (
                                        <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-background/50 border border-border text-muted-foreground">{tag}</span>
                                    ))}
                                    {(post.tags?.length ?? 0) > 2 && (
                                        <span className="text-[10px] text-muted-foreground">+{post.tags.length - 2}</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-4 hidden lg:table-cell text-muted-foreground text-xs whitespace-nowrap">
                                {new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </td>
                            <td className="px-4 py-4 hidden sm:table-cell text-muted-foreground text-xs">
                                <div className="flex items-center gap-1">
                                    <Eye size={14} className="opacity-70" />
                                    {post.views}
                                </div>
                            </td>
                            <td className="px-4 py-4">
                                <span className={cn(
                                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap",
                                    post.status === "published" ? "bg-primary/20 text-primary" : "bg-zinc-700/50 text-zinc-400"
                                )}>
                                    {post.status}
                                </span>
                            </td>
                            <td className="px-4 py-4">
                                <button className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                                    <MoreHorizontal size={15} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
