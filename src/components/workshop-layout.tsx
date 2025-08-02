import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

interface WorkshopLayoutProps {
  children: React.ReactNode;
}

export function WorkshopLayout({ children }: WorkshopLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
