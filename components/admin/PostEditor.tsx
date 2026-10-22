"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  createPostAction,
  updatePostAction,
  deletePostAction,
  publishPostAction,
  unpublishPostAction,
} from "@/app/actions/blog";
import { slugify } from "@/lib/utils";
import TiptapEditor from "./TiptapEditor";
import { ArticleCodeEnhancer } from "@/components/ArticleCodeEnhancer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Eye,
  Loader2,
  Save,
  Send,
  Sparkles,
  Link as LinkIcon,
  HelpCircle,
  Upload,
  Trash2,
  Globe,
  EyeOff,
  Image as ImageIcon,
  CheckCircle2,
  X,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PostEditorProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string | null;
    status?: string;
    published: boolean;
    featured: boolean;
    categoryName?: string;
    tags?: string;
    metaTitle?: string | null;
    metaDescription?: string | null;
    canonicalUrl?: string | null;
    ogImage?: string | null;
  };
}

export default function PostEditor({ initialData }: PostEditorProps) {
  const router = useRouter();
  const [currentPostId, setCurrentPostId] = useState(initialData?.id);
  const isEditing = !!currentPostId;

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [autoSlug, setAutoSlug] = useState(!isEditing);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(
    initialData?.content ||
    `<h2>Introduction</h2><p>Write your technical article here using the rich text editor. You can format headings, lists, blockquotes, code blocks, and upload images directly to PostgreSQL.</p>`
  );
  const editorRef = useRef<any>(null);
  const contentRef = useRef<string>(content);
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [categoryName, setCategoryName] = useState(initialData?.categoryName || "");
  const [tags, setTags] = useState(initialData?.tags || "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "UNPUBLISHED">(
    (initialData?.status as any) || (initialData?.published ? "PUBLISHED" : "DRAFT")
  );
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonicalUrl || "");
  const [ogImage, setOgImage] = useState(initialData?.ogImage || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (autoSlug) {
      setSlug(slugify(val));
    }
  };

  const handleCopySlug = async () => {
    const fullUrl = `https://vishalsharma.dev/blog/${slug || slugify(title)}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedSlug(true);
      toast.success("Article link copied!");
      setTimeout(() => setCopiedSlug(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  // Upload cover image directly to PostgreSQL buffer
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("altText", `Cover image for ${title || "article"}`);
      if (initialData?.id) formData.append("postId", initialData.id);

      const res = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setCoverImage(data.url);
      if (!ogImage) setOgImage(data.url);
      toast.success("Cover image saved to PostgreSQL buffer!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload cover image.");
    } finally {
      setIsUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  // Save operation (Draft, Changes, or Publish)
  const handleSubmit = async (targetStatus?: "DRAFT" | "PUBLISHED" | "UNPUBLISHED") => {
    if (!title.trim()) {
      toast.error("Please enter an article title.");
      return;
    }

    // Always extract 100% fresh, real-time live HTML from the TipTap engine
    const liveContent = editorRef.current ? editorRef.current.getHTML() : (contentRef.current || content);
    const finalSlug = slug.trim() ? slugify(slug) : slugify(title);
    const plainText = liveContent.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const finalExcerpt = excerpt.trim() || plainText.slice(0, 150) || title.trim();

    if (!liveContent.trim() || liveContent === "<p></p>") {
      toast.error("Article content cannot be empty. Please write something.");
      return;
    }

    const nextStatus = targetStatus || status;
    const isPublished = nextStatus === "PUBLISHED";

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        slug: finalSlug,
        excerpt: finalExcerpt,
        content: liveContent,
        coverImage: coverImage.trim() || null,
        categoryName: categoryName.trim() || null,
        tags,
        status: nextStatus,
        published: isPublished,
        featured,
        metaTitle: metaTitle.trim() || title.trim(),
        metaDescription: metaDescription.trim() || finalExcerpt,
        canonicalUrl: canonicalUrl.trim() || null,
        ogImage: ogImage.trim() || coverImage.trim() || null,
      };

      if (currentPostId) {
        await updatePostAction(currentPostId, payload);
        setStatus(nextStatus);
        setSlug(finalSlug);
        setContent(liveContent);
        contentRef.current = liveContent;
        if (!excerpt.trim()) setExcerpt(finalExcerpt);
        toast.success(
          isPublished
            ? "Article published live! View it at /blog/" + finalSlug
            : "Article updated successfully in PostgreSQL!"
        );
      } else {
        const res = await createPostAction(payload);
        setCurrentPostId(res.id);
        setStatus(nextStatus);
        setSlug(res.slug || finalSlug);
        setContent(liveContent);
        contentRef.current = liveContent;
        if (!excerpt.trim()) setExcerpt(finalExcerpt);
        toast.success(
          isPublished
            ? "Article published live! View it at /blog/" + res.slug
            : "Article draft saved in PostgreSQL!"
        );
        window.history.replaceState(null, "", `/admin/posts/${res.id}/edit`);
      }

      router.refresh();
    } catch (err: any) {
      console.error("Error submitting post:", err);
      toast.error(err.message || "Failed to save article.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentPostId) return;
    if (!window.confirm(`Permanently delete "${title}" and all its content?`)) return;

    setIsSubmitting(true);
    try {
      await deletePostAction(currentPostId);
      toast.success("Article deleted.");
      router.push("/admin/posts");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete article.");
      setIsSubmitting(false);
    }
  };

  // Live SEO values for Google SERP Snippet Preview
  const displaySeoTitle = metaTitle.trim() || title.trim() || "Article Title Preview";
  const displaySeoDesc =
    metaDescription.trim() ||
    excerpt.trim() ||
    "A concise summary of this technical article as it will appear in search engine result pages.";
  const displaySeoSlug = slug.trim() || slugify(title) || "article-slug";

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-28">
      {/* Sleek Floating Glassmorphic Top Action Bar */}
      <div className="sticky top-20 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 rounded-2xl border border-border/80 bg-card/85 backdrop-blur-xl shadow-lg shadow-black/10 transition-all">
        <div className="flex items-center gap-3.5 min-w-0">
          <Link
            href="/admin/posts"
            className="p-2.5 rounded-xl border border-border/70 bg-background/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-xs shrink-0"
            title="Back to Articles"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg sm:text-xl font-black text-foreground tracking-tight truncate">
                {isEditing ? "Edit Article" : "Create New Article"}
              </h1>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border inline-flex items-center gap-1.5 ${
                  status === "PUBLISHED"
                    ? "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border-emerald-500/30"
                    : status === "UNPUBLISHED"
                    ? "bg-amber-500/15 text-amber-500 dark:text-amber-400 border-amber-500/30"
                    : "bg-blue-500/15 text-blue-500 dark:text-blue-400 border-blue-500/30"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    status === "PUBLISHED"
                      ? "bg-emerald-500 animate-pulse"
                      : status === "UNPUBLISHED"
                      ? "bg-amber-500"
                      : "bg-blue-500"
                  }`}
                />
                {status}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5 mt-0.5">
              <span>PostgreSQL buffer storage</span>
              <span>&bull;</span>
              <span>Tiptap WYSIWYG</span>
              <span>&bull;</span>
              <span>Instant sync</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto shrink-0">
          <Link href="/admin/posts">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              disabled={isSubmitting}
              className="rounded-xl text-xs text-muted-foreground hover:text-foreground font-semibold px-3 h-9"
            >
              Cancel
            </Button>
          </Link>

          {/* View Live Article (if published) */}
          {isEditing && status === "PUBLISHED" && (
            <Link href={`/blog/${slug}`} target="_blank">
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="gap-1.5 text-xs text-accent hover:border-accent hover:bg-accent/10 rounded-xl shadow-xs h-9 font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Live</span>
              </Button>
            </Link>
          )}

          {/* Preview Modal Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
            className="gap-1.5 rounded-xl shadow-xs border-border/80 bg-background/80 hover:bg-muted text-foreground text-xs font-semibold h-9"
          >
            <Eye className="w-3.5 h-3.5 text-accent" />
            <span>Preview</span>
          </Button>

          {/* Save Draft Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleSubmit("DRAFT")}
            className="gap-1.5 rounded-xl shadow-xs border-border/80 bg-background/80 hover:bg-muted text-foreground text-xs font-semibold h-9"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Draft</span>
          </Button>

          {/* Unpublish Button */}
          {isEditing && status === "PUBLISHED" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={() => handleSubmit("UNPUBLISHED")}
              className="gap-1.5 text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 border-amber-500/30 rounded-xl h-9 text-xs font-semibold"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Unpublish</span>
            </Button>
          )}

          {/* Primary Action Button (Publish / Update) */}
          <Button
            type="button"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleSubmit("PUBLISHED")}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md shadow-emerald-600/25 h-9 text-xs active:scale-95 transition-all"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>{status === "PUBLISHED" ? "Update Article" : "Publish to Public Blog"}</span>
          </Button>

          {/* Delete Button */}
          {isEditing && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isSubmitting}
              onClick={handleDelete}
              className="text-destructive hover:bg-destructive/15 rounded-xl h-9 w-9"
              title="Delete Article"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main 2-Column Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Content Canvas) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Article Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Article Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g. Architecting Scalable PostgreSQL Systems with Next.js"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="text-xl sm:text-2xl font-black py-6 rounded-xl border-border/80 bg-card/60 backdrop-blur-sm placeholder:text-muted-foreground/60 shadow-xs"
            />
          </div>

          {/* Slug Row with copyable preview */}
          <div className="p-4 rounded-xl border border-border/80 bg-card/50 backdrop-blur-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-accent" />
                <span>URL Slug *</span>
              </Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopySlug}
                  className="text-xs text-muted-foreground hover:text-accent flex items-center gap-1 font-mono transition-colors"
                >
                  {copiedSlug ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedSlug ? "Copied" : "Copy full URL"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAutoSlug(!autoSlug);
                    if (!autoSlug) setSlug(slugify(title));
                  }}
                  className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{autoSlug ? "Auto-syncing" : "Enable auto-slug"}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground px-3 py-2 bg-muted/60 rounded-lg border border-border/80 select-none">
                /blog/
              </span>
              <Input
                id="slug"
                placeholder="architecting-scalable-postgresql-systems"
                value={slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setSlug(e.target.value);
                }}
                className="font-mono text-xs rounded-lg border-border/80 bg-background/80"
              />
            </div>
          </div>

          {/* Excerpt / Summary with Character Counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="excerpt" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Article Summary / Excerpt *
              </Label>
              <span
                className={`text-[11px] font-mono ${excerpt.length > 160 ? "text-amber-500 font-semibold" : "text-muted-foreground"
                  }`}
              >
                {excerpt.length} / 160 chars (SEO recommended)
              </span>
            </div>
            <Textarea
              id="excerpt"
              rows={2}
              placeholder="A concise, compelling summary displayed on search results, article cards, and social share previews..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="text-xs sm:text-sm rounded-xl border-border/80 bg-card/60 backdrop-blur-sm leading-relaxed"
            />
          </div>

          {/* Tiptap Advanced Rich-Text Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Article Body (Tiptap Rich-Text Editor) *
              </Label>
              <span className="text-[11px] text-muted-foreground font-mono">
                Rich text &bull; Code blocks &bull; PostgreSQL image buffer
              </span>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm overflow-hidden shadow-sm">
              <TiptapEditor
                content={content}
                onChange={(newHtml) => {
                  setContent(newHtml);
                  contentRef.current = newHtml;
                }}
                postId={currentPostId}
                onEditorReady={(inst) => {
                  editorRef.current = inst;
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column (Metadata & Inspector Sidebar) */}
        <div className="space-y-6">
          {/* Cover / Featured Image Card */}
          <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-accent" />
                <span>Featured Cover Image</span>
              </h3>
            </div>

            {coverImage ? (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-border/80 aspect-video bg-muted/30 shadow-xs">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-xs"
                    title="Remove cover image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground truncate font-mono bg-muted/40 p-2 rounded-lg border border-border/60">
                  {coverImage}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-5 rounded-xl border border-dashed border-border/80 bg-muted/20 text-center space-y-2">
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                    id="cover-upload"
                  />
                  <label
                    htmlFor="cover-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground font-bold text-xs cursor-pointer hover:bg-accent/90 transition-all shadow-xs active:scale-95"
                  >
                    {isUploadingCover ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading to PostgreSQL...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from Device</span>
                      </>
                    )}
                  </label>
                  <p className="text-[10px] text-muted-foreground">
                    Stored as binary byte buffer in PostgreSQL. Max 10MB.
                  </p>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Or direct image URL</Label>
                  <Input
                    placeholder="https://..."
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="text-xs rounded-xl"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Taxonomy & Categorization Card */}
          <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Taxonomy &amp; Categorization
            </h3>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs font-semibold text-foreground">
                Category
              </Label>
              <Input
                id="category"
                placeholder="e.g. Next.js, PostgreSQL, TypeScript, Architecture"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="text-xs rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-xs font-semibold text-foreground">
                Tags (comma separated)
              </Label>
              <Input
                id="tags"
                placeholder="React, Next.js, Database, Architecture"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="text-xs rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground">Featured Article</span>
                <p className="text-[10px] text-muted-foreground">Pin to top of blog listing</p>
              </div>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-accent focus:ring-accent cursor-pointer"
              />
            </div>
          </div>

          {/* Live Google SERP & SEO Snippet Preview Card */}
          <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-accent" />
                <span>Search Engine Preview (SERP)</span>
              </h3>
            </div>

            {/* Google SERP Snippet Box */}
            <div className="p-4 rounded-xl border border-border/80 bg-background/80 space-y-1.5 select-none">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground truncate">
                <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center text-[9px] font-bold text-accent">
                  VS
                </div>
                <span className="truncate">vishalsharma.dev &rsaquo; blog &rsaquo; {displaySeoSlug}</span>
              </div>
              <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1 leading-snug">
                {displaySeoTitle}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {displaySeoDesc}
              </p>
            </div>

            {/* Custom SEO Inputs */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="metaTitle" className="text-xs font-semibold text-foreground">
                  Custom SEO Title
                </Label>
                <Input
                  id="metaTitle"
                  placeholder="Defaults to article title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="metaDescription" className="text-xs font-semibold text-foreground">
                  Custom SEO Description
                </Label>
                <Textarea
                  id="metaDescription"
                  rows={2}
                  placeholder="Defaults to excerpt"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="text-xs rounded-xl leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="canonicalUrl" className="text-xs font-semibold text-foreground">
                  Canonical URL (Optional)
                </Label>
                <Input
                  id="canonicalUrl"
                  placeholder="https://vishalsharma.dev/blog/..."
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  className="text-xs rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-accent" />
              <span>Article Public Layout Preview</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {coverImage && (
              <div className="rounded-2xl overflow-hidden aspect-video border border-border shadow-md">
                <img src={coverImage} alt={title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-3">
              {categoryName && (
                <span className="px-3 py-1 rounded-full bg-accent/15 text-accent font-semibold text-xs border border-accent/20">
                  {categoryName}
                </span>
              )}
              <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground">
                {title || "Untitled Article"}
              </h1>
              <p className="text-base text-muted-foreground italic border-l-2 border-accent pl-3">
                {excerpt}
              </p>
            </div>

            <hr className="border-border/60" />

            <ArticleCodeEnhancer>
              <div
                className="max-w-none text-foreground leading-relaxed tiptap-rendered-content blog-content-body"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </ArticleCodeEnhancer>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
