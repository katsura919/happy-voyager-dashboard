import { CreateBlogPostPayload, BlogPost } from "@/types/blogs.types";

/**
 * Create a new blog post via the API route.
 */
export async function createBlogPost(payload: CreateBlogPostPayload): Promise<BlogPost> {
    const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error ?? "Failed to create blog post");
    }

    const data = await response.json();
    return data.post as BlogPost;
}

export interface FetchBlogPostsParams {
    status?: "draft" | "published";
    search?: string;
}

/**
 * Fetch blog posts for the current user.
 */
export async function fetchBlogPosts(params?: FetchBlogPostsParams): Promise<BlogPost[]> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set("status", params.status);
    if (params?.search) searchParams.set("search", params.search);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";

    const response = await fetch(`/api/blog${query}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error ?? "Failed to fetch blog posts");
    }

    const data = await response.json();
    return data.posts as BlogPost[];
}

