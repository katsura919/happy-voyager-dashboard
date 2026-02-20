import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if admin
    const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (roleData?.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const adminAuthClient = createAdminClient().auth.admin;
    const { data: usersData, error } = await adminAuthClient.listUsers();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: roles } = await supabase.from("user_roles").select("*");

    const teamMembers = usersData.users.map((u) => {
        const role = roles?.find((r) => r.id === u.id)?.role || "member";
        return {
            id: u.id,
            email: u.email,
            full_name: u.user_metadata?.full_name || "",
            role: role,
            created_at: u.created_at,
        };
    });

    return NextResponse.json(teamMembers);
}

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (roleData?.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { email, role } = await req.json();
        const adminClient = createAdminClient();
        const adminAuthClient = adminClient.auth.admin;

        const { data: inviteData, error: inviteError } = await adminAuthClient.inviteUserByEmail(email);

        if (inviteError) {
            return NextResponse.json({ error: inviteError.message }, { status: 400 });
        }

        if (inviteData?.user) {
            await adminClient.from("user_roles").upsert({
                id: inviteData.user.id,
                role: role || "member"
            });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}
