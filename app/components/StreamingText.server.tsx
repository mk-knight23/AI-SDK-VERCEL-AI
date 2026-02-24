/**
 * Server Component for streaming text responses
 * Demonstrates RSC patterns with streaming UI
 */

import { Suspense } from "react";
import { Sparkles } from "lucide-react";

interface StreamingTextProps {
  text: string;
  delay?: number;
}

function Skeleton() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-800" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-800" />
    </div>
  );
}

async function StreamedContent({ text, delay = 100 }: StreamingTextProps) {
  // Simulate async data fetching
  await new Promise((resolve) => setTimeout(resolve, delay));

  return (
    <div className="space-y-2">
      {text.split("\n").map((line, i) => (
        <p key={i} className="text-sm text-zinc-300">
          {line || "\u00A0"}
        </p>
      ))}
    </div>
  );
}

export default function StreamingText({ text, delay }: StreamingTextProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-amber-400" />
        <h4 className="text-sm font-semibold text-zinc-300">Server Component</h4>
      </div>
      <Suspense fallback={<Skeleton />}>
        <StreamedContent text={text} delay={delay} />
      </Suspense>
    </div>
  );
}
