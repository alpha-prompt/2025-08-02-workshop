import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface DemoCardProps {
  title: string;
  description: string;
  href: string;
}

export function DemoCard({ title, description, href }: DemoCardProps) {
  return (
    <div className="flex justify-center mb-12">
      <Card className="border-border bg-card hover:border-primary/50 transition-colors max-w-lg w-full">
        <CardHeader>
          <CardTitle className="terminal-text bloomberg-orange text-xl text-center">
            {title}
          </CardTitle>
          <CardDescription className="text-center text-base">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Link to={href}>
              <Button className="terminal-text">Explore Demo</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
