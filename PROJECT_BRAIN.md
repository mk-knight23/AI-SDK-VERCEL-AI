# Project Brain: vercel_ai

## Purpose
Implement Kazi's Agents Army routing in TypeScript for Vercel AI SDK workloads.

## Core Mechanism
- Route mission text to primary/support agents.
- Feed routed context into `streamText` or `generateText` with provider adapters.
- Support edge/server runtimes for low-latency delivery.

## Current State
- TypeScript routing adapter scaffold implemented.
- Demo execution path available via `npm run dev`.

## Production Plan
- Add provider wiring (`@ai-sdk/openai`, `@ai-sdk/anthropic`).
- Add tool-calling and MCP integration points.
- Add request-level logging and eval traces.
- Deploy to Vercel with environment-scoped secrets.

## Risks
- Provider parity differences in tool-calling behaviors.
- Edge runtime limits for long-lived or heavy workflows.
- Need strict output guards for autonomous task chains.
