"use client";

import { useChat } from "@ai-sdk/react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Wrench,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { useRef, useEffect, useState, useCallback } from "react";
import ModelSelector from "./ModelSelector";

interface ToolCall {
  toolName: string;
  args: Record<string, unknown>;
  result?: string;
}

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  result?: unknown;
}

type Model = "gpt-4o-mini" | "gpt-4o" | "o1-mini" | "o1-preview";

export default function Chat() {
  const [selectedModel, setSelectedModel] = useState<Model>("gpt-4o-mini");

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    reload,
  } = useChat({
    api: "/api/chat",
    body: {
      model: selectedModel,
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderToolCall = (toolInvocation: ToolInvocation) => {
    const { toolName, args, result } = toolInvocation;

    let toolIcon = <Wrench className="h-4 w-4" />;
    let toolLabel = toolName;

    if (toolName === "weather") {
      toolLabel = "Weather";
    } else if (toolName === "calculator") {
      toolLabel = "Calculator";
    } else if (toolName === "webSearch") {
      toolLabel = "Web Search";
    } else if (toolName === "imageGeneration") {
      toolIcon = <ImageIcon className="h-4 w-4" />;
      toolLabel = "Image Generation";
    }

    return (
      <div
        key={toolInvocation.toolCallId}
        className="my-2 rounded-lg bg-zinc-800/50 p-3"
      >
        <div className="flex items-center gap-2 text-sm text-amber-400">
          {toolIcon}
          <span className="font-medium">{toolLabel}</span>
        </div>
        <div className="mt-2 text-xs text-zinc-500">
          <span className="font-medium">Args:</span>{" "}
          {JSON.stringify(args, null, 2)}
        </div>
        {result && (
          <div className="mt-2">
            {toolName === "imageGeneration" && typeof result === "string" ? (
              (() => {
                try {
                  const parsed = JSON.parse(result);
                  return (
                    <div className="space-y-2">
                      <img
                        src={parsed.imageUrl}
                        alt={parsed.prompt}
                        className="max-w-xs rounded-lg border border-zinc-700"
                      />
                      <p className="text-xs text-zinc-400">
                        Prompt: {parsed.prompt}
                      </p>
                    </div>
                  );
                } catch {
                  return <pre className="text-xs text-zinc-400">{result}</pre>;
                }
              })()
            ) : (
              <pre className="overflow-x-auto text-xs text-zinc-400">
                {typeof result === "string"
                  ? result
                  : JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-[600px] w-full max-w-2xl flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-white">AI Assistant</h2>
            <p className="text-sm text-zinc-400">
              {isLoading ? "Thinking..." : "Ready to help"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
              title="Clear conversation"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-zinc-800/50 p-4">
              <Bot className="h-8 w-8 text-zinc-400" />
            </div>
            <p className="text-zinc-400">
              Start a conversation with the AI assistant.
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Ask about weather, calculations, web searches, or image generation
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                Weather
              </span>
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                Calculator
              </span>
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                Web Search
              </span>
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                Image Generation
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    message.role === "user"
                      ? "bg-zinc-700"
                      : "bg-gradient-to-br from-amber-400 to-orange-500"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-zinc-300" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === "user"
                      ? "bg-zinc-700 text-white"
                      : "bg-zinc-800 text-zinc-200"
                  }`}
                >
                  {/* Tool invocations */}
                  {message.toolInvocations &&
                    message.toolInvocations.length > 0 && (
                      <div className="space-y-2">
                        {message.toolInvocations.map((toolInvocation) =>
                          renderToolCall(toolInvocation as ToolInvocation),
                        )}
                      </div>
                    )}

                  {/* Message content */}
                  {message.content && (
                    <p className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-zinc-800 px-6 py-4"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message... (try: 'What's the weather in Tokyo?')"
            disabled={isLoading}
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-3 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
