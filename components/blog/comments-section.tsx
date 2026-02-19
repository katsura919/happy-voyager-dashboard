"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBlogComments, updateBlogCommentStatus, deleteBlogComment } from "@/hooks/blog";
import { Loader2, Check, X, Trash2, MessageSquare, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CommentsSectionProps {
    blogId: string;
}

export function CommentsSection({ blogId }: CommentsSectionProps) {
    const queryClient = useQueryClient();

    const { data: comments, isLoading, isError } = useQuery({
        queryKey: ["blog-comments", blogId],
        queryFn: () => fetchBlogComments(blogId),
    });

    const { mutate: updateStatus, isPending: isUpdating } = useMutation({
        mutationFn: ({ id, status }: { id: string; status: "approved" | "spam" | "pending" }) =>
            updateBlogCommentStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog-comments", blogId] });
            toast.success("Comment status updated");
        },
        onError: (err) => toast.error(err.message),
    });

    const { mutate: deleteComment, isPending: isDeleting } = useMutation({
        mutationFn: deleteBlogComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog-comments", blogId] });
            toast.success("Comment deleted");
        },
        onError: (err) => toast.error(err.message),
    });

    if (isLoading) return <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>;
    if (isError) return <div className="py-10 text-center text-destructive">Failed to load comments</div>;

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
                <MessageSquare size={18} />
                Comments ({comments?.length || 0})
            </h3>

            <div className="flex flex-col gap-3">
                {comments?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-xl">
                        No comments yet
                    </div>
                ) : (
                    comments?.map((comment) => (
                        <div key={comment.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-sm">{comment.author_name}</span>
                                        {comment.author_email && (
                                            <span className="text-xs text-muted-foreground">({comment.author_email})</span>
                                        )}
                                        <span className="text-xs text-muted-foreground ml-auto">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground/90 leading-relaxed">{comment.content}</p>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    {comment.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => updateStatus({ id: comment.id, status: "approved" })}
                                                disabled={isUpdating}
                                                className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500/20 flex items-center justify-center transition-colors"
                                                title="Approve"
                                            >
                                                <Check size={14} />
                                            </button>
                                            <button
                                                onClick={() => updateStatus({ id: comment.id, status: "spam" })}
                                                disabled={isUpdating}
                                                className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 flex items-center justify-center transition-colors"
                                                title="Mark as Spam"
                                            >
                                                <AlertCircle size={14} />
                                            </button>
                                        </>
                                    )}
                                    {comment.status === "approved" && (
                                        <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase rounded-full">Approved</span>
                                    )}
                                    {comment.status === "spam" && (
                                        <span className="px-2 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase rounded-full">Spam</span>
                                    )}

                                    <button
                                        onClick={() => deleteComment(comment.id)}
                                        disabled={isDeleting}
                                        className="w-8 h-8 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center justify-center transition-colors ml-2"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
