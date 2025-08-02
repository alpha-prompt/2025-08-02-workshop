import { createFileRoute } from "@tanstack/react-router";

import { demoCards } from "@/data/demo-cards";
import { DemoCard } from "@/components/demo-card";
import { HeroSection } from "@/components/hero-section";
import { WorkshopLayout } from "@/components/workshop-layout";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <WorkshopLayout>
      <HeroSection />
      <div className="space-y-6">
        {demoCards.map((demo) => (
          <DemoCard
            key={demo.href}
            title={demo.title}
            description={demo.description}
            href={demo.href}
          />
        ))}
      </div>
    </WorkshopLayout>
  );
}
