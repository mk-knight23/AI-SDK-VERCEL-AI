import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import {
  weatherToolDefinition,
  executeWeatherTool,
  calculatorToolDefinition,
  executeCalculatorTool,
  webSearchToolDefinition,
  executeWebSearchTool,
  imageGenerationToolDefinition,
  executeImageGenerationTool,
} from "@/lib/tools";
import {
  ValidationError,
  formatErrorResponse,
  validateRequired,
  validateEnum,
} from "@/lib/errors";

export const maxDuration = 30;

// Valid models
const VALID_MODELS = [
  "gpt-4o-mini",
  "gpt-4o",
  "o1-mini",
  "o1-preview",
] as const;
type Model = (typeof VALID_MODELS)[number];

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate messages
    const messages = validateRequired(body.messages, "messages");
    if (!Array.isArray(messages)) {
      throw new ValidationError("Messages must be an array", "messages");
    }

    // Validate and set model
    const model = validateEnum<Model>(
      body.model || "gpt-4o-mini",
      "model",
      VALID_MODELS,
    );

    // Select model
    const selectedModel = openai(model);

    const result = streamText({
      model: selectedModel,
      messages,
      tools: {
        weather: tool({
          description: weatherToolDefinition.description,
          parameters: weatherToolDefinition.parameters,
          execute: executeWeatherTool,
        }),
        calculator: tool({
          description: calculatorToolDefinition.description,
          parameters: calculatorToolDefinition.parameters,
          execute: executeCalculatorTool,
        }),
        webSearch: tool({
          description: webSearchToolDefinition.description,
          parameters: webSearchToolDefinition.parameters,
          execute: executeWebSearchTool,
        }),
        imageGeneration: tool({
          description: imageGenerationToolDefinition.description,
          parameters: imageGenerationToolDefinition.parameters,
          execute: executeImageGenerationTool,
        }),
      },
      maxSteps: 5,
      temperature: body.temperature ?? 0.7,
      maxTokens: body.maxTokens ?? 2048,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    if (error instanceof ValidationError) {
      return new Response(JSON.stringify(formatErrorResponse(error)), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(formatErrorResponse(error)), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
