"use client";

import { useState, useMemo } from "react";

// ─── Shared Facebook-style Caption Component ───────────────────────────────
// Used in both FoodPost (feed card) and the post detail modal.
// Features: #hashtag highlighting, @mention highlighting,
//           line-break preservation, and "Xem thêm / Thu gọn" collapse.

const CAPTION_COLLAPSE_LINES = 3;
const CAPTION_COLLAPSE_CHARS = 200;

interface CaptionTextProps {
  username: string;
  caption: string;
  /** Extra className for the outer <p> */
  className?: string;
}

export function CaptionText({ username, caption, className }: CaptionTextProps) {
  const [expanded, setExpanded] = useState(false);

  const isLong = useMemo(() => {
    const lineBreaks = (caption.match(/\n/g) || []).length;
    return lineBreaks >= CAPTION_COLLAPSE_LINES || caption.length > CAPTION_COLLAPSE_CHARS;
  }, [caption]);

  const visibleCaption = useMemo(() => {
    if (expanded || !isLong) return caption;
    const lines = caption.split("\n");
    if (lines.length >= CAPTION_COLLAPSE_LINES) {
      return lines.slice(0, CAPTION_COLLAPSE_LINES).join("\n");
    }
    return caption.slice(0, CAPTION_COLLAPSE_CHARS);
  }, [caption, expanded, isLong]);

  return (
    <p className={className ?? "text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed"}>
      <span className="font-bold text-neutral-900 dark:text-neutral-100 mr-1.5">
        @{username}
      </span>
      <ParsedCaption text={visibleCaption} />
      {isLong && !expanded && (
        <>
          <span className="text-neutral-400 dark:text-neutral-600">... </span>
          <button
            onClick={() => setExpanded(true)}
            className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer"
          >
            Xem thêm
          </button>
        </>
      )}
      {isLong && expanded && (
        <>
          {" "}
          <button
            onClick={() => setExpanded(false)}
            className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer"
          >
            Thu gọn
          </button>
        </>
      )}
    </p>
  );
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function ParsedCaption({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, lineIdx) => (
        <span key={lineIdx}>
          {lineIdx > 0 && <br />}
          <ParsedLine line={line} />
        </span>
      ))}
    </>
  );
}

function ParsedLine({ line }: { line: string }) {
  // Match #hashtag (supports Vietnamese diacritics) or @mention
  const TOKEN_RE = /(#[\w\u00C0-\u024F\u1E00-\u1EFF]+)|(@[\w.]+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TOKEN_RE.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("#")) {
      parts.push(
        <span
          key={match.index}
          className="text-orange-500 dark:text-orange-400 font-semibold hover:underline cursor-pointer"
        >
          {token}
        </span>
      );
    } else {
      parts.push(
        <span
          key={match.index}
          className="text-sky-500 dark:text-sky-400 font-semibold hover:underline cursor-pointer"
        >
          {token}
        </span>
      );
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }

  return <>{parts}</>;
}
