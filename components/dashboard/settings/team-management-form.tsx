"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Mail,
  Shield,
  UserPlus,
  Users,
  ChevronDown,
  Copy,
  Check,
  Trash2,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

  const [generatedPassword, setGeneratedPassword] = useState<string | null>(
    null,
  );
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [copiedBoth, setCopiedBoth] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

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

      if (!res.ok) throw new Error(data.error || "Failed to create member");

      toast.success("Member created successfully!");
      setGeneratedPassword(data.password);
      await fetchMembers();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsInviting(false);
    }
  };

  const copyToClipboard = async (
    text: string,
    setter: (v: boolean) => void,
  ) => {
    await navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const resetForm = () => {
    setEmail("");
    setRole("member");
    setGeneratedPassword(null);
    setCopiedEmail(false);
    setCopiedPassword(false);
    setCopiedBoth(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch("/api/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete member");
      toast.success("Member removed successfully.");
      await fetchMembers();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRoleChange = async (id: string, newRole: "admin" | "member") => {
    setUpdatingRoleId(id);
    try {
      const res = await fetch("/api/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");
      toast.success("Role updated successfully.");
      await fetchMembers();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUpdatingRoleId(null);
    }
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
                {generatedPassword ? "Member Created!" : "Add New Member"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                {generatedPassword
                  ? "Share these credentials with your new team member."
                  : "Create an account and generate a temporary password for your colleague."}
              </DialogDescription>
            </DialogHeader>

            {!generatedPassword ? (
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
                    "Create Member"
                  )}
                </button>
              </form>
            ) : (
              <div className="mt-4 space-y-3">
                {/* Email row */}
                <div className="flex items-center gap-2 p-3 bg-background border border-white/10 rounded-[14px]">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                      Email
                    </p>
                    <p className="text-sm font-mono text-foreground truncate">
                      {email}
                    </p>
                  </div>
                </div>

                {/* Password row */}
                <div className="flex items-center gap-2 p-3 bg-background border border-white/10 rounded-[14px]">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                      Temporary Password
                    </p>
                    <p className="text-sm font-mono text-foreground truncate select-all">
                      {generatedPassword}
                    </p>
                  </div>
                </div>

                {/* Copy both */}
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      `Email: ${email}\nPassword: ${generatedPassword}`,
                      setCopiedBoth,
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[14px] bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold text-foreground transition-colors"
                >
                  {copiedBoth ? (
                    <Check size={14} className="text-green-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                  {copiedBoth ? "Copied!" : "Copy"}
                </button>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-[14px] bg-primary text-primary-foreground hover:opacity-90 text-sm font-semibold transition-all"
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
              <TableHead className="w-12" />
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
                  colSpan={4}
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          disabled={updatingRoleId === member.id}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-opacity hover:opacity-80 disabled:opacity-40",
                            member.role === "admin"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-white/5 text-muted-foreground border-white/10",
                          )}
                        >
                          {updatingRoleId === member.id ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <ChevronDown size={10} className="opacity-60" />
                          )}
                          {member.role === "admin" ? "Admin" : "Member"}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="min-w-[130px] border-white/10 bg-card rounded-[14px] p-1 shadow-lg">
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(member.id, "member")}
                          disabled={member.role === "member"}
                          className="px-3 py-2 text-sm text-foreground cursor-pointer focus:bg-white/5 data-[highlighted]:bg-white/5 rounded-[10px] disabled:opacity-40"
                        >
                          Member
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(member.id, "admin")}
                          disabled={member.role === "admin"}
                          className="px-3 py-2 text-sm text-foreground cursor-pointer focus:bg-white/5 data-[highlighted]:bg-white/5 rounded-[10px] disabled:opacity-40"
                        >
                          Admin
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(member.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          disabled={deletingId === member.id}
                          className="p-1.5 rounded-[8px] text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                          title="Remove member"
                        >
                          {deletingId === member.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="border-white/10 bg-card rounded-[20px]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-foreground">
                            Remove team member?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground">
                            This will permanently delete{" "}
                            <span className="font-medium text-foreground">
                              {member.full_name || member.email}
                            </span>{" "}
                            and revoke their access. This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-[12px] border-white/10 bg-white/5 hover:bg-white/10 text-foreground">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(member.id)}
                            className="rounded-[12px] bg-red-500 hover:bg-red-600 text-white"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
