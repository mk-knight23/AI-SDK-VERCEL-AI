"use client";

import { useState } from "react";
import { Settings, Check } from "lucide-react";

const MODELS = [
  { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Fast and efficient" },
  { id: "gpt-4o", name: "GPT-4o", description: "Balanced performance" },
  { id: "o1-mini", name: "o1-mini", description: "Advanced reasoning" },
  { id: "o1-preview", name: "o1-preview", description: "Best reasoning" },
] as const;

type Model = (typeof MODELS)[number]["id"];

interface ModelSelectorProps {
  selectedModel: Model;
  onModelChange: (model: Model) => void;
}

export default function ModelSelector({
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedModelData = MODELS.find((m) => m.id === selectedModel);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-700"
      >
        <Settings className="h-4 w-4" />
        <span>{selectedModelData?.name || "Select Model"}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl">
            <div className="p-2">
              <p className="mb-2 px-2 text-xs font-medium text-zinc-500">
                Select AI Model
              </p>
              {MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-zinc-800"
                >
                  <div className="mt-0.5">
                    {selectedModel === model.id ? (
                      <Check className="h-4 w-4 text-amber-400" />
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      {model.name}
                    </p>
                    <p className="text-xs text-zinc-500">{model.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
