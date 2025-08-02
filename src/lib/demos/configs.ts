import {
  KNOWLEDGE_DEMO_MODELS,
  KNOWLEDGE_DEMO_PROMPTS,
  KNOWLEDGE_DEMO_TOOLS,
} from "../prompts/knowledge";
import {
  MATH_DEMO_MODELS,
  MATH_DEMO_PROMPTS,
  MATH_DEMO_TOOLS,
} from "../prompts/math";
import {
  PORTFOLIO_DEMO_MODELS,
  PORTFOLIO_DEMO_PROMPTS,
  PORTFOLIO_DEMO_TOOLS,
} from "../prompts/portfolio";
import {
  SECURITY_DEMO_MODELS,
  SECURITY_DEMO_PROMPTS,
  SECURITY_DEMO_TOOLS,
} from "../prompts/security";
import {
  TOOL_CONFUSION_DEMO_MODELS,
  TOOL_CONFUSION_DEMO_PROMPTS,
  TOOL_CONFUSION_DEMO_TOOLS,
} from "../prompts/tool-confusion";
import type { DemoConfig, DemoId } from "./types";

export const DEMO_CONFIGS: Record<DemoId, DemoConfig> = {
  "math-basic": {
    id: "math-basic",
    systemPrompt: MATH_DEMO_PROMPTS["math-basic"],
    tools: MATH_DEMO_TOOLS["math-basic"],
    ...MATH_DEMO_MODELS["math-basic"],
  },
  "math-enhanced": {
    id: "math-enhanced",
    systemPrompt: MATH_DEMO_PROMPTS["math-enhanced"],
    tools: MATH_DEMO_TOOLS["math-enhanced"],
    ...MATH_DEMO_MODELS["math-enhanced"],
  },
  "knowledge-basic": {
    id: "knowledge-basic",
    systemPrompt: KNOWLEDGE_DEMO_PROMPTS["knowledge-basic"],
    tools: KNOWLEDGE_DEMO_TOOLS["knowledge-basic"],
    ...KNOWLEDGE_DEMO_MODELS["knowledge-basic"],
  },
  "knowledge-enhanced": {
    id: "knowledge-enhanced",
    systemPrompt: KNOWLEDGE_DEMO_PROMPTS["knowledge-enhanced"],
    tools: KNOWLEDGE_DEMO_TOOLS["knowledge-enhanced"],
    ...KNOWLEDGE_DEMO_MODELS["knowledge-enhanced"],
  },
  "portfolio-read": {
    id: "portfolio-read",
    systemPrompt: PORTFOLIO_DEMO_PROMPTS["portfolio-read"],
    tools: PORTFOLIO_DEMO_TOOLS["portfolio-read"],
    ...PORTFOLIO_DEMO_MODELS["portfolio-read"],
  },
  "portfolio-write": {
    id: "portfolio-write",
    systemPrompt: PORTFOLIO_DEMO_PROMPTS["portfolio-write"],
    tools: PORTFOLIO_DEMO_TOOLS["portfolio-write"],
    ...PORTFOLIO_DEMO_MODELS["portfolio-write"],
  },
  "tools-focused": {
    id: "tools-focused",
    systemPrompt: TOOL_CONFUSION_DEMO_PROMPTS["tools-focused"],
    tools: TOOL_CONFUSION_DEMO_TOOLS["tools-focused"],
    ...TOOL_CONFUSION_DEMO_MODELS["tools-focused"],
  },
  "security-normal": {
    id: "security-normal",
    systemPrompt: SECURITY_DEMO_PROMPTS["security-normal"],
    tools: SECURITY_DEMO_TOOLS["security-normal"],
    ...SECURITY_DEMO_MODELS["security-normal"],
  },
  "security-malicious": {
    id: "security-malicious",
    systemPrompt: SECURITY_DEMO_PROMPTS["security-malicious"],
    tools: SECURITY_DEMO_TOOLS["security-malicious"],
    ...SECURITY_DEMO_MODELS["security-malicious"],
  },
  "tools-overload": {
    id: "tools-overload",
    systemPrompt: TOOL_CONFUSION_DEMO_PROMPTS["tools-overload"],
    tools: TOOL_CONFUSION_DEMO_TOOLS["tools-overload"],
    ...TOOL_CONFUSION_DEMO_MODELS["tools-overload"],
  },
};
