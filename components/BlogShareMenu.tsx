"use client";

import { useState } from "react";
import {
  Link2,
  Check,
  Linkedin,
  Twitter,
  Send,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

interface BlogShareMenuProps {
  title: string;
  url: string;
  className?: string;
}

export default function BlogShareMenu({ title, url, className = "" }: BlogShareMenuProps) {
  const [copied, setCopied] = useState(false);

  // Copy Link with toast and inline visual confirmation
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  // Web Share API (native on mobile devices)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          toast.error("Sharing failed.");
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // Social share URLs
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareTwitter = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const shareLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const shareWhatsApp = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 ${className}`}>
      {/* 1-Click Copy Link Button */}
      <button
        type="button"
        onClick={handleCopyLink}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 active:scale-95 ${
          copied
            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
            : "bg-card/80 border-border/80 text-foreground/80 hover:text-accent hover:border-accent/60 hover:bg-accent/5 shadow-xs"
        }`}
        title="Copy article link"
        aria-label="Copy article link"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-500 animate-in zoom-in" />
        ) : (
          <Link2 className="w-3.5 h-3.5 text-accent" />
        )}
        <span className="hidden xs:inline sm:inline">
          {copied ? "Copied!" : "Copy Link"}
        </span>
      </button>

      {/* X / Twitter Share */}
      <a
        href={shareTwitter}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full border border-border/80 bg-card/80 flex items-center justify-center text-muted-foreground hover:text-sky-400 hover:border-sky-400/50 hover:bg-sky-500/10 transition-all duration-200 shadow-xs"
        title="Share on X (Twitter)"
        aria-label="Share on X"
      >
        <Twitter className="w-3.5 h-3.5" />
      </a>

      {/* LinkedIn Share */}
      <a
        href={shareLinkedIn}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full border border-border/80 bg-card/80 flex items-center justify-center text-muted-foreground hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-200 shadow-xs"
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-3.5 h-3.5" />
      </a>

      {/* WhatsApp Share */}
      <a
        href={shareWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full border border-border/80 bg-card/80 flex items-center justify-center text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-200 shadow-xs"
        title="Share on WhatsApp"
        aria-label="Share on WhatsApp"
      >
        <Send className="w-3.5 h-3.5" />
      </a>

      {/* Mobile Device Native Share Button */}
      {typeof navigator !== "undefined" && "share" in navigator && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="w-8 h-8 rounded-full border border-border/80 bg-card/80 flex sm:hidden items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/50 transition-all duration-200 shadow-xs"
          title="Share via device menu"
          aria-label="Share via device"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
