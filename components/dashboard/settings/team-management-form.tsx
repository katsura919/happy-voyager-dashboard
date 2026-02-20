"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Mail,
  Shield,
  UserPlus,
  Users,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [inviteSent, setInviteSent] = useState(false);

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

      toast.success("Invite sent successfully!");
      setInviteSent(true);
      await fetchMembers();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsInviting(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setRole("member");
    setInviteSent(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Users size={16} className="text-primary" />
            Team Members
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Manage who has access to your dashboard.
          </p>
        </div>

        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-[14px] bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              <UserPlus size={16} />
              Add Member
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md border-white/10 bg-card rounded-[24px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground">
                <UserPlus size={18} className="text-primary" />
                {inviteSent ? "Invite Sent!" : "Invite New Member"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                {inviteSent
                  ? "An invite email has been sent. They will be prompted to set their password."
                  : "Send an invite email so your colleague can create their account and set a password."}
              </DialogDescription>
            </DialogHeader>

            {!inviteSent ? (
              <form
                onSubmit={handleInvite}
                className="flex flex-col gap-4 mt-4"
              >
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      placeholder="colleague@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-white/10 rounded-[14px] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Role
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="w-full relative flex items-center justify-between px-10 py-2.5 bg-background border border-white/10 rounded-[14px] text-sm text-foreground focus:outline-none focus:border-primary/40 transition-colors"
                      >
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Shield size={16} />
                        </div>
                        <span className="capitalize">{role}</span>
                        <ChevronDown
                          size={14}
                          className="text-muted-foreground opacity-50 absolute right-3"
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[200px] border-white/10 bg-card rounded-[14px] p-1 shadow-lg">
                      <DropdownMenuItem
                        onClick={() => setRole("member")}
                        className="px-3 py-2 text-sm text-foreground cursor-pointer focus:bg-white/5 data-[highlighted]:bg-white/5 rounded-[10px]"
                      >
                        Member
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setRole("admin")}
                        className="px-3 py-2 text-sm text-foreground cursor-pointer focus:bg-white/5 data-[highlighted]:bg-white/5 rounded-[10px]"
                      >
                        Admin
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <button
                  type="submit"
                  disabled={isInviting}
                  className={cn(
                    "w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-[14px] text-sm font-semibold transition-all",
                    isInviting
                      ? "bg-primary/50 text-primary-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:opacity-90",
                  )}
                >
                  {isInviting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Send Invite"
                  )}
                </button>
              </form>
            ) : (
              <div className="mt-4 p-5 bg-green-500/10 border border-green-500/20 rounded-[16px] space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Invite sent to
                  </p>
                  <p className="font-medium text-sm text-foreground">{email}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  They will receive an email with a link to accept the invite
                  and set their password.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-[14px] bg-white/10 text-foreground hover:bg-white/15 text-sm font-semibold transition-all"
                >
                  Done
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Members List */}
      <div className="rounded-[20px] border border-white/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-background/40">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                User
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-32">
                Role
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-40">
                Joined
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableCell colSpan={3} className="h-32 text-center">
                  <Loader2
                    size={24}
                    className="mx-auto animate-spin text-muted-foreground opacity-40"
                  />
                </TableCell>
              </TableRow>
            ) : members.length === 0 ? (
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableCell
                  colSpan={3}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  No team members found.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow
                  key={member.id}
                  className="border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {member.full_name?.[0]?.toUpperCase() ||
                          member.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">
                          {member.full_name || "No Name"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        member.role === "admin"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-white/5 text-muted-foreground border-white/10",
                      )}
                    >
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
