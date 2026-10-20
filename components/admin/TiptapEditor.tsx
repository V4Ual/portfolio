"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Code,
  FileCode,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Minus,
  Undo2,
  Redo2,
  RemoveFormatting,
  Maximize2,
  Minimize2,
  Upload,
  Loader2,
  Check,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  postId?: string;
}

export default function TiptapEditor({ content, onChange, postId }: TiptapEditorProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageAlt, setImageAlt] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-accent underline font-semibold hover:text-accent/80",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-xl border border-border my-6 max-w-full h-auto shadow-md",
        },
      }),
      Placeholder.configure({
        placeholder: "Write your technical article, insert code blocks, drag & upload images...",
      }),
      TextStyle,
      Color,
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[420px] p-6 text-foreground text-base leading-relaxed selection:bg-accent/30",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Sync content when initial data changes
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  if (!editor) return null;

  // Handle local image file upload directly to PostgreSQL
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("altText", imageAlt || file.name);
      formData.append("caption", imageCaption);
      if (postId) formData.append("postId", postId);

      const res = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      editor
        .chain()
        .focus()
        .setImage({ src: data.url, alt: imageAlt || file.name, title: imageCaption || undefined })
        .run();

      toast.success("Image uploaded & stored in PostgreSQL database!");
      setImageDialogOpen(false);
      setImageAlt("");
      setImageCaption("");
      setImageUrl("");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Handle image insertion by URL
  const handleInsertImageUrl = () => {
    if (!imageUrl.trim()) {
      toast.error("Please enter a valid image URL.");
      return;
    }
    editor
      .chain()
      .focus()
      .setImage({ src: imageUrl.trim(), alt: imageAlt || "", title: imageCaption || undefined })
      .run();
    setImageDialogOpen(false);
    setImageUrl("");
    setImageAlt("");
    setImageCaption("");
  };

  // Handle Link insertion
  const handleSetLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
    }
    setLinkDialogOpen(false);
    setLinkUrl("");
  };

  return (
    <div
      className={`border border-border/80 rounded-2xl bg-card overflow-hidden transition-all duration-200 ${
        isFullScreen ? "fixed inset-0 z-[100] rounded-none flex flex-col bg-background" : "shadow-sm"
      }`}
    >
      {/* Rich-Text Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/40 border-b border-border/70 text-muted-foreground select-none">
        {/* Undo / Redo */}
        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-xs"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-xs"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-[1px] h-5 bg-border/80 mx-1" />

        {/* Headings */}
        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${editor.isActive("paragraph") ? "bg-accent/20 text-accent" : ""}`}
            onClick={() => editor.chain().focus().setParagraph().run()}
            title="Normal Paragraph"
          >
            <Pilcrow className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${editor.isActive("heading", { level: 1 }) ? "bg-accent/20 text-accent font-bold" : ""}`}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${editor.isActive("heading", { level: 2 }) ? "bg-accent/20 text-accent font-bold" : ""}`}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${editor.isActive("heading", { level: 3 }) ? "bg-accent/20 text-accent font-bold" : ""}`}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${editor.isActive("heading", { level: 4 }) ? "bg-accent/20 text-accent font-bold" : ""}`}
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            title="Heading 4"
          >
            <Heading4 className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-[1px] h-5 bg-border/80 mx-1" />

        {/* Basic Styles: Bold, Italic, Underline, Strike */}
        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${editor.isActive("bold") ? "bg-accent/20 text-accent font-bold" : ""}`}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${editor.isActive("italic") ? "bg-accent/20 text-accent font-bold" : ""}`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${editor.isActive("underline") ? "bg-accent/20 text-accent font-bold" : ""}`}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${editor.isActive("strike") ? "bg-accent/20 text-accent font-bold" : ""}`}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-[1px] h-5 bg-border/80 mx-1" />

        {/* Text Alignment */}
        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${editor.isActive({ textAlign: "left" }) ? "bg-accent/20 text-accent" : ""}`}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${editor.isActive({ textAlign: "center" }) ? "bg-accent/20 text-accent" : ""}`}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${editor.isActive({ textAlign: "right" }) ? "bg-accent/20 text-accent" : ""}`}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${editor.isActive({ textAlign: "justify" }) ? "bg-accent/20 text-accent" : ""}`}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-[1px] h-5 bg-border/80 mx-1" />

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${editor.isActive("bulletList") ? "bg-accent/20 text-accent" : ""}`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${editor.isActive("orderedList") ? "bg-accent/20 text-accent" : ""}`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${editor.isActive("blockquote") ? "bg-accent/20 text-accent" : ""}`}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-[1px] h-5 bg-border/80 mx-1" />

        {/* Code & Codeblock */}
        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${editor.isActive("code") ? "bg-accent/20 text-accent" : ""}`}
            onClick={() => editor.chain().focus().toggleCode().run()}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${editor.isActive("codeBlock") ? "bg-accent/20 text-accent" : ""}`}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="Code Block"
          >
            <FileCode className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Divider"
          >
            <Minus className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-[1px] h-5 bg-border/80 mx-1" />

        {/* Media & Links */}
        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${editor.isActive("link") ? "bg-accent/20 text-accent" : ""}`}
            onClick={() => {
              setLinkUrl(editor.getAttributes("link").href || "");
              setLinkDialogOpen(true);
            }}
            title="Insert / Edit Link"
          >
            <LinkIcon className="w-4 h-4" />
          </Button>
          {editor.isActive("link") && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => editor.chain().focus().unsetLink().run()}
              title="Remove Link"
            >
              <Unlink className="w-4 h-4" />
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-accent font-semibold"
            onClick={() => setImageDialogOpen(true)}
            title="Upload / Insert Image (PostgreSQL Buffer Storage)"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-[1px] h-5 bg-border/80 mx-1" />

        {/* Clear formatting & Full screen */}
        <div className="flex items-center gap-0.5 ml-auto">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsFullScreen(!isFullScreen)}
            title={isFullScreen ? "Exit Fullscreen" : "Fullscreen Mode"}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className={`overflow-y-auto ${isFullScreen ? "flex-1 p-8 max-w-4xl mx-auto w-full" : ""}`}>
        <EditorContent editor={editor} />
      </div>

      {/* Image Upload Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-accent" />
              <span>Insert Image into Post</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Direct Device Upload */}
            <div className="p-4 rounded-xl border border-dashed border-border/80 bg-muted/20 text-center space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="inline-image-upload"
              />
              <label
                htmlFor="inline-image-upload"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground font-semibold text-xs cursor-pointer hover:bg-accent/90 transition-colors"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving buffer to PostgreSQL...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload Image from Device</span>
                  </>
                )}
              </label>
              <p className="text-[11px] text-muted-foreground">
                JPG, PNG, WebP, GIF, SVG up to 10MB. Stored directly in PostgreSQL.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-border" />
              <span className="text-xs text-muted-foreground">or insert via URL</span>
              <div className="flex-1 h-[1px] bg-border" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Image URL</Label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Alt Text (Accessibility)</Label>
                <Input
                  placeholder="Descriptive text..."
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Caption (Optional)</Label>
                <Input
                  placeholder="Image caption..."
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setImageDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleInsertImageUrl}
              disabled={!imageUrl.trim() || isUploading}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Hyperlink</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label className="text-xs">Destination URL</Label>
            <Input
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="text-xs"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetLink} className="bg-accent text-accent-foreground">
              Save Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
