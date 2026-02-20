"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, Shield, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TeamMember {
    id: string;
    email: string;
    full_name: string;
    role: "admin" | "member";
    created_at: string;
}

export function TeamManagementForm() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInviting, setIsInviting] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<"admin" | "member">("member");

    const fetchMembers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/team");
            if (!res.ok) throw new Error("Failed to fetch team members");
            const data = await res.json();
            setMembers(data);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsInviting(true);
        try {
            const res = await fetch("/api/team", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, role }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to invite member");

            toast.success("Invitation sent successfully!");
            setEmail("");
            setRole("member");
            await fetchMembers();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsInviting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Add Member Form */}
            <div className="p-6 bg-background/40 rounded-[20px] border border-white/5 space-y-4">
                <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <UserPlus size={16} className="text-primary" />
                        Invite New Member
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">Send an invitation email to add a new member to your team.</p>
                </div>

                <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Mail size={16} />
                        </div>
                        <input
                            type="email"
                            placeholder="colleague@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-white/10 rounded-[14px] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
                        />
                    </div>

                    <div className="relative sm:w-40 shrink-0">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Shield size={16} />
                        </div>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as "admin" | "member")}
                            className="w-full pl-10 pr-8 py-2.5 bg-background/50 border border-white/10 rounded-[14px] text-sm text-foreground appearance-none focus:outline-none focus:border-primary/40 transition-colors cursor-pointer"
                        >
                            <option value="member" className="bg-card text-foreground">Member</option>
                            <option value="admin" className="bg-card text-foreground">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isInviting || !email}
                        className={cn(
                            "inline-flex shrink-0 items-center justify-center gap-2 px-6 py-2.5 rounded-[14px] text-sm font-semibold transition-all",
                            isInviting || !email
                                ? "bg-primary/50 text-primary-foreground cursor-not-allowed"
                                : "bg-primary text-primary-foreground hover:opacity-90"
                        )}
                    >
                        {isInviting ? <Loader2 size={16} className="animate-spin" /> : "Send Invite"}
                    </button>
                </form>
            </div>

            {/* Members List */}
            <div className="rounded-[20px] border border-white/5 overflow-hidden">
                <Table>
                    <TableHeader className="bg-background/40">
                        <TableRow className="border-white/5 hover:bg-transparent">
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-32">Role</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-40">Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableCell colSpan={3} className="h-32 text-center">
                                    <Loader2 size={24} className="mx-auto animate-spin text-muted-foreground opacity-40" />
                                </TableCell>
                            </TableRow>
                        ) : members.length === 0 ? (
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableCell colSpan={3} className="h-32 text-center text-sm text-muted-foreground">
                                    No team members found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            members.map((member) => (
                                <TableRow key={member.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                                {member.full_name?.[0]?.toUpperCase() || member.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-foreground">
                                                    {member.full_name || "Pending Invite"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{member.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                            member.role === "admin"
                                                ? "bg-primary/10 text-primary border-primary/20"
                                                : "bg-white/5 text-muted-foreground border-white/10"
                                        )}>
                                            {member.role === "admin" ? "Admin" : "Member"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(member.created_at).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
