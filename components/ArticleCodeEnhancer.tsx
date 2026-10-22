"use client";

import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

interface ArticleCodeEnhancerProps {
  children: React.ReactNode;
}

const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "if", "else", "for", "while", "do",
  "switch", "case", "break", "continue", "default", "try", "catch", "finally", "throw",
  "new", "typeof", "instanceof", "void", "delete", "in", "of", "async", "await",
  "class", "extends", "super", "this", "import", "export", "from", "as", "yield",
  "interface", "type", "enum", "implements", "public", "private", "protected", "readonly",
  "def", "elif", "lambda", "pass", "raise", "except", "with",
  "SELECT", "FROM", "WHERE", "INSERT", "INTO", "UPDATE", "DELETE", "JOIN", "LEFT",
  "RIGHT", "INNER", "GROUP", "BY", "ORDER", "HAVING", "LIMIT", "CREATE", "TABLE",
]);

const BUILTINS = new Set([
  "console", "setTimeout", "setInterval", "clearTimeout", "clearInterval", "Promise",
  "document", "window", "process", "Math", "JSON", "Array", "Object", "String",
  "Number", "Boolean", "Date", "RegExp", "Map", "Set", "fetch", "print", "len",
  "range", "int", "str", "float", "dict", "list",
]);

const BOOLEANS = new Set([
  "true", "false", "null", "undefined", "None", "True", "False", "nil",
]);

