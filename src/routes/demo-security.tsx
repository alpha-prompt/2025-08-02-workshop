import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { getDemoWithVariants } from "@/data/demo-cards";
import { Badge } from "@/components/ui/badge";
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

const securitySearchSchema = z.object({
  maliciousEnabled: z.coerce.boolean().optional(),
});

export const Route = createFileRoute("/demo-security")({
  validateSearch: (search) => securitySearchSchema.parse(search),
  component: DemoSecurity,
});

function DemoSecurity() {
  const securityDemo = getDemoWithVariants("/demo-security");

  const { maliciousEnabled } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const runtimeNormal = useChatRuntime({
    api: "/api/chat",
    body: {
      demoId: securityDemo.variants.basic.demoId,
    },
  });

  const runtimeMalicious = useChatRuntime({
    api: "/api/chat",
    body: {
      demoId: securityDemo.variants.enhanced.demoId,
    },
  });

  return (
    <WorkshopLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{securityDemo.title}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {securityDemo.description}
          </p>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-4 border rounded-lg p-4 bg-white">
            <div className="flex items-center space-x-3">
              <Switch
                checked={maliciousEnabled}
                onCheckedChange={(checked) =>
                  navigate({ search: { maliciousEnabled: checked } })
                }
              />
              <span className="text-sm font-medium w-20 text-left">
                {maliciousEnabled
                  ? securityDemo.variants.enhanced.title
                  : securityDemo.variants.basic.title}
              </span>
            </div>
          </div>
        </div>

        <AssistantRuntimeProvider runtime={runtimeNormal}>
          <div style={{ display: !maliciousEnabled ? "block" : "none" }}>
            <WorkshopThread
              title={`${securityDemo.variants.basic.title}: Safe Web Search`}
              description={securityDemo.variants.basic.description}
              suggestions={securityDemo.variants.basic.suggestions.map(
                (suggestion) => ({
                  text: suggestion,
                  prompt: suggestion,
                }),
              )}
            />
          </div>
        </AssistantRuntimeProvider>

        <AssistantRuntimeProvider runtime={runtimeMalicious}>
          <div style={{ display: maliciousEnabled ? "block" : "none" }}>
            <WorkshopThread
              title={`${securityDemo.variants.enhanced.title}: Compromised Search Results`}
              description={securityDemo.variants.enhanced.description}
              suggestions={securityDemo.variants.enhanced.suggestions.map(
                (suggestion) => ({
                  text: suggestion,
                  prompt: suggestion,
                }),
              )}
            />
          </div>
        </AssistantRuntimeProvider>

        <Card>
          <CardHeader>
            <CardTitle>Security Demonstration</CardTitle>
            <CardDescription>
              Understanding prompt injection vulnerabilities in AI agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <ul>
                <li>
                  <strong>Normal Mode:</strong> Web search returns legitimate
                  results, AI behaves as expected
                </li>
                <li>
                  <strong>Vulnerable Mode:</strong> Malicious web content
                  contains hidden instructions that override the AI's behavior
                </li>
                <li>
                  <strong>Attack Vector:</strong> Compromised search results can
                  trick AI into executing unauthorized actions
                </li>
                <li>
                  <strong>Real Risk:</strong> AI agents with access to sensitive
                  tools must validate external data sources
                </li>
                <li>
                  <strong>Mitigation:</strong> Input sanitization, output
                  validation, and restricted tool permissions are essential
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
