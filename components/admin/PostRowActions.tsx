"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  togglePublishAction,
  deletePostAction,
  publishPostAction,
  unpublishPostAction,
} from "@/app/actions/blog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Pencil,
  ExternalLink,
  Trash2,
  Globe,
  EyeOff,
  Loader2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

interface PostRowActionsProps {
  post: {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    status?: string;
  };
}

export default function PostRowActions({ post }: PostRowActionsProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handlePublish = async () => {
    setIsPending(true);
    try {
      await publishPostAction(post.id);
      toast.success(`"${post.title}" is now PUBLISHED live!`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to publish post.");
    } finally {
      setIsPending(false);
    }
  };

  const handleUnpublish = async () => {
    setIsPending(true);
    try {
      await unpublishPostAction(post.id);
      toast.success(`"${post.title}" was UNPUBLISHED.`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to unpublish post.");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete "${post.title}"?`)) {
      return;
    }

    setIsPending(true);
    try {
      await deletePostAction(post.id);
      toast.success("Article deleted successfully.");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete post.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Edit Link */}
      <Link href={`/admin/posts/${post.id}/edit`}>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1">
          <Pencil className="w-3.5 h-3.5" />
          <span>Edit</span>
        </Button>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isPending}>
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MoreVertical className="w-4 h-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {post.published ? (
            <DropdownMenuItem onClick={handleUnpublish} className="gap-2 text-xs cursor-pointer text-amber-500">
              <EyeOff className="w-4 h-4" />
              <span>Unpublish Post</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handlePublish} className="gap-2 text-xs cursor-pointer text-emerald-500">
              <Globe className="w-4 h-4" />
              <span>Publish Live</span>
            </DropdownMenuItem>
          )}

          {post.published && (
            <DropdownMenuItem asChild>
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                className="gap-2 text-xs flex items-center cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                <span>View Public Article</span>
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleDelete}
            className="gap-2 text-xs text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Article</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
