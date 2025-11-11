import React from "react";

export function stripMarkTags(text: string | undefined | null): string {
  if (!text || typeof text !== "string") return text || "";
  
  return text.replace(/<mark>(.*?)<\/mark>/g, "$1");
}

export function renderHighlightedText(text: string | undefined | null): React.ReactNode {
  if (!text || typeof text !== "string") return text || null;

  const parts: React.ReactNode[] = [];
  const regex = /<mark>(.*?)<\/mark>/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    parts.push(
      <span key={key++} style={{ fontWeight: "bold", color: "#16a34a" }}>
        {match[1]}
      </span>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  if (parts.length === 0) {
    return text;
  }

  return <>{parts}</>;
}

