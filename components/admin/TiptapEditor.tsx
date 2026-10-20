"use client";

import { useEditor, EditorContent, NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import CodeBlock from "@tiptap/extension-code-block";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { useEffect, useRef, useState, useCallback } from "react";
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
  Copy,
  Check,
  Trash2,
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

// Reusable Toolbar Button that strictly prevents mousedown focus-stealing
function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
  className = "",
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={disabled}
      onMouseDown={(e) => {
        // Crucial: Prevents browser focus shift away from contenteditable canvas,
        // which would collapse the user's active text selection!
        e.preventDefault();
      }}
      onClick={onClick}
      className={`h-8 w-8 transition-colors rounded-lg cursor-pointer ${
        isActive
          ? "bg-accent/25 text-accent font-bold shadow-xs"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      } ${className}`}
      title={title}
    >
      {children}
    </Button>
  );
}

// Interactive macOS Terminal Code Block Node View for Editor
function TiptapCodeBlockView({
  node,
  updateAttributes,
  deleteNode,
}: {
  node: any;
  updateAttributes: (attrs: any) => void;
  deleteNode: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const currentLang = node.attrs.language || "javascript";

  const handleCopy = async () => {
    try {
      const codeText = node.textContent;
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  return (
    <NodeViewWrapper as="div" className="relative my-6 rounded-2xl overflow-hidden border border-border/80 bg-[#080c14] shadow-xl group">
      {/* Code Block Header Bar */}
      <div
        contentEditable={false}
        className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border/70 text-xs font-mono text-muted-foreground select-none"
      >
        {/* Left: macOS dots & language selector */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 opacity-80">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 inline-block" />
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground/70">LANG:</span>
            <select
              value={currentLang}
              onChange={(e) => updateAttributes({ language: e.target.value })}
              className="bg-background/80 hover:bg-background text-foreground/90 font-mono text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border border-border/70 focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer transition-all"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="sql">SQL</option>
              <option value="json">JSON</option>
              <option value="bash">Bash / Shell</option>
              <option value="markdown">Markdown</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>
        </div>

        {/* Right: Actions (Copy & Delete) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all border border-transparent hover:border-border cursor-pointer"
            title="Copy Code"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={deleteNode}
            className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            title="Remove Code Block"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Code Content */}
      <pre className="!m-0 !p-4 !bg-transparent !border-none overflow-x-auto">
        <NodeViewContent
          as="code"
          className={`language-${currentLang} font-mono text-sm leading-relaxed block text-foreground focus:outline-none`}
        />
      </pre>
    </NodeViewWrapper>
  );
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
  const isInitialLoadedRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-accent pl-4 my-4 italic text-muted-foreground bg-muted/20 py-2.5 pr-4 rounded-r-xl",
          },
        },
        codeBlock: false,
      }),
      CodeBlock.extend({
        addNodeView() {
          return ReactNodeViewRenderer(TiptapCodeBlockView);
        },
      }).configure({
        defaultLanguage: "javascript",
        enableTabIndentation: true,
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
          "tiptap-rendered-content blog-content-body max-w-none focus:outline-none min-h-[420px] p-6 text-foreground text-base leading-relaxed selection:bg-accent/30",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Sync content only on initial load or when post changes,
  // NEVER while user is actively focused/editing (which would destroy active selections)
  useEffect(() => {
    if (!editor) return;
    if (!isInitialLoadedRef.current) {
      isInitialLoadedRef.current = true;
      return;
    }
    // If editor is currently focused, do not overwrite content to avoid selection loss
    if (editor.isFocused) return;

    if (content && editor.getHTML() !== content) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  // Smart Heading toggle (lifts out of blockquote if currently trapped inside)
  const toggleHeadingSmart = useCallback(
    (level: 1 | 2 | 3 | 4) => {
      if (!editor) return;
      if (editor.isActive("blockquote")) {
        editor.chain().focus().lift("blockquote").toggleHeading({ level }).run();
      } else {
        editor.chain().focus().toggleHeading({ level }).run();
      }
    },
    [editor]
  );

  // Smart Paragraph toggle (lifts out of blockquote or codeBlock and restores normal paragraph)
  const setParagraphSmart = useCallback(() => {
    if (!editor) return;
    if (editor.isActive("blockquote")) {
      editor.chain().focus().lift("blockquote").setParagraph().run();
    } else if (editor.isActive("codeBlock")) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().setParagraph().run();
    }
  }, [editor]);

  // Smart Blockquote toggle (explicitly lifts out if currently inside a blockquote, otherwise wraps)
  const toggleBlockquoteSmart = useCallback(() => {
    if (!editor) return;
    if (editor.isActive("blockquote")) {
      const lifted = editor.chain().focus().lift("blockquote").run();
      if (!lifted) {
        editor.chain().focus().toggleBlockquote().run();
      }
    } else {
      editor.chain().focus().toggleBlockquote().run();
    }
  }, [editor]);

  // Smart Code Block toggle (lifts out of blockquote or cleanly toggles codeblock)
  const toggleCodeBlockSmart = useCallback(() => {
    if (!editor) return;
    if (editor.isActive("codeBlock")) {
      editor.chain().focus().setParagraph().run();
    } else if (editor.isActive("blockquote")) {
      editor.chain().focus().lift("blockquote").toggleCodeBlock({ language: "javascript" }).run();
    } else {
      editor.chain().focus().toggleCodeBlock({ language: "javascript" }).run();
    }
  }, [editor]);

  // Smart Clear Formatting (lifts out of blockquote and resets marks/nodes)
  const clearFormattingSmart = useCallback(() => {
    if (!editor) return;
    if (editor.isActive("blockquote")) {
      editor.chain().focus().lift("blockquote").clearNodes().unsetAllMarks().run();
    } else {
      editor.chain().focus().clearNodes().unsetAllMarks().run();
    }
  }, [editor]);

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

      toast.success("Image uploaded & stored in database!");
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
      className={`border border-border/80 rounded-2xl bg-card overflow-hidden transition-all duration-200 relative ${
        isFullScreen ? "fixed inset-0 z-[100] rounded-none flex flex-col bg-background" : "shadow-sm"
      }`}
    >
      {/* Floating Selection Bubble Menu (Pops up directly on selected text for precise formatting) */}
      <BubbleMenu
        editor={editor}
        className="flex items-center gap-0.5 p-1 rounded-xl border border-border/80 bg-background/95 backdrop-blur-xl shadow-2xl z-50 text-xs"
      >
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Inline Code"
        >
          <Code className="w-3.5 h-3.5" />
        </ToolbarButton>
        <div className="w-[1px] h-4 bg-border/80 mx-0.5" />
        <ToolbarButton
          onClick={() => toggleHeadingSmart(2)}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <span className="text-[11px] font-bold">H2</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => toggleHeadingSmart(3)}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <span className="text-[11px] font-bold">H3</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleBlockquoteSmart}
          isActive={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleCodeBlockSmart}
          isActive={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <FileCode className="w-3.5 h-3.5" />
        </ToolbarButton>
      </BubbleMenu>

      {/* Rich-Text Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/40 border-b border-border/70 text-muted-foreground select-none">
        {/* Undo / Redo */}
        <div className="flex items-center">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-[1px] h-5 bg-border/80 mx-1" />

        {/* Headings */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            isActive={editor.isActive("paragraph") && !editor.isActive("blockquote")}
            onClick={setParagraphSmart}
            title="Normal Paragraph"
          >
            <Pilcrow className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive("heading", { level: 1 })}
            onClick={() => toggleHeadingSmart(1)}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive("heading", { level: 2 })}
            onClick={() => toggleHeadingSmart(2)}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive("heading", { level: 3 })}
            onClick={() => toggleHeadingSmart(3)}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive("heading", { level: 4 })}
            onClick={() => toggleHeadingSmart(4)}
            title="Heading 4"
          >
            <Heading4 className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-[1px] h-5 bg-border/80 mx-1" />

        {/* Basic Styles: Bold, Italic, Underline, Strike */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            isActive={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-[1px] h-5 bg-border/80 mx-1" />

        {/* Text Alignment */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            isActive={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive({ textAlign: "justify" })}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-[1px] h-5 bg-border/80 mx-1" />

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            isActive={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive("blockquote")}
            onClick={toggleBlockquoteSmart}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-[1px] h-5 bg-border/80 mx-1" />

        {/* Code & Codeblock */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            isActive={editor.isActive("code")}
            onClick={() => editor.chain().focus().toggleCode().run()}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive("codeBlock")}
            onClick={toggleCodeBlockSmart}
            title="Code Block"
          >
            <FileCode className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Divider"
          >
            <Minus className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-[1px] h-5 bg-border/80 mx-1" />

        {/* Media & Links */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            isActive={editor.isActive("link")}
            onClick={() => {
              setLinkUrl(editor.getAttributes("link").href || "");
              setLinkDialogOpen(true);
            }}
            title="Insert / Edit Link"
          >
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>
          {editor.isActive("link") && (
            <ToolbarButton
              className="text-destructive"
              onClick={() => editor.chain().focus().unsetLink().run()}
              title="Remove Link"
            >
              <Unlink className="w-4 h-4" />
            </ToolbarButton>
          )}

          <ToolbarButton
            className="text-accent font-semibold"
            onClick={() => setImageDialogOpen(true)}
            title="Upload / Insert Image (PostgreSQL Buffer Storage)"
          >
            <ImageIcon className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-[1px] h-5 bg-border/80 mx-1" />

        {/* Clear formatting & Full screen */}
        <div className="flex items-center gap-0.5 ml-auto">
          <ToolbarButton
            onClick={clearFormattingSmart}
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => setIsFullScreen(!isFullScreen)}
            title={isFullScreen ? "Exit Fullscreen" : "Fullscreen Mode"}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </ToolbarButton>
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
                Supports PNG, JPG, WebP, GIF, SVG. Direct byte storage in PostgreSQL.
              </p>
            </div>

            {/* Image URL Alternative */}
            <div className="space-y-2">
              <Label htmlFor="image-url" className="text-xs font-semibold">
                Or Paste Image Web URL
              </Label>
              <Input
                id="image-url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="image-alt" className="text-[11px] text-muted-foreground">
                  Alt Text (SEO)
                </Label>
                <Input
                  id="image-alt"
                  placeholder="Descriptive image text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="image-caption" className="text-[11px] text-muted-foreground">
                  Caption (Optional)
                </Label>
                <Input
                  id="image-caption"
                  placeholder="Caption text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setImageDialogOpen(false)}
            >
              Cancel
            </Button>
            {imageUrl.trim() && (
              <Button type="button" size="sm" onClick={handleInsertImageUrl} className="bg-accent text-accent-foreground">
                Insert URL Image
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-accent" />
              <span>Insert or Edit Hyperlink</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="link-href" className="text-xs font-semibold">
                URL Destination
              </Label>
              <Input
                id="link-href"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setLinkDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSetLink}
              className="bg-accent text-accent-foreground"
            >
              Save Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
