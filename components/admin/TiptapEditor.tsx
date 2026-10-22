"use client";

import { useEditor, EditorContent, NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import CodeBlock from "@tiptap/extension-code-block";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import { Table as TiptapTable } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
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
  Table as TableIcon,
  Plus,
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
  ChevronDown,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  postId?: string;
  onEditorReady?: (editor: any) => void;
}

const HIGHLIGHT_COLORS = [
  { label: "Yellow", value: "#fef08a", bgClass: "bg-[#fef08a]", borderClass: "border-amber-300" },
  { label: "Green", value: "#bbf7d0", bgClass: "bg-[#bbf7d0]", borderClass: "border-emerald-300" },
  { label: "Blue", value: "#bae6fd", bgClass: "bg-[#bae6fd]", borderClass: "border-sky-300" },
  { label: "Pink", value: "#fbcfe8", bgClass: "bg-[#fbcfe8]", borderClass: "border-pink-300" },
  { label: "Orange", value: "#fed7aa", bgClass: "bg-[#fed7aa]", borderClass: "border-orange-300" },
  { label: "Purple", value: "#e9d5ff", bgClass: "bg-[#e9d5ff]", borderClass: "border-purple-300" },
];

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

export default function TiptapEditor({ content, onChange, postId, onEditorReady }: TiptapEditorProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageAlt, setImageAlt] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedLinkText, setSelectedLinkText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Selection range preservation refs for modal dialogs and external clicks
  const savedLinkRangeRef = useRef<{ from: number; to: number } | null>(null);
  const savedImageRangeRef = useRef<{ from: number; to: number } | null>(null);
  const lastSyncedPostIdRef = useRef(postId);
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
      Highlight.configure({
        multicolor: true,
      }),
      TiptapTable.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse w-full my-6 text-sm border border-border/80",
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-accent underline font-semibold hover:text-accent/80 cursor-pointer",
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
          "tiptap-rendered-content blog-content-body max-w-none focus:outline-none min-h-[420px] p-6 text-foreground text-base leading-relaxed selection:bg-cyan-500/30 dark:selection:bg-cyan-500/40",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Notify parent of live editor instance so PostEditor can always extract real-time HTML on save
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Sync content ONLY if postId actually changes (e.g. navigated to a different post)
  // NEVER overwrite content during active user drafting, which would destroy selections
  useEffect(() => {
    if (!editor) return;
    if (!isInitialLoadedRef.current) {
      isInitialLoadedRef.current = true;
      return;
    }

    if (postId && postId !== lastSyncedPostIdRef.current) {
      lastSyncedPostIdRef.current = postId;
      editor.commands.setContent(content || "", false);
    }
  }, [postId, content, editor]);

  // Smart inline mark applicator that trims leading/trailing whitespace if needed,
  // without desyncing the ProseMirror selection on consecutive clicks
  const applyInlineMark = useCallback(
    (
      action: "toggleBold" | "toggleItalic" | "toggleUnderline" | "toggleStrike" | "toggleCode" | "toggleHighlight",
      options?: any
    ) => {
      if (!editor) return;
      const { state } = editor;
      const { from, to, empty } = state.selection;

      if (empty) {
        if (action === "toggleHighlight") {
          editor.chain().focus().toggleHighlight(options).run();
        } else {
          (editor.chain().focus() as any)[action]().run();
        }
        return;
      }

      // Check text in range and trim leading/trailing whitespace if present
      const selectedText = state.doc.textBetween(from, to, " ");
      const leadingSpaces = selectedText.search(/\S|$/);
      const trailingSpaces = selectedText.length - selectedText.trimEnd().length;

      let chain = editor.chain().focus();
      if (leadingSpaces > 0 || trailingSpaces > 0) {
        const cleanFrom = from + leadingSpaces;
        const cleanTo = to - trailingSpaces;
        if (cleanFrom < cleanTo) {
          chain = chain.setTextSelection({ from: cleanFrom, to: cleanTo });
        }
      }

      if (action === "toggleHighlight") {
        chain.toggleHighlight(options).run();
      } else {
        (chain as any)[action]().run();
      }
    },
    [editor]
  );

  // Clean Heading toggle (directly transforms current block without corrupting coordinates)
  const toggleHeadingSmart = useCallback(
    (level: 1 | 2 | 3 | 4) => {
      if (!editor) return;
      editor.chain().focus().toggleHeading({ level }).run();
    },
    [editor]
  );

  // Normal Paragraph toggle
  const setParagraphSmart = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().setParagraph().run();
  }, [editor]);

  // Clean Blockquote toggle
  const toggleBlockquoteSmart = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().toggleBlockquote().run();
  }, [editor]);

  // Clean Code Block toggle
  const toggleCodeBlockSmart = useCallback(() => {
    if (!editor) return;
    if (editor.isActive("codeBlock")) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleCodeBlock({ language: "javascript" }).run();
    }
  }, [editor]);

  // Smart Clear Formatting (strips all marks, highlights, and resets block to normal paragraph)
  const clearFormattingSmart = useCallback(() => {
    if (!editor) return;
    if (editor.isActive("blockquote")) {
      editor.chain().focus().lift("blockquote").run();
    }
    editor.chain().focus().unsetAllMarks().unsetHighlight().clearNodes().setParagraph().run();
    toast.success("Formatting cleared");
  }, [editor]);

  // Open Link Dialog: automatically expands selection to wrap the entire existing link if clicked
  const handleOpenLinkDialog = useCallback(() => {
    if (!editor) return;

    // If cursor is on or inside an existing link mark, auto-extend selection to wrap the whole link
    if (editor.isActive("link")) {
      editor.chain().extendMarkRange("link").run();
    }

    const { from, to, empty } = editor.state.selection;
    savedLinkRangeRef.current = { from, to };

    const existingHref = editor.getAttributes("link").href || "";
    setLinkUrl(existingHref);

    const txt = empty ? "" : editor.state.doc.textBetween(from, to, " ");
    setSelectedLinkText(txt);
    setLinkDialogOpen(true);
  }, [editor]);

  // Open Image Dialog with preserved selection snapshot
  const handleOpenImageDialog = useCallback(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    savedImageRangeRef.current = { from, to };
    setImageDialogOpen(true);
  }, [editor]);

  // Save Link: handles setting new link, updating existing link, and editing link text safely
  const handleSetLink = () => {
    if (!editor) return;
    const targetRange = savedLinkRangeRef.current || {
      from: editor.state.selection.from,
      to: editor.state.selection.to,
    };

    const trimmedUrl = linkUrl.trim();
    const trimmedText = selectedLinkText.trim();

    if (!trimmedUrl) {
      editor
        .chain()
        .focus()
        .setTextSelection(targetRange)
        .extendMarkRange("link")
        .unsetLink()
        .run();
      toast.info("Link removed");
    } else {
      const validUrl = /^https?:\/\//i.test(trimmedUrl) || trimmedUrl.startsWith("#") || trimmedUrl.startsWith("/") || trimmedUrl.startsWith("mailto:")
        ? trimmedUrl
        : `https://${trimmedUrl}`;

      if (targetRange.from === targetRange.to) {
        // Collapsed cursor position: insert new text with link mark
        const displayText = trimmedText || validUrl;
        editor
          .chain()
          .focus()
          .setTextSelection(targetRange)
          .insertContent({
            type: "text",
            text: displayText,
            marks: [{ type: "link", attrs: { href: validUrl } }],
          })
          .run();
      } else {
        const originalText = editor.state.doc.textBetween(targetRange.from, targetRange.to, " ");
        if (trimmedText && trimmedText !== originalText) {
          // Display text was changed: replace text with updated link mark
          editor
            .chain()
            .focus()
            .setTextSelection(targetRange)
            .insertContent({
              type: "text",
              text: trimmedText,
              marks: [{ type: "link", attrs: { href: validUrl } }],
            })
            .run();
        } else {
          // Just update the link URL mark on the target range
          editor
            .chain()
            .focus()
            .setTextSelection(targetRange)
            .extendMarkRange("link")
            .setLink({ href: validUrl })
            .run();
        }
      }
      toast.success("Link saved");
    }

    setLinkDialogOpen(false);
    savedLinkRangeRef.current = null;
    setSelectedLinkText("");
    setLinkUrl("");
  };

  // Remove Link directly from the Dialog
  const handleRemoveLink = () => {
    if (!editor) return;
    const targetRange = savedLinkRangeRef.current || {
      from: editor.state.selection.from,
      to: editor.state.selection.to,
    };
    editor
      .chain()
      .focus()
      .setTextSelection(targetRange)
      .extendMarkRange("link")
      .unsetLink()
      .run();
    setLinkDialogOpen(false);
    savedLinkRangeRef.current = null;
    setSelectedLinkText("");
    setLinkUrl("");
    toast.info("Link removed");
  };

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

      const targetRange = savedImageRangeRef.current || {
        from: editor.state.selection.from,
        to: editor.state.selection.to,
      };

      editor
        .chain()
        .focus()
        .setTextSelection(targetRange)
        .setImage({ src: data.url, alt: imageAlt || file.name, title: imageCaption || undefined })
        .run();

      toast.success("Image uploaded & stored in database!");
      setImageDialogOpen(false);
      savedImageRangeRef.current = null;
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
    const targetRange = savedImageRangeRef.current || {
      from: editor.state.selection.from,
      to: editor.state.selection.to,
    };
    editor
      .chain()
      .focus()
      .setTextSelection(targetRange)
      .setImage({ src: imageUrl.trim(), alt: imageAlt || "", title: imageCaption || undefined })
      .run();
    setImageDialogOpen(false);
    savedImageRangeRef.current = null;
    setImageUrl("");
    setImageAlt("");
    setImageCaption("");
  };

  return (
    <div
      className={`border border-border/80 rounded-2xl bg-card overflow-hidden transition-all duration-200 relative ${
        isFullScreen ? "fixed inset-0 z-[100] rounded-none flex flex-col bg-background" : "shadow-sm"
      }`}
    >
      {/* Floating Selection Bubble Menu (Pops up directly on selected text for instant formatting) */}
      <BubbleMenu
        editor={editor}
        className="flex items-center gap-0.5 p-1 rounded-xl border border-border/80 bg-background/95 backdrop-blur-xl shadow-2xl z-50 text-xs"
      >
        <ToolbarButton
          onClick={() => applyInlineMark("toggleBold")}
          isActive={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => applyInlineMark("toggleItalic")}
          isActive={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => applyInlineMark("toggleUnderline")}
          isActive={editor.isActive("underline")}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => applyInlineMark("toggleStrike")}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </ToolbarButton>

        {/* Highlight Quick Button in Bubble Menu */}
        <ToolbarButton
          onClick={() => applyInlineMark("toggleHighlight")}
          isActive={editor.isActive("highlight")}
          title="Highlight Text (Default Yellow)"
          className={editor.isActive("highlight") ? "text-amber-500 bg-amber-500/20" : ""}
        >
          <Highlighter className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => applyInlineMark("toggleCode")}
          isActive={editor.isActive("code")}
          title="Inline Code"
        >
          <Code className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={handleOpenLinkDialog}
          isActive={editor.isActive("link")}
          title="Link (Ctrl+K)"
        >
          <LinkIcon className="w-3.5 h-3.5" />
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

      {/* Sticky Formatting Toolbar with glassmorphism */}
      <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 p-2 bg-card/95 backdrop-blur-md border-b border-border/80 text-muted-foreground select-none shadow-xs">
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
            onClick={() => applyInlineMark("toggleBold")}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive("italic")}
            onClick={() => applyInlineMark("toggleItalic")}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive("underline")}
            onClick={() => applyInlineMark("toggleUnderline")}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive("strike")}
            onClick={() => applyInlineMark("toggleStrike")}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>

          {/* Highlighter Tool with Color Picker Popover */}
          <Popover>
            <div className="flex items-center rounded-lg border border-transparent hover:border-border/60">
              <ToolbarButton
                isActive={editor.isActive("highlight")}
                onClick={() => applyInlineMark("toggleHighlight")}
                title="Highlight Selected Text (Click to toggle default yellow)"
                className={editor.isActive("highlight") ? "text-amber-500 bg-amber-500/20" : ""}
              >
                <Highlighter className="w-4 h-4" />
              </ToolbarButton>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  className="h-8 px-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-r-lg transition-colors cursor-pointer"
                  title="Choose Highlight Color"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </PopoverTrigger>
            </div>
            <PopoverContent
              align="start"
              className="w-48 p-2.5 rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md shadow-xl space-y-2 select-none"
            >
              <div className="text-[11px] font-semibold text-muted-foreground px-1">
                Highlight Color
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {HIGHLIGHT_COLORS.map((col) => (
                  <button
                    key={col.value}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      applyInlineMark("toggleHighlight", { color: col.value });
                    }}
                    className={`h-7 rounded-lg flex items-center justify-center border transition-all cursor-pointer hover:scale-105 ${col.bgClass} ${col.borderClass}`}
                    title={col.label}
                  >
                    <span className="text-[10px] font-bold text-stone-900">{col.label[0]}</span>
                  </button>
                ))}
              </div>
              {editor.isActive("highlight") && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().unsetHighlight().run();
                  }}
                  className="w-full text-center text-[11px] font-medium text-destructive hover:bg-destructive/10 py-1 rounded-md transition-colors cursor-pointer"
                >
                  Remove Highlight
                </button>
              )}
            </PopoverContent>
          </Popover>
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
            onClick={() => applyInlineMark("toggleCode")}
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
            onClick={handleOpenLinkDialog}
            title="Insert / Edit Link (Ctrl+K)"
          >
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>
          {editor.isActive("link") && (
            <ToolbarButton
              className="text-destructive hover:bg-destructive/15"
              onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
              title="Remove Link"
            >
              <Unlink className="w-4 h-4" />
            </ToolbarButton>
          )}

          <ToolbarButton
            className="text-accent font-semibold"
            onClick={handleOpenImageDialog}
            title="Upload / Insert Image (PostgreSQL Buffer Storage)"
          >
            <ImageIcon className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-[1px] h-5 bg-border/80 mx-1" />

        {/* Table Management */}
        <Popover>
          <div className="flex items-center rounded-lg border border-transparent hover:border-border/60">
            <ToolbarButton
              isActive={editor.isActive("table")}
              onClick={() => {
                if (!editor.isActive("table")) {
                  editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                  toast.success("Inserted 3x3 Table");
                }
              }}
              title={editor.isActive("table") ? "Inside Table (Click arrow for actions)" : "Insert 3x3 Data Table"}
            >
              <TableIcon className="w-4 h-4" />
            </ToolbarButton>
            <PopoverTrigger asChild>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                className="h-8 px-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-r-lg transition-colors cursor-pointer"
                title="Table Actions"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </PopoverTrigger>
          </div>
          <PopoverContent
            align="start"
            className="w-56 p-2 rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md shadow-xl space-y-1 text-xs select-none"
          >
            {!editor.isActive("table") ? (
              <div className="space-y-1.5 p-1">
                <div className="font-semibold text-foreground text-xs">Insert Table</div>
                <p className="text-[11px] text-muted-foreground">Add a clean data table with header row to your post.</p>
                <Button
                  type="button"
                  size="sm"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                    toast.success("Inserted 3x3 Table");
                  }}
                  className="w-full bg-accent text-accent-foreground text-xs font-semibold h-7 mt-1"
                >
                  Insert 3x3 Table
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="font-semibold text-[11px] text-muted-foreground px-2 py-0.5">
                  Table Actions
                </div>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-xs transition-colors cursor-pointer"
                >
                  <span>Add Row Above</span>
                  <span className="text-[10px] text-muted-foreground font-mono">+row</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-xs transition-colors cursor-pointer"
                >
                  <span>Add Row Below</span>
                  <span className="text-[10px] text-muted-foreground font-mono">+row</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-destructive/10 text-destructive text-xs transition-colors cursor-pointer"
                >
                  <span>Delete Row</span>
                  <span className="text-[10px] text-destructive/80 font-mono">-row</span>
                </button>

                <div className="w-full h-[1px] bg-border/60 my-1" />

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-xs transition-colors cursor-pointer"
                >
                  <span>Add Column Left</span>
                  <span className="text-[10px] text-muted-foreground font-mono">+col</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-xs transition-colors cursor-pointer"
                >
                  <span>Add Column Right</span>
                  <span className="text-[10px] text-muted-foreground font-mono">+col</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-destructive/10 text-destructive text-xs transition-colors cursor-pointer"
                >
                  <span>Delete Column</span>
                  <span className="text-[10px] text-destructive/80 font-mono">-col</span>
                </button>

                <div className="w-full h-[1px] bg-border/60 my-1" />

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-xs transition-colors cursor-pointer"
                >
                  <span>Toggle Header Row</span>
                  <span className="text-[10px] text-accent font-mono">th/td</span>
                </button>

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().deleteTable().run();
                    toast.info("Table removed");
                  }}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-destructive/15 text-destructive font-semibold text-xs transition-colors cursor-pointer"
                >
                  <span>Delete Table</span>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        <div className="w-[1px] h-5 bg-border/80 mx-1" />

        {/* Clear formatting & Full screen */}
        <div className="flex items-center gap-0.5 ml-auto">
          <ToolbarButton
            onClick={clearFormattingSmart}
            title="Clear Formatting (Marks, Highlights & Styles)"
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

      {/* Editor Content Area with Dedicated Long-Text Scroller */}
      <div className={`overflow-y-auto ${isFullScreen ? "flex-1 p-8 max-w-4xl mx-auto w-full" : "max-h-[680px] custom-editor-scrollbar"}`}>
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
      <Dialog
        open={linkDialogOpen}
        onOpenChange={(open) => {
          setLinkDialogOpen(open);
          if (!open) {
            savedLinkRangeRef.current = null;
            setSelectedLinkText("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-accent" />
              <span>{editor.isActive("link") ? "Edit Hyperlink" : "Insert Hyperlink"}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="link-text" className="text-xs font-semibold">
                Text to Display
              </Label>
              <Input
                id="link-text"
                placeholder="Text to display in article"
                value={selectedLinkText}
                onChange={(e) => setSelectedLinkText(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="link-href" className="text-xs font-semibold">
                Destination URL *
              </Label>
              <Input
                id="link-href"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSetLink();
                  }
                }}
                className="text-xs"
                autoFocus
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            {editor.isActive("link") && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveLink}
                className="sm:mr-auto text-xs"
              >
                Remove Link
              </Button>
            )}
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
              className="bg-accent text-accent-foreground font-semibold"
            >
              Save Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
