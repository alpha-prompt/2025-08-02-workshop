import { createServerFileRoute } from "@tanstack/react-start/server";
import { streamText } from "ai";

import { DEMO_CONFIGS } from "@/lib/demos/configs";
import type { DemoId } from "@/lib/demos/types";
import { getModel } from "@/lib/models";
import { getWorkshopTools } from "@/lib/tools";

export const ServerRoute = createServerFileRoute("/api/chat").methods({
  POST: async ({ request }) => {
    const { messages, demoId }: { messages: any; demoId: DemoId } =
      await request.json();

    const config = DEMO_CONFIGS[demoId];
    if (!config) {
      return new Response(`Demo '${demoId}' not found`, { status: 404 });
    }

    const workshopTools = getWorkshopTools(config.tools);
    const model = getModel(config.model);

    const tools = workshopTools;

    const result = streamText({
      model,
      messages,
      system: config.systemPrompt,
      tools,
      toolCallStreaming: true,
      maxTokens: config.maxTokens || 2048,
      temperature: config.temperature || 0.7,
      onError: console.log,
      maxSteps: config.maxSteps,
    });

    return result.toDataStreamResponse();
  },
});
