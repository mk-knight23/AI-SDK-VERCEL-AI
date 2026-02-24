import { NextRequest, NextResponse } from "next/server";
import { executeImageGenerationTool } from "@/lib/tools";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { prompt, size = "512x512", style = "vivid" } = await req.json();

    // Validate prompt
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Validate size
    const validSizes = ["256x256", "512x512", "1024x1024"];
    if (!validSizes.includes(size)) {
      return NextResponse.json(
        { error: `Invalid size. Must be one of: ${validSizes.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate style
    const validStyles = ["vivid", "natural"];
    if (!validStyles.includes(style)) {
      return NextResponse.json(
        { error: `Invalid style. Must be one of: ${validStyles.join(", ")}` },
        { status: 400 }
      );
    }

    // Execute image generation
    const result = await executeImageGenerationTool({ prompt, size, style });
    const data = JSON.parse(result);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    endpoint: "/api/generate-image",
    method: "POST",
    body: {
      prompt: "string (required)",
      size: "256x256 | 512x512 | 1024x1024 (optional, default: 512x512)",
      style: "vivid | natural (optional, default: vivid)",
    },
  });
}
