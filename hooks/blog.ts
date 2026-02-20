import { createClient } from "@/lib/supabase/client";
import {
    CreateBlogPostPayload,
    UpdateBlogPostPayload,
    BlogPost,
    FetchBlogPostsParams,
    PaginatedBlogResponse,
    BlogComment,
    CreateCommentPayload
} from "@/types/blogs.types";


function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
}

/**
 * Fetch paginated blog posts directly from Supabase (no API route needed).
 */
export async function fetchBlogPosts(params?: FetchBlogPostsParams): Promise<PaginatedBlogResponse> {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const page = Math.max(1, params?.page ?? 1);
    const limit = Math.min(50, Math.max(1, params?.limit ?? 6));
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from("blog_posts")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

    if (params?.status === "draft" || params?.status === "published") {
        query = query.eq("status", params.status);
    }

    if (params?.category) {
        query = query.eq("category", params.category);
    }

    if (params?.search) {
        query = query.or(`title.ilike.%${params.search}%,excerpt.ilike.%${params.search}%`);
    }

    // Apply pagination last so count reflects filtered results
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw new Error(error.message);

    const total = count ?? 0;
    return {
        posts: (data ?? []) as BlogPost[],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
}

/**
 * Fetch a single blog post by slug directly from Supabase.
 */
export async function getBlogPost(slug: string): Promise<BlogPost> {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) throw new Error(error.message);
    return data as BlogPost;
}

/**
 * Increment the view count for a blog post.
 */
export async function incrementBlogViews(id: string): Promise<void> {
    const supabase = createClient();
    await supabase.rpc('increment_blog_views', { blog_id: id });
}

/**
 * Fetch comments for a blog post.
 */
export async function fetchBlogComments(blogId: string): Promise<BlogComment[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('blog_id', blogId)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as BlogComment[];
}

/**
 * Create a new comment.
 */
export async function createBlogComment(payload: CreateCommentPayload): Promise<BlogComment> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('blog_comments')
        .insert({
            blog_id: payload.blog_id,
            author_name: payload.author_name,
            author_email: payload.author_email,
            content: payload.content,
        })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data as BlogComment;
}

/**
 * Update a comment's status (approve/spam/pending).
 */
export async function updateBlogCommentStatus(commentId: string, status: 'pending' | 'approved' | 'spam'): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
        .from('blog_comments')
        .update({ status })
        .eq('id', commentId);

    if (error) throw new Error(error.message);
}

/**
 * Delete a comment.
 */
export async function deleteBlogComment(commentId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId);

    if (error) throw new Error(error.message);
}

/**
 * Update an existing blog post directly via Supabase.
 */
export async function updateBlogPost({ id, ...payload }: UpdateBlogPostPayload): Promise<BlogPost> {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    if (!payload.title?.trim()) throw new Error("Title is required");

    const { data, error } = await supabase
        .from("blog_posts")
        .update({
            title: payload.title.trim(),
            slug: payload.slug ?? slugify(payload.title),
            excerpt: payload.excerpt?.trim() ?? "",
            content: payload.content ?? "",
            cover_image_url: payload.cover_image_url ?? "",
            category: payload.category ?? "",
            tags: payload.tags ?? [],
            status: payload.status ?? "draft",
            publish_date: payload.publish_date ?? null,
        })
        .eq("id", id)
        .eq("author_id", user.id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data as BlogPost;
}

/**
 * Create a new blog post directly via Supabase (no API route needed).
 */
export async function createBlogPost(payload: CreateBlogPostPayload): Promise<BlogPost> {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    if (!payload.title?.trim()) throw new Error("Title is required");

    const { data, error } = await supabase
        .from("blog_posts")
        .insert({
            title: payload.title.trim(),
            excerpt: payload.excerpt?.trim() ?? "",
            content: payload.content ?? "",
            cover_image_url: payload.cover_image_url ?? "",
            category: payload.category ?? "",
            tags: payload.tags ?? [],
            status: payload.status ?? "draft",
            publish_date: payload.publish_date ?? null,
            author_id: user.id,
            slug: payload.slug ?? slugify(payload.title),
        })
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data as BlogPost;
}

/**
 * Delete a blog post.
 */
export async function deleteBlogPost(id: string): Promise<void> {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id)
        .eq("author_id", user.id);

    if (error) throw new Error(error.message);
}
