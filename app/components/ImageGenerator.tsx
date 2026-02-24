"use client";

import { useState, FormEvent } from "react";
import { Image as ImageIcon, Download, Loader2 } from "lucide-react";

interface GeneratedImage {
  prompt: string;
  imageUrl: string;
  size: string;
  style: string;
  id: string;
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState<"256x256" | "512x512" | "1024x1024">("512x512");
  const [style, setStyle] = useState<"vivid" | "natural">("vivid");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, size, style }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();
      setGeneratedImage(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.href = generatedImage.imageUrl;
    link.download = `generated-${generatedImage.id}.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
          <ImageIcon className="h-5 w-5 text-amber-400" />
          AI Image Generator
        </h3>
        <p className="mt-2 text-sm text-zinc-400">
          Generate images from text descriptions using AI
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Prompt Input */}
        <div>
          <label htmlFor="prompt" className="mb-2 block text-sm font-medium text-zinc-300">
            Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            rows={3}
            disabled={loading}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 disabled:opacity-50"
          />
        </div>

        {/* Size and Style Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="size" className="mb-2 block text-sm font-medium text-zinc-300">
              Size
            </label>
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value as typeof size)}
              disabled={loading}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 disabled:opacity-50"
            >
              <option value="256x256">256x256</option>
              <option value="512x512">512x512</option>
              <option value="1024x1024">1024x1024</option>
            </select>
          </div>

          <div>
            <label htmlFor="style" className="mb-2 block text-sm font-medium text-zinc-300">
              Style
            </label>
            <select
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value as typeof style)}
              disabled={loading}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 disabled:opacity-50"
            >
              <option value="vivid">Vivid</option>
              <option value="natural">Natural</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <ImageIcon className="h-5 w-5" />
              Generate Image
            </>
          )}
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-900/20 border border-red-800 p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Generated Image Display */}
      {generatedImage && (
        <div className="mt-6 space-y-4">
          <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800">
            <img
              src={generatedImage.imageUrl}
              alt={generatedImage.prompt}
              className="w-full object-contain"
              style={{ maxHeight: "500px" }}
            />
          </div>

          <div className="rounded-lg bg-zinc-800/50 p-4">
            <p className="text-sm font-medium text-zinc-300">Prompt:</p>
            <p className="mt-1 text-sm text-zinc-400">{generatedImage.prompt}</p>
            <div className="mt-3 flex gap-4 text-xs text-zinc-500">
              <span>Size: {generatedImage.size}</span>
              <span>Style: {generatedImage.style}</span>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-6 py-3 font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
          >
            <Download className="h-5 w-5" />
            Download Image
          </button>
        </div>
      )}

      {/* Example Prompts */}
      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-zinc-400">Example prompts:</p>
        <div className="flex flex-wrap gap-2">
          {[
            "A serene mountain landscape at sunset",
            "A futuristic city with flying cars",
            "A cozy coffee shop interior",
            "A cute robot painting a canvas",
          ].map((examplePrompt) => (
            <button
              key={examplePrompt}
              onClick={() => setPrompt(examplePrompt)}
              disabled={loading}
              className="rounded-full bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-zinc-700 disabled:opacity-50"
            >
              {examplePrompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
