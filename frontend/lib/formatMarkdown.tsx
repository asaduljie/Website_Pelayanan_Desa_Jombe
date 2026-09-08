import React from 'react';

/**
 * Parses markdown-like text to React elements supporting:
 * - Images: ![alt](url)
 * - Links: [text](url)
 * - Headings: ## Heading 2, ### Heading 3
 * - Blockquotes: > quote
 * - Bold: **bold**
 * - Italic: *italic*
 * - Unordered list: - item or * item
 * - Ordered list: 1. item
 * - Dividers: ---
 */
export function renderRichArticle(content: string): React.ReactNode {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: React.ReactNode[] } | null = null;

  const flushList = (key: number) => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`list-${key}`} className="list-disc list-inside space-y-1 my-3 pl-2 text-slate-800">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`list-${key}`} className="list-decimal list-inside space-y-1 my-3 pl-2 text-slate-800">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  const parseInline = (text: string): React.ReactNode[] => {
    // 1. Parse Images: ![alt](url)
    const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
    // 2. Parse Links: [text](url)
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;

    // Tokenize line
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Combine image and link matching
    const combinedRegex = /(!?\[.*?\]\(.*?\))/g;
    const tokens = text.split(combinedRegex);

    return tokens.map((token, index) => {
      if (token.startsWith('![') && token.includes('](') && token.endsWith(')')) {
        const match = token.match(/!\[(.*?)\]\((.*?)\)/);
        if (match) {
          const alt = match[1];
          const src = match[2];
          return (
            <span key={index} className="block my-4">
              <img
                src={src}
                alt={alt}
                className="w-full max-h-[480px] object-cover rounded-2xl shadow-md border border-slate-200"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              {alt && (
                <span className="block text-center text-xs text-slate-500 italic mt-1.5">
                  {alt}
                </span>
              )}
            </span>
          );
        }
      }

      if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
        const match = token.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          const label = match[1];
          const href = match[2];
          return (
            <a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-800 hover:text-emerald-950 font-bold underline decoration-emerald-500 underline-offset-2 inline-flex items-center gap-0.5 transition-colors"
            >
              {parseBoldItalic(label)}
            </a>
          );
        }
      }

      return <React.Fragment key={index}>{parseBoldItalic(token)}</React.Fragment>;
    });
  };

  const parseBoldItalic = (raw: string): React.ReactNode => {
    // Parse **bold** and *italic*
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = raw.split(boldRegex);

    return parts.map((part, idx) => {
      if (idx % 2 === 1) {
        return <strong key={idx} className="font-extrabold text-slate-900">{part}</strong>;
      }
      // Check italic *text*
      const italicParts = part.split(/\*(.*?)\*/g);
      return italicParts.map((subPart, subIdx) => {
        if (subIdx % 2 === 1) {
          return <em key={subIdx} className="italic text-slate-800">{subPart}</em>;
        }
        return subPart;
      });
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check for Divider
    if (trimmed === '---' || trimmed === '***') {
      flushList(index);
      elements.push(<hr key={index} className="my-6 border-t border-slate-200" />);
      return;
    }

    // Check for Headings
    if (trimmed.startsWith('### ')) {
      flushList(index);
      elements.push(
        <h3 key={index} className="text-lg sm:text-xl font-extrabold text-slate-900 mt-6 mb-2 tracking-tight">
          {parseInline(trimmed.replace('### ', ''))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList(index);
      elements.push(
        <h2 key={index} className="text-xl sm:text-2xl font-black text-slate-900 mt-8 mb-3 tracking-tight border-b border-slate-100 pb-2">
          {parseInline(trimmed.replace('## ', ''))}
        </h2>
      );
      return;
    }

    // Check for Blockquote
    if (trimmed.startsWith('> ')) {
      flushList(index);
      elements.push(
        <blockquote key={index} className="border-l-4 border-emerald-700 bg-emerald-50/60 pl-4 py-2.5 my-3 rounded-r-xl text-slate-800 italic text-xs sm:text-sm">
          {parseInline(trimmed.replace(/^>\s*/, ''))}
        </blockquote>
      );
      return;
    }

    // Check for Unordered List
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemContent = parseInline(trimmed.substring(2));
      if (!currentList || currentList.type !== 'ul') {
        flushList(index);
        currentList = { type: 'ul', items: [itemContent] };
      } else {
        currentList.items.push(itemContent);
      }
      return;
    }

    // Check for Ordered List
    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (orderedMatch) {
      const itemContent = parseInline(orderedMatch[2]);
      if (!currentList || currentList.type !== 'ol') {
        flushList(index);
        currentList = { type: 'ol', items: [itemContent] };
      } else {
        currentList.items.push(itemContent);
      }
      return;
    }

    // Regular Paragraph
    flushList(index);
    if (trimmed.length > 0) {
      elements.push(
        <p key={index} className="text-xs sm:text-sm text-slate-800 leading-relaxed my-2.5">
          {parseInline(line)}
        </p>
      );
    } else {
      elements.push(<div key={index} className="h-1" />);
    }
  });

  flushList(lines.length);

  return <div className="space-y-1">{elements}</div>;
}
