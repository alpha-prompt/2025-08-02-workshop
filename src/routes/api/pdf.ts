import { createServerFileRoute } from "@tanstack/react-start/server";
import { streamText } from "ai";

import { getModel } from "@/lib/models";
import { PDF_SYSTEM_PROMPTS } from "@/lib/prompts/pdf";
import {
  generateExcelDataTool,
  generateMarkdownDataTool,
} from "@/lib/tools/pdf-analysis";

// Deterministic preprocessing functions
async function preprocessPDFMessages(
  messages: any[],
  outputFormat: "excel" | "markdown",
) {
  // Add format-specific context to the user message
  const formatInstruction =
    outputFormat === "excel"
      ? "\n\nIMPORTANT: After your analysis, you MUST call the generate-excel tool to create a downloadable Excel file with the extracted data."
      : "\n\nIMPORTANT: After your analysis, you MUST call the generate-markdown tool to create a downloadable markdown report.";

  return messages.map((message, index) => {
    if (message.role === "user" && index === messages.length - 1) {
      // Add format instruction to the last user message
      const textContent = message.content.find((c: any) => c.type === "text");
      if (textContent) {
        textContent.text += formatInstruction;
      }
    }
    return message;
  });
}

function getToolsForFormat(outputFormat: "excel" | "markdown") {
  return {
    [outputFormat === "excel" ? "generate-excel" : "generate-markdown"]:
      outputFormat === "excel"
        ? generateExcelDataTool
        : generateMarkdownDataTool,
  };
}

export const ServerRoute = createServerFileRoute("/api/pdf").methods({
  POST: async ({ request }) => {
    const { messages, outputFormat } = await request.json();

    // Validate output format
    if (!outputFormat || !["excel", "markdown"].includes(outputFormat)) {
      return new Response("Invalid output format", { status: 400 });
    }

    // Deterministic preprocessing
    const processedMessages = await preprocessPDFMessages(
      messages,
      outputFormat,
    );
    const tools = getToolsForFormat(outputFormat);
    const systemPrompt =
      PDF_SYSTEM_PROMPTS[outputFormat as keyof typeof PDF_SYSTEM_PROMPTS];

    const model = getModel("gpt-4o-mini");

    // Agentic processing
    const result = streamText({
      model,
      messages: processedMessages,
      system: systemPrompt,
      tools,
      toolCallStreaming: true,
      maxTokens: 4096,
      temperature: 0.3, // Lower temperature for more consistent analysis
      onError: console.log,
    });

    return result.toDataStreamResponse();
  },
});
