import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabaseClient() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                },
            },
        }
    );
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await getSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status"); // 'draft' | 'published' | null (all)
        const search = searchParams.get("search");

        let query = supabase
            .from("blog_posts")
            .select("*")
            .eq("author_id", user.id)
            .order("created_at", { ascending: false });

        if (status === "draft" || status === "published") {
            query = query.eq("status", status);
        }

        if (search) {
            query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ posts: data });
    } catch (error) {
        console.error("Blog fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await getSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, excerpt, content, cover_image_url, category, tags, status, publish_date } = body;

        if (!title?.trim()) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("blog_posts")
            .insert({
                title: title.trim(),
                excerpt: excerpt?.trim() ?? "",
                content: content ?? "",
                cover_image_url: cover_image_url ?? "",
                category: category ?? "",
                tags: tags ?? [],
                status: status ?? "draft",
                publish_date: publish_date ?? null,
                author_id: user.id,
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ post: data }, { status: 201 });
    } catch (error) {
        console.error("Blog create error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
