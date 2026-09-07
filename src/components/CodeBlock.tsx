import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'text', title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  return (
    <div className="relative my-3 rounded-lg overflow-hidden border border-[#334155] bg-[#0F172A]">
      {/* Code header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1E293B] border-b border-[#334155] text-xs text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="font-mono text-[#F8FAFC] font-medium">{title || language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0F172A] transition-colors text-[11px] cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-[#10B981] font-mono">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="font-mono">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content with line numbers */}
      <div className="p-3.5 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02]">
                <td className="pr-4 select-none text-slate-500 text-right w-8 align-top text-[11px]">
                  {idx + 1}
                </td>
                <td className="text-[#F8FAFC] whitespace-pre">
                  {highlightSyntax(line, language)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Lightweight developer syntax tokenizer for dark mode
function highlightSyntax(line: string, _lang: string): React.ReactNode {
  // Simple token matching for comments
  if (line.trim().startsWith('#') || line.trim().startsWith('//')) {
    return <span className="text-slate-500 italic">{line}</span>;
  }

  // Keywords
  const keywords = /\b(def|class|return|if|else|elif|for|while|import|from|in|as|async|await|function|const|let|var|type|interface|public|private|static|void|int|new|throw|try|catch|package|fn|mut|match|defer|struct)\b/g;
  // Strings
  const strings = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
  // Numbers
  const numbers = /\b(\d+)\b/g;

  // Render with styled tokens
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Match strings and keywords safely
  const regex = new RegExp(`(${keywords.source})|(${strings.source})|(${numbers.source})`, 'g');
  let match;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.substring(lastIndex, match.index));
    }

    if (match[1]) {
      // Keyword
      parts.push(<span key={match.index} className="text-purple-400 font-semibold">{match[1]}</span>);
    } else if (match[2]) {
      // String
      parts.push(<span key={match.index} className="text-emerald-300">{match[2]}</span>);
    } else if (match[4]) {
      // Number
      parts.push(<span key={match.index} className="text-amber-300">{match[4]}</span>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    parts.push(line.substring(lastIndex));
  }

  return parts.length > 0 ? parts : line;
}
