import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { getDemoWithVariants } from "@/data/demo-cards";
import {
  type ClientNote,
  type PortfolioCompany,
  type PortfolioState,
  type Task,
} from "@/lib/portfolio-state";
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

const portfolioSearchSchema = z.object({
  writeEnabled: z.coerce.boolean().optional(),
});

export const Route = createFileRoute("/demo-portfolio")({
  validateSearch: (search) => portfolioSearchSchema.parse(search),
  component: DemoPortfolio,
});

function DemoPortfolio() {
  const portfolioDemo = getDemoWithVariants("/demo-portfolio");

  const { writeEnabled } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  // Fetch portfolio state with auto-refresh
  const {
    data: portfolioState = { companies: [], clientNotes: [], tasks: [] },
  } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async (): Promise<PortfolioState> => {
      const response = await fetch("/api/portfolio");
      if (!response.ok) {
        throw new Error("Failed to fetch portfolio state");
      }
      return response.json();
    },
    refetchInterval: 2000, // Poll every 2 seconds
  });

  const runtimeReadOnly = useChatRuntime({
    api: "/api/chat",
    body: {
      demoId: portfolioDemo.variants.basic.demoId,
    },
  });

  const runtimeReadWrite = useChatRuntime({
    api: "/api/chat",
    body: {
      demoId: portfolioDemo.variants.enhanced.demoId,
    },
  });

  // Reset portfolio mutation
  const resetMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      const response = await fetch("/api/portfolio/reset", { method: "POST" });
      if (!response.ok) {
        throw new Error("Failed to reset portfolio");
      }
    },
    onSuccess: () => {
      // Reset everything by reloading the page
      window.location.reload();
    },
  });

  const formatCurrencyMillions = (amount: number) => {
    const millions = amount / 1000000;
    return `$${millions.toFixed(1)}M`;
  };

  return (
    <WorkshopLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{portfolioDemo.title}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {portfolioDemo.description} Watch the portfolio update in real-time
            as the AI makes changes.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-4 border rounded-lg p-4 bg-white">
            <div className="flex items-center space-x-3">
              <Switch
                checked={writeEnabled}
                onCheckedChange={(checked) =>
                  navigate({ search: { writeEnabled: checked } })
                }
              />
              <span className="text-sm font-medium w-20 text-left">
                {writeEnabled
                  ? portfolioDemo.variants.enhanced.title
                  : portfolioDemo.variants.basic.title}
              </span>
            </div>
          </div>
        </div>

        {/* Live Portfolio View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span suppressHydrationWarning>
                  Portfolio ({portfolioState.companies.length})
                </span>
                <Badge variant="outline">Live Data</Badge>
              </CardTitle>
              <CardDescription>Portfolio company updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {portfolioState.companies.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No portfolio companies
                  </p>
                ) : (
                  portfolioState.companies.map(
                    (company: PortfolioCompany, idx: number) => {
                      return (
                        <div
                          key={company.name}
                          className="p-3 border rounded space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{company.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {company.sector}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>
                              Revenue: {formatCurrencyMillions(company.revenue)}
                            </div>
                            <div>
                              Valuation:{" "}
                              {formatCurrencyMillions(company.currentValuation)}
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span suppressHydrationWarning>
                  Client Notes ({portfolioState.clientNotes.length})
                </span>
                <Badge variant="outline">Live Data</Badge>
              </CardTitle>
              <CardDescription>Recent client interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {portfolioState.clientNotes.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No notes</p>
                ) : (
                  portfolioState.clientNotes
                    .slice(-3)
                    .map((note: ClientNote) => (
                      <div key={note.id} className="p-2 border rounded">
                        <div className="font-medium text-sm">
                          {note.clientName}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {note.content}
                        </div>
                        <div
                          className="text-xs text-muted-foreground mt-1"
                          suppressHydrationWarning
                        >
                          {new Date(note.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span suppressHydrationWarning>
                  Tasks (
                  {portfolioState.tasks.filter((t) => !t.completed).length})
                </span>
                <Badge variant="outline">Live Data</Badge>
              </CardTitle>
              <CardDescription>Pending action items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {portfolioState.tasks.filter((task: Task) => !task.completed)
                  .length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No pending tasks
                  </p>
                ) : (
                  portfolioState.tasks
                    .filter((task: Task) => !task.completed)
                    .slice(-3)
                    .map((task: Task) => (
                      <div key={task.id} className="p-2 border rounded">
                        <div className="flex items-center justify-between">
                          <div className="text-sm">{task.description}</div>
                          <Badge
                            variant={
                              task.priority === "high"
                                ? "success"
                                : task.priority === "medium"
                                  ? "warning"
                                  : "info"
                            }
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <div
                          className="text-xs text-muted-foreground mt-1"
                          suppressHydrationWarning
                        >
                          {new Date(task.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Chat Interface */}
        <AssistantRuntimeProvider runtime={runtimeReadOnly}>
          <div style={{ display: !writeEnabled ? "block" : "none" }}>
            <WorkshopThread
              title={`${portfolioDemo.variants.basic.title}: AI Can Only View Data`}
              description={portfolioDemo.variants.basic.description}
              suggestions={portfolioDemo.variants.basic.suggestions.map((suggestion) => ({
                text: suggestion,
                prompt: suggestion,
              }))}
            />
          </div>
        </AssistantRuntimeProvider>

        <AssistantRuntimeProvider runtime={runtimeReadWrite}>
          <div style={{ display: writeEnabled ? "block" : "none" }}>
            <WorkshopThread
              title={`${portfolioDemo.variants.enhanced.title}: AI Can Modify Data`}
              description={`${portfolioDemo.variants.enhanced.description}. Watch the live data update above!`}
              suggestions={portfolioDemo.variants.enhanced.suggestions.map((suggestion) => ({
                text: suggestion,
                prompt: suggestion,
              }))}
            />
          </div>
        </AssistantRuntimeProvider>

        <div className="flex justify-center">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => resetMutation.mutate()}
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending ? "Resetting..." : "Reset Demo Data"}
          </Button>
        </div>
      </div>
    </WorkshopLayout>
  );
}
