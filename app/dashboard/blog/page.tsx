"use client";

import { useState, useMemo } from "react";
import { Search, LayoutGrid, List, Plus, Calendar, Eye, Heart, MoreHorizontal, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Dummy Data ---
const DUMMY_BLOGS = [
    {
        id: "1",
        title: "10 Tips for a Stress-Free Vacation",
        excerpt: "Planning a vacation can be overwhelming. Here are our top tips to make your next trip smooth and enjoyable from start to finish.",
        category: "Travel Tips",
        status: "published",
        author: "Jane Doe",
        date: "2026-02-10",
        views: 1240,
        likes: 87,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
        tags: ["travel", "tips", "vacation"],
    },
    {
        id: "2",
        title: "Best Hidden Gems in Southeast Asia",
        excerpt: "Discover the lesser-known destinations in Southeast Asia that will take your breath away without the tourist crowds.",
        category: "Destinations",
        status: "published",
        author: "John Smith",
        date: "2026-02-08",
        views: 3560,
        likes: 214,
        image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80",
        tags: ["asia", "hidden gems", "adventure"],
    },
    {
        id: "3",
        title: "How to Pack Light for a 2-Week Trip",
        excerpt: "Master the art of minimalist packing with our comprehensive guide. Never pay for checked baggage again.",
        category: "Travel Tips",
        status: "draft",
        author: "Jane Doe",
        date: "2026-02-05",
        views: 0,
        likes: 0,
        image: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=400&q=80",
        tags: ["packing", "tips", "minimalist"],
    },
    {
        id: "4",
        title: "A Food Lover's Guide to Italy",
        excerpt: "From Neapolitan pizza to Sicilian arancini, explore the incredible culinary landscape of Italy region by region.",
        category: "Food & Culture",
        status: "published",
        author: "Maria Rossi",
        date: "2026-02-01",
        views: 2890,
        likes: 176,
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
        tags: ["food", "italy", "culture"],
    },
    {
        id: "5",
        title: "Budget Travel: Europe Under $50/Day",
        excerpt: "Yes, it's possible! We break down how to experience Europe's best cities without breaking the bank.",
        category: "Budget Travel",
        status: "published",
        author: "Alex Turner",
        date: "2026-01-28",
        views: 5120,
        likes: 342,
        image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80",
        tags: ["budget", "europe", "backpacking"],
    },
    {
        id: "6",
        title: "The Ultimate Guide to Solo Travel Safety",
        excerpt: "Solo travel is incredibly rewarding. Learn the essential safety tips every solo traveler should know.",
        category: "Safety",
        status: "published",
        author: "Sarah Lee",
        date: "2026-01-22",
        views: 4300,
        likes: 289,
        image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400&q=80",
        tags: ["solo", "safety", "tips"],
    },
    {
        id: "7",
        title: "Top 5 Luxury Resorts in the Maldives",
        excerpt: "Indulge in paradise. We review the most stunning overwater bungalows and luxury resorts the Maldives has to offer.",
        category: "Luxury",
        status: "published",
        author: "John Smith",
        date: "2026-01-18",
        views: 6780,
        likes: 415,
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80",
        tags: ["luxury", "maldives", "resort"],
    },
    {
        id: "8",
        title: "Family Travel: Making Memories in Japan",
        excerpt: "Japan is one of the most family-friendly destinations in the world. Here's how to plan the perfect trip with kids.",
        category: "Family Travel",
        status: "draft",
        author: "Maria Rossi",
        date: "2026-01-15",
        views: 0,
        likes: 0,
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80",
        tags: ["family", "japan", "kids"],
    },
    {
        id: "9",
        title: "Eco-Tourism: Travel Responsibly",
        excerpt: "Learn how to minimize your environmental footprint while still exploring the world's most beautiful places.",
        category: "Eco Travel",
        status: "published",
        author: "Alex Turner",
        date: "2026-01-10",
        views: 1980,
        likes: 143,
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
        tags: ["eco", "sustainable", "nature"],
    },
    {
        id: "10",
        title: "Digital Nomad Hotspots for 2026",
        excerpt: "The best cities around the world for remote workers, ranked by cost of living, internet speed, and community.",
        category: "Digital Nomad",
        status: "published",
        author: "Sarah Lee",
        date: "2026-01-05",
        views: 7890,
        likes: 521,
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80",
        tags: ["remote work", "nomad", "2026"],
    },
    {
        id: "11",
        title: "Road Trip Essentials: What to Pack",
        excerpt: "From snacks to emergency kits, here's everything you need to make your road trip comfortable and safe.",
        category: "Travel Tips",
        status: "published",
        author: "Jane Doe",
        date: "2025-12-28",
        views: 2340,
        likes: 167,
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80",
        tags: ["road trip", "packing", "car"],
    },
    {
        id: "12",
        title: "Cruise Vacation: Pros and Cons",
        excerpt: "Thinking about a cruise? We give you an honest breakdown of what to expect so you can decide if it's right for you.",
        category: "Cruises",
        status: "draft",
        author: "John Smith",
        date: "2025-12-20",
        views: 0,
        likes: 0,
        image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=400&q=80",
        tags: ["cruise", "ocean", "vacation"],
    },
];

const ITEMS_PER_PAGE = 6;
const CATEGORIES = ["All", "Travel Tips", "Destinations", "Food & Culture", "Budget Travel", "Safety", "Luxury", "Family Travel", "Eco Travel", "Digital Nomad", "Cruises"];

type ViewMode = "grid" | "table";
type StatusFilter = "all" | "published" | "draft";

export default function BlogPage() {
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const filtered = useMemo(() => {
        return DUMMY_BLOGS.filter((blog) => {
            const matchesSearch =
                blog.title.toLowerCase().includes(search.toLowerCase()) ||
                blog.excerpt.toLowerCase().includes(search.toLowerCase()) ||
                blog.author.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
            const matchesStatus = statusFilter === "all" || blog.status === statusFilter;
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [search, selectedCategory, statusFilter]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleSearch = (val: string) => {
        setSearch(val);
        setCurrentPage(1);
    };

    const handleCategory = (cat: string) => {
        setSelectedCategory(cat);
        setCurrentPage(1);
    };

    const handleStatus = (s: StatusFilter) => {
        setStatusFilter(s);
        setCurrentPage(1);
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground uppercase">Blog Posts</h1>
                    <p className="text-muted-foreground text-sm mt-1">{filtered.length} posts found</p>
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
            <div className="bg-card rounded-[24px] p-4 border border-white/5 flex flex-col gap-4">
                {/* Search + View Toggle */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-white/10 rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Status Filter */}
                        <div className="flex bg-background/50 rounded-full p-1 border border-white/10 text-xs">
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
                        <div className="flex bg-background/50 rounded-full p-1 border border-white/10">
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
                                    : "bg-transparent text-muted-foreground border-white/10 hover:border-white/30 hover:text-foreground"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {paginated.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
                    <Search size={40} className="opacity-30" />
                    <p className="text-lg font-medium">No posts found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {paginated.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            ) : (
                <BlogTable blogs={paginated} />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-2">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-full text-sm border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        Previous
                    </button>
                    <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={cn(
                                    "w-9 h-9 rounded-full text-sm font-medium transition-all",
                                    currentPage === page
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                )}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-full text-sm border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

// --- Blog Card Component ---
function BlogCard({ blog }: { blog: typeof DUMMY_BLOGS[0] }) {
    return (
        <div className="bg-card rounded-[24px] border border-white/5 overflow-hidden group hover:border-white/15 transition-all duration-300 flex flex-col">
            {/* Image */}
            <div className="relative h-44 overflow-hidden shrink-0">
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        blog.status === "published" ? "bg-primary text-primary-foreground" : "bg-zinc-700 text-zinc-300"
                    )}>
                        {blog.status}
                    </span>
                </div>
                <div className="absolute top-3 right-3">
                    <button className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                        <MoreHorizontal size={14} />
                    </button>
                </div>
                <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-black/50 backdrop-blur-sm text-white flex items-center gap-1">
                        <Tag size={10} />
                        {blog.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-foreground text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {blog.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
                    {blog.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-white">
                            {blog.author.charAt(0)}
                        </div>
                        <span className="text-xs text-muted-foreground">{blog.author}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye size={11} />{blog.views.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Heart size={11} />{blog.likes}</span>
                        <span className="flex items-center gap-1"><Calendar size={11} />{new Date(blog.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Blog Table Component ---
function BlogTable({ blogs }: { blogs: typeof DUMMY_BLOGS }) {
    return (
        <div className="bg-card rounded-[24px] border border-white/5 overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-white/5">
                        <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Post</th>
                        <th className="text-left px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Category</th>
                        <th className="text-left px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Author</th>
                        <th className="text-left px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Date</th>
                        <th className="text-left px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Stats</th>
                        <th className="text-left px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-4 py-4"></th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((blog, i) => (
                        <tr key={blog.id} className={cn("border-b border-white/5 hover:bg-white/2 transition-colors", i === blogs.length - 1 && "border-b-0")}>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src={blog.image} alt={blog.title} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                                    <div>
                                        <p className="font-semibold text-foreground text-sm line-clamp-1">{blog.title}</p>
                                        <p className="text-muted-foreground text-xs line-clamp-1 hidden sm:block">{blog.excerpt}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-4 hidden md:table-cell">
                                <span className="px-2.5 py-1 rounded-full text-xs bg-background/50 border border-white/10 text-muted-foreground whitespace-nowrap">
                                    {blog.category}
                                </span>
                            </td>
                            <td className="px-4 py-4 hidden lg:table-cell">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                        {blog.author.charAt(0)}
                                    </div>
                                    <span className="text-muted-foreground text-xs whitespace-nowrap">{blog.author}</span>
                                </div>
                            </td>
                            <td className="px-4 py-4 hidden lg:table-cell text-muted-foreground text-xs whitespace-nowrap">
                                {new Date(blog.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </td>
                            <td className="px-4 py-4 hidden md:table-cell">
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><Eye size={11} />{blog.views.toLocaleString()}</span>
                                    <span className="flex items-center gap-1"><Heart size={11} />{blog.likes}</span>
                                </div>
                            </td>
                            <td className="px-4 py-4">
                                <span className={cn(
                                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap",
                                    blog.status === "published" ? "bg-primary/20 text-primary" : "bg-zinc-700/50 text-zinc-400"
                                )}>
                                    {blog.status}
                                </span>
                            </td>
                            <td className="px-4 py-4">
                                <button className="w-7 h-7 rounded-full hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
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
