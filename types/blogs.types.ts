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