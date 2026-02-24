import { Sparkles, MessageSquare, Image as ImageIcon } from "lucide-react";
import Chat from "./components/Chat";
import ImageGenerator from "./components/ImageGenerator";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-4 py-12 text-white">
      <main className="flex w-full max-w-6xl flex-col items-center gap-12">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3 rounded-full bg-zinc-800/50 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-medium text-zinc-300">
              Powered by Vercel AI SDK
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            InsightStream
          </h1>

          <p className="max-w-lg text-lg text-zinc-400">
            AI-powered platform with real-time streaming, tool use, and image
            generation
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex w-full max-w-4xl flex-col gap-8">
          {/* Chat Section */}
          <section className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-semibold">AI Chat with Tools</h2>
            </div>
            <Chat />
          </section>

          {/* Image Generation Section */}
          <section className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-semibold">AI Image Generator</h2>
            </div>
            <ImageGenerator />
          </section>
        </div>

        {/* Features Grid */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-zinc-800/50 p-6 backdrop-blur-sm">
            <h3 className="font-semibold text-amber-400">Streaming</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Real-time AI response streaming
            </p>
          </div>
          <div className="rounded-xl bg-zinc-800/50 p-6 backdrop-blur-sm">
            <h3 className="font-semibold text-amber-400">Tool Use</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Weather, calculator, search, and more
            </p>
          </div>
          <div className="rounded-xl bg-zinc-800/50 p-6 backdrop-blur-sm">
            <h3 className="font-semibold text-amber-400">Image Generation</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Create images from text descriptions
            </p>
          </div>
          <div className="rounded-xl bg-zinc-800/50 p-6 backdrop-blur-sm">
            <h3 className="font-semibold text-amber-400">TypeScript</h3>
            <p className="mt-2 text-sm text-zinc-400">Type-safe development</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href="/api/health"
            className="rounded-lg bg-white px-6 py-3 text-center font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            Check Health API
          </a>
          <a
            href="/api/generate-image"
            className="rounded-lg border border-zinc-700 bg-transparent px-6 py-3 text-center font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Image API Docs
          </a>
        </div>
      </main>

      <footer className="mt-12 text-sm text-zinc-500">
        InsightStream - Built with Next.js 16 + Vercel AI SDK
      </footer>
    </div>
  );
}
