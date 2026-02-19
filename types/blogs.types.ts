export interface CreateBlogPostPayload {
    title: string;
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
    author_id: string;
    created_at: string;
    updated_at: string;
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