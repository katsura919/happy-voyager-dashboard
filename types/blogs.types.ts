export interface CreateBlogPostPayload {
    title: string;
    slug?: string | null;
    excerpt: string;
    content: string;
    cover_image_url: string;
    category: string;
    tags: string[];
    status: "draft" | "published";
    publish_date: string | null;
}

export interface BlogPost extends CreateBlogPostPayload {
    id: string;
    slug: string | null;
    author_id: string;
    created_at: string;
    updated_at: string;
    views: number;
}

export interface UpdateBlogPostPayload extends CreateBlogPostPayload {
    id: string;
}


export interface FetchBlogPostsParams {
    status?: "draft" | "published";
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedBlogResponse {
    posts: BlogPost[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface BlogComment {
    id: string;
    blog_id: string;
    author_name: string;
    author_email?: string;
    content: string;
    status: 'pending' | 'approved' | 'spam';
    created_at: string;
}

export interface CreateCommentPayload {
    blog_id: string;
    author_name: string;
    author_email?: string;
    content: string;
}