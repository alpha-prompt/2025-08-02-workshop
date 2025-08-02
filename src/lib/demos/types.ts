import type { ModelName } from "../models";
import type { ToolName } from "../tools/index";

export type DemoId =
  | "math-basic"
  | "math-enhanced"
  | "knowledge-basic"
  | "knowledge-enhanced"
  | "portfolio-read"
  | "portfolio-write"
  | "tools-focused"
  | "security-normal"
  | "security-malicious"
  | "tools-overload";

export interface DemoConfig {
  id: DemoId;
  systemPrompt: string;
  tools: ToolName[];
  model: ModelName;
  maxTokens?: number;
  temperature?: number;
  maxSteps?: number;
}

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
