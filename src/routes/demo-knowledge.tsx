import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { getDemoWithVariants } from "@/data/demo-cards";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { WorkshopThread } from "@/components/assistant-ui/workshop-thread";
import { WorkshopLayout } from "@/components/workshop-layout";

const knowledgeSearchSchema = z.object({
  toolsEnabled: z.coerce.boolean().optional(),
});

export const Route = createFileRoute("/demo-knowledge")({
  validateSearch: (search) => knowledgeSearchSchema.parse(search),
  component: DemoKnowledge,
});

function DemoKnowledge() {
  const knowledgeDemo = getDemoWithVariants("/demo-knowledge");

  const { toolsEnabled } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const runtimeBasic = useChatRuntime({
    api: "/api/chat",
    body: {
      demoId: knowledgeDemo.variants.basic.demoId,
    },
  });

  const runtimeEnhanced = useChatRuntime({
    api: "/api/chat",
    body: {
      demoId: knowledgeDemo.variants.enhanced.demoId,
    },
  });

  return (
    <WorkshopLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{knowledgeDemo.title}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {knowledgeDemo.description}
          </p>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-4 border rounded-lg p-4 bg-white">
            <div className="flex items-center space-x-3">
              <Switch
                checked={toolsEnabled}
                onCheckedChange={(checked) =>
                  navigate({ search: { toolsEnabled: checked } })
                }
              />
              <span className="text-sm font-medium w-28 text-left">
                {toolsEnabled
                  ? knowledgeDemo.variants.enhanced.title
                  : knowledgeDemo.variants.basic.title}
              </span>
            </div>
          </div>
        </div>

        <AssistantRuntimeProvider runtime={runtimeBasic}>
          <div style={{ display: !toolsEnabled ? "block" : "none" }}>
            <WorkshopThread
              title={`${knowledgeDemo.variants.basic.title}: Knowledge Cutoff Limitations`}
              description={knowledgeDemo.variants.basic.description}
              suggestions={knowledgeDemo.variants.basic.suggestions.map((suggestion) => ({
                text: suggestion,
                prompt: suggestion,
              }))}
            />
          </div>
        </AssistantRuntimeProvider>

        <AssistantRuntimeProvider runtime={runtimeEnhanced}>
          <div style={{ display: toolsEnabled ? "block" : "none" }}>
            <WorkshopThread
              title={`${knowledgeDemo.variants.enhanced.title}: Web Search + Client Database`}
              description={knowledgeDemo.variants.enhanced.description}
              suggestions={knowledgeDemo.variants.enhanced.suggestions.map((suggestion) => ({
                text: suggestion,
                prompt: suggestion,
              }))}
            />
          </div>
        </AssistantRuntimeProvider>

        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>
              What this demo illustrates about AI capabilities and limitations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <ul>
                <li>
                  <strong>Training Data Boundaries:</strong> LLMs are frozen in
                  time at their training cutoff date
                </li>
                <li>
                  <strong>Proprietary Data Access:</strong> Internal company
                  data requires explicit tool integration
                </li>
                <li>
                  <strong>Real-time Information:</strong> Web search tools
                  enable access to current events and market conditions
                </li>
                <li>
                  <strong>Competitive Advantage:</strong> Companies with better
                  data access and tool integration have superior AI capabilities
                </li>
                <li>
                  <strong>Privacy and Security:</strong> Proprietary tools must
                  be carefully designed to protect sensitive information
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Reset Chat
          </Button>
        </div>
      </div>
    </WorkshopLayout>
  );
}