const OPERATORS = new Set([
  "=>", "===", "!==", "==", "!=", "<=", ">=", "++", "--", "+=", "-=", "*=", "/=", "&&", "||",
]);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function detectLanguage(code: string): string {
  const trimmed = code.trim();
  if (
    /^(\s*<(!DOCTYPE|html|div|span|p|h[1-6]|ul|li|button|a|script|style)[\s>])/i.test(trimmed) ||
    /<\/[a-z0-9_-]+>/i.test(trimmed)
  ) {
    return "html";
  }
  if (/^(\s*(\{|\[)\s*")|("[a-zA-Z0-9_-]+"\s*:)/.test(trimmed)) {
    return "json";
  }
  if (/^(\s*(SELECT|INSERT\s+INTO|UPDATE|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE)\b)/i.test(trimmed)) {
    return "sql";
  }
  if (/(def\s+[a-zA-Z_]\w*\s*\(|elif\s+|import\s+[a-zA-Z_]\w*|print\(|__name__\s*==)/.test(trimmed)) {
    return "python";
  }
  if (/^(npm|npx|pnpm|yarn|git|cd|mkdir|curl|wget|docker|docker-compose)\b/m.test(trimmed)) {
    return "bash";
  }
  if (/([.#][a-zA-Z0-9_-]+\s*\{)|(@media[^{]+\{)|(var\(--)|(display:\s*(flex|grid|block))/.test(trimmed)) {
    return "css";
  }
  if (/(interface\s+[A-Z]\w*|type\s+[A-Z]\w*\s*=|:\s*(string|number|boolean|any)\[\]|as\s+const)/.test(trimmed)) {
    return "typescript";
  }
  if (/(console\.(log|warn|error)|setTimeout|setInterval|const\s+|let\s+|var\s+|function\s*\(|=>\s*\{?)/.test(trimmed)) {
    return "javascript";
  }
  return "code";
}

function highlightCode(rawCode: string): string {
  // Master Token Regex matching comments, strings, identifiers, numbers, operators, punctuation
  const tokenRegex = /(?:\/\/.*|\/\*[\s\S]*?\*\/|#.*)|(?:`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(=>|===|!==|==|!=|<=|>=|\+\+|--|\+=|-=|\*=|\/=|&&|\|\|)|(\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|(\b[a-zA-Z_$][a-zA-Z0-9_$]*\b)|([{}()[\];,.])/g;

  let lastIndex = 0;
  let result = "";
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(rawCode)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(rawCode.slice(lastIndex, match.index));
    }

    const token = match[0];
    let cls = "";

    if (token.startsWith("//") || token.startsWith("/*") || token.startsWith("#")) {
      cls = "code-comment";
    } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`")) {
      cls = "code-string";
    } else if (KEYWORDS.has(token)) {
      cls = "code-keyword";
    } else if (BUILTINS.has(token)) {
      cls = "code-builtin";
    } else if (BOOLEANS.has(token)) {
      cls = "code-boolean";
    } else if (OPERATORS.has(token)) {
      cls = "code-operator";
    } else if (/^\d+(\.\d+)?([eE][+-]?\d+)?$/.test(token)) {
      cls = "code-number";
    } else if (/^[{}()[\];,]$/.test(token)) {
      cls = "code-punctuation";
    } else if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(token)) {
      // Check if followed by open parenthesis (function call)
      const rest = rawCode.slice(match.index + token.length);
      if (/^\s*\(/.test(rest)) {
        cls = "code-function";
      }
    }

    if (cls) {
      result += `<span class="${cls}">${escapeHtml(token)}</span>`;
    } else {
      result += escapeHtml(token);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < rawCode.length) {
    result += escapeHtml(rawCode.slice(lastIndex));
  }

  return result;
}

export function ArticleCodeEnhancer({ children }: ArticleCodeEnhancerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const preElements = containerRef.current.querySelectorAll("pre");

    preElements.forEach((pre) => {
      // Prevent double enhancement
      if (pre.dataset.enhanced === "true") return;
      pre.dataset.enhanced = "true";

      const codeEl = pre.querySelector("code");
      const rawText = codeEl ? codeEl.innerText : pre.innerText;

      // Detect language from class if available (e.g. class="language-js")
      let lang = "code";
      if (codeEl) {
        const langClass = Array.from(codeEl.classList).find((cls) =>
          cls.startsWith("language-")
        );
        if (langClass) {
          lang = langClass.replace("language-", "");
        }
      }

      // If language was not explicitly specified or is generic, auto-detect from content
      if (!lang || lang === "code") {
        lang = detectLanguage(rawText);
      }

      // Syntax highlight the code element content safely
      if (codeEl && rawText.trim()) {
        codeEl.innerHTML = highlightCode(rawText);
      }

      // Format clean display name for language badge
      const displayLang =
        lang === "js"
          ? "JAVASCRIPT"
          : lang === "ts"
          ? "TYPESCRIPT"
          : lang === "py"
          ? "PYTHON"
          : lang === "sh"
          ? "BASH"
          : lang.toUpperCase();

      // Create Code Header Bar
      const header = document.createElement("div");
      header.className =
        "flex items-center justify-between px-4 py-2.5 bg-muted/60 border-b border-border/80 text-xs font-mono text-muted-foreground select-none rounded-t-xl";

      // Left: Mac dots + lang
      const leftGroup = document.createElement("div");
      leftGroup.className = "flex items-center gap-2.5";
      leftGroup.innerHTML = `
        <span class="flex items-center gap-1.5 opacity-80">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500/90 inline-block"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500/90 inline-block"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/90 inline-block"></span>
        </span>
        <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/90 pl-1">${displayLang}</span>
      `;

      // Right: Copy Button
      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className =
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all border border-transparent hover:border-border cursor-pointer";
      copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        <span>Copy</span>
      `;

      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(rawText);
          copyBtn.innerHTML = `
            <svg class="text-emerald-500" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span class="text-emerald-500">Copied!</span>
          `;
          toast.success("Code copied to clipboard!");
          setTimeout(() => {
            copyBtn.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <span>Copy</span>
            `;
          }, 2500);
        } catch {
          toast.error("Failed to copy code.");
        }
      });

      header.appendChild(leftGroup);
      header.appendChild(copyBtn);

      // Pre style adjustments to hold the header seamlessly
      pre.classList.add(
        "relative",
        "overflow-hidden",
        "!p-0",
        "!rounded-xl",
        "border",
        "border-border/80",
        "shadow-md"
      );
      if (codeEl) {
        codeEl.classList.add("block", "p-4", "overflow-x-auto");
      }

      pre.insertBefore(header, pre.firstChild);
    });

    // Ensure all tables in post body are wrapped in a responsive scroll container with auto-managed column sizes
    const tableElements = containerRef.current.querySelectorAll("table");
    tableElements.forEach((table) => {
      // Strip hardcoded pixel widths from cols and cells so columns distribute evenly
      const cols = table.querySelectorAll("col");
      cols.forEach((col) => {
        col.removeAttribute("style");
        col.removeAttribute("width");
      });
      const cells = table.querySelectorAll("th, td");
      cells.forEach((cell) => {
        cell.removeAttribute("colwidth");
        if (cell instanceof HTMLElement && cell.style.width) {
          cell.style.width = "";
        }
      });

      const firstRow = table.querySelector("tr");
      const colCount = firstRow ? firstRow.children.length : cols.length;
      if (colCount > 3) {
        table.style.minWidth = `${colCount * 140}px`;
      } else {
        table.style.minWidth = "100%";
      }

      if (!table.closest(".table-responsive-wrapper")) {
        const wrapper = document.createElement("div");
        wrapper.className = "table-responsive-wrapper";
        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
  }, [children]);

  return <div ref={containerRef}>{children}</div>;
}
