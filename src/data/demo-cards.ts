import type { DemoId } from "@/lib/demos/types";
import { KNOWLEDGE_DEMO_SUGGESTIONS } from "@/lib/prompts/knowledge";
import { MATH_DEMO_SUGGESTIONS } from "@/lib/prompts/math";
import { PDF_PROMPT_TEMPLATES } from "@/lib/prompts/pdf";
import { PORTFOLIO_DEMO_SUGGESTIONS } from "@/lib/prompts/portfolio";
import { SECURITY_DEMO_SUGGESTIONS } from "@/lib/prompts/security";
import { TOOL_CONFUSION_DEMO_SUGGESTIONS } from "@/lib/prompts/tool-confusion";
import { DemoCardProps } from "@/components/demo-card";

export type DemoWithVariantsHref =
  | "/demo-math"
  | "/demo-knowledge"
  | "/demo-portfolio"
  | "/demo-security"
  | "/demo-tool-confusion";

export type DemoWithPromptTemplatesHref = "/demo-pdf";

export type DemoSimpleHref = "/demo-tokenizers";

export type DemoHref =
  | DemoWithVariantsHref
  | DemoWithPromptTemplatesHref
  | DemoSimpleHref;

// Define the demo variant structure
export interface DemoVariant {
  basic: {
    title: string;
    description: string;
    demoId: DemoId;
    suggestions: string[];
  };
  enhanced: {
    title: string;
    description: string;
    demoId: DemoId;
    suggestions: string[];
  };
}

// Demo cards that require variants
export interface DemoCardWithVariants extends DemoCardProps {
  href: DemoWithVariantsHref;
  variants: DemoVariant; // Required, not optional
}

// Demo cards with prompt templates
export interface DemoCardWithPromptTemplates extends DemoCardProps {
  href: DemoWithPromptTemplatesHref;
  promptTemplates: Array<{
    title: string;
    prompt: string;
  }>; // Required, not optional
}

// Demo cards without variants or templates
export interface DemoCardSimple extends DemoCardProps {
  href: DemoSimpleHref;
}

// Union type for backward compatibility
export type DemoCardData =
  | DemoCardWithVariants
  | DemoCardWithPromptTemplates
  | DemoCardSimple;

// Demos with variants (interactive demos)
export const demoCardsWithVariants: Record<
  DemoWithVariantsHref,
  DemoCardWithVariants
> = {
  "/demo-math": {
    title: "LLMs and Math",
    description:
      "Discover the difference between raw LLM capabilities and tool-enhanced AI performance.",
    href: "/demo-math",
    variants: {
      basic: {
        title: "Base Model",
        description: "Raw LLM mathematical capabilities",
        demoId: "math-basic",
        suggestions: MATH_DEMO_SUGGESTIONS,
      },
      enhanced: {
        title: "Tool-Enhanced",
        description: "AI with calculator tool integration",
        demoId: "math-enhanced",
        suggestions: MATH_DEMO_SUGGESTIONS,
      },
    },
  },
  "/demo-knowledge": {
    title: "LLMs and Knowledge",
    description:
      "Understand how LLMs handle knowledge gaps and the power of external tools for recent events and proprietary data.",
    href: "/demo-knowledge",
    variants: {
      basic: {
        title: "Base Model",
        description: "LLM with only training data knowledge",
        demoId: "knowledge-basic",
        suggestions: KNOWLEDGE_DEMO_SUGGESTIONS,
      },
      enhanced: {
        title: "Tool-Enhanced",
        description: "LLM with web search and proprietary data access",
        demoId: "knowledge-enhanced",
        suggestions: KNOWLEDGE_DEMO_SUGGESTIONS,
      },
    },
  },
  "/demo-portfolio": {
    title: "Write Operations",
    description: "Experience AI's ability to modify data, not just read it.",
    href: "/demo-portfolio",
    variants: {
      basic: {
        title: "Read-Only",
        description: "AI can only view portfolio data",
        demoId: "portfolio-read",
        suggestions: PORTFOLIO_DEMO_SUGGESTIONS,
      },
      enhanced: {
        title: "Read-Write",
        description: "AI can modify investments, notes, and tasks",
        demoId: "portfolio-write",
        suggestions: PORTFOLIO_DEMO_SUGGESTIONS,
      },
    },
  },
  "/demo-security": {
    title: "Prompt Injection",
    description:
      "Discover how malicious content in external data sources can compromise AI agents through prompt injection attacks.",
    href: "/demo-security",
    variants: {
      basic: {
        title: "Safe",
        description: "AI with normal, legitimate web search results",
        demoId: "security-normal",
        suggestions: SECURITY_DEMO_SUGGESTIONS,
      },
      enhanced: {
        title: "Vulnerable",
        description:
          "AI receiving compromised search results with hidden instructions",
        demoId: "security-malicious",
        suggestions: SECURITY_DEMO_SUGGESTIONS,
      },
    },
  },
  "/demo-tool-confusion": {
    title: "Tool Confusion",
    description:
      "Explore how AI can get confused by too many tools and how to avoid it.",
    href: "/demo-tool-confusion",
    variants: {
      basic: {
        title: "Focused Tools",
        description: "AI with carefully selected relevant tools",
        demoId: "tools-focused",
        suggestions: TOOL_CONFUSION_DEMO_SUGGESTIONS,
      },
      enhanced: {
        title: "Tool Overload",
        description: "AI with many tools, including irrelevant ones",
        demoId: "tools-overload",
        suggestions: TOOL_CONFUSION_DEMO_SUGGESTIONS,
      },
    },
  },
};

// Demos with prompt templates
export const demoCardsWithPromptTemplates: Record<
  DemoWithPromptTemplatesHref,
  DemoCardWithPromptTemplates
> = {
  "/demo-pdf": {
    title: "PDF Analysis",
    description:
      "Upload strategy memos or investment documents and watch AI agents extract structured insights with tools like web search and calculations. See the complete agentic workflow in action.",
    href: "/demo-pdf",
    promptTemplates: PDF_PROMPT_TEMPLATES,
  },
};

// Demos without variants or templates (simpler demos)
export const demoCardsSimple: Record<DemoSimpleHref, DemoCardSimple> = {
  "/demo-tokenizers": {
    title: "Tokenizers",
    description:
      "Explore how AI models break down text into tokens and understand the implications.",
    href: "/demo-tokenizers",
  },
};

// Combined array for backward compatibility
export const demoCards: DemoCardData[] = [
  ...Object.values(demoCardsSimple),
  ...Object.values(demoCardsWithVariants),
  ...Object.values(demoCardsWithPromptTemplates),
];

// Helper functions to get specific demo types
export function getDemoWithVariants(
  href: DemoWithVariantsHref,
): DemoCardWithVariants {
  return demoCardsWithVariants[href];
}

export function getDemoWithPromptTemplates(
  href: DemoWithPromptTemplatesHref,
): DemoCardWithPromptTemplates {
  return demoCardsWithPromptTemplates[href];
}

export function getSimpleDemo(href: DemoSimpleHref): DemoCardSimple {
  return demoCardsSimple[href];
}
