import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { getDemoWithVariants } from "@/data/demo-cards";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { WorkshopThread } from "@/components/assistant-ui/workshop-thread";
import { WorkshopLayout } from "@/components/workshop-layout";

const mathSearchSchema = z.object({
  toolsEnabled: z.coerce.boolean().optional(),
});

export const Route = createFileRoute("/demo-math")({
  validateSearch: (search) => mathSearchSchema.parse(search),
  component: DemoMath,
});

function DemoMath() {
  const mathDemo = getDemoWithVariants("/demo-math");

  const { toolsEnabled } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const runtimeBasic = useChatRuntime({
    api: "/api/chat",
    body: {
      demoId: mathDemo.variants.basic.demoId,
    },
  });

  const runtimeEnhanced = useChatRuntime({
    api: "/api/chat",
    body: {
      demoId: mathDemo.variants.enhanced.demoId,
    },
  });

  return (
    <WorkshopLayout>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bloomberg-orange">
          {mathDemo.title}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {mathDemo.description}
        </p>
      </div>

      <div className="mb-6 flex justify-center">
        <div className="flex items-center gap-4 border rounded-lg p-4 bg-white">
          <div className="flex items-center space-x-3">
            <Switch
              checked={toolsEnabled}
              onCheckedChange={(checked) =>
                navigate({ search: { toolsEnabled: checked } })
              }
            />
            <span className="text-sm font-medium w-28 text-left">
              {toolsEnabled ? "Tool-Enhanced" : "Base Model"}
            </span>
          </div>
        </div>
      </div>

      <AssistantRuntimeProvider runtime={runtimeBasic}>
        <div style={{ display: !toolsEnabled ? "block" : "none" }}>
          <WorkshopThread
            title={`${mathDemo.variants.basic.title}: Raw LLM Math Capabilities`}
            description={mathDemo.variants.basic.description}
            suggestions={mathDemo.variants.basic.suggestions.map((suggestion) => ({
              text: suggestion,
              prompt: suggestion,
            }))}
          />
        </div>
      </AssistantRuntimeProvider>

      <AssistantRuntimeProvider runtime={runtimeEnhanced}>
        <div style={{ display: toolsEnabled ? "block" : "none" }}>
          <WorkshopThread
            title={`${mathDemo.variants.enhanced.title}: LLM with Calculator`}
            description={mathDemo.variants.enhanced.description}
            suggestions={mathDemo.variants.enhanced.suggestions.map((suggestion) => ({
              text: suggestion,
              prompt: suggestion,
            }))}
          />
        </div>
      </AssistantRuntimeProvider>

      <div className="flex justify-center mt-8">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Reset Chat
        </Button>
      </div>
    </WorkshopLayout>
  );
}
