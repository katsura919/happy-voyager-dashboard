

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function DashboardAuthCheck() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return null;
}
