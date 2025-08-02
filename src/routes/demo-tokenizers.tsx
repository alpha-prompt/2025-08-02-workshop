import { createFileRoute } from "@tanstack/react-router";

import { getSimpleDemo } from "@/data/demo-cards";
import { TokenizerComparison } from "@/components/tokenizer-comparison";
import { TokenizerDemo } from "@/components/tokenizer-demo";
import { WorkshopLayout } from "@/components/workshop-layout";

export const Route = createFileRoute("/demo-tokenizers")({
  component: TokenizerDemoPage,
});

function TokenizerDemoPage() {
  const tokenizerDemo = getSimpleDemo("/demo-tokenizers");

  return (
    <WorkshopLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{tokenizerDemo.title}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {tokenizerDemo.description}
          </p>
        </div>

        <TokenizerDemo />

        <TokenizerComparison />
      </div>
    </WorkshopLayout>
  );
}
