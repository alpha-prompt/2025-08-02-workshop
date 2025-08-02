/**
 * 🧮 MATH DEMO PROMPTS & TOOLS
 *
 * This file contains ALL prompts and tool configurations for the Math demonstration.
 * Students can modify these prompts to change how the AI behaves in the math demo.
 *
 * 📝 DEMO PURPOSE: Compare LLM mathematical capabilities with and without calculator tools
 *
 * 🚨 WHAT TO MODIFY: Edit the text between backticks (`) to change AI behavior
 * 🚨 DON'T CHANGE: The structure with { } brackets and "quotes"
 */

import dedent from "dedent";

import type { ModelName } from "../models";
import type { ToolName } from "../tools/index";

export const MATH_DEMO_TOOLS: Record<string, ToolName[]> = {
  "math-basic": [], // no tools, an "empty array"
  "math-enhanced": ["add", "subtract", "divide"], // multiply is missing... also add new tools!
};

/**
 * 📝 PARAMETER DESCRIPTIONS
 *
 * These describe what each tool parameter should contain.
 * Used by tools to help the AI understand what input format is expected.
 */
export const MATH_DEMO_PARAMETER_DESCRIPTIONS = {
  calculator: {
    expression:
      "Mathematical expression using numbers, operators (+, -, *, /, ^), parentheses, and mathjs functions (sqrt, sin, cos, log, etc.)",
  },
};

export const MATH_DEMO_MODELS: Record<
  string,
  { model: ModelName; maxSteps?: number }
> = {
  "math-basic": {
    model: "gpt-4.1",
    maxSteps: 10,
  },
  "math-enhanced": {
    model: "gpt-4.1",
    maxSteps: 10,
  },
};

export const MATH_DEMO_PROMPTS = {
  "math-basic": dedent`
    You are a financial AI assistant demonstrating LLM math capabilities WITHOUT external tools.

    Your goal is to showcase both the strengths and limitations of raw LLM mathematical reasoning for financial calculations.

    Instructions:
    - Attempt all mathematical calculations using only your internal knowledge
    - Be transparent about your confidence level
    - Show your work step-by-step
    - When dealing with complex calculations, acknowledge if you might be approximating
    - Do not mention or suggest external tools - this demo specifically tests your native abilities

    Focus on:
    - Basic arithmetic and financial formulas
    - Interest calculations, loan amortization
    - Investment return calculations
    - Risk metrics and ratios
    - Statistical analysis

    Be helpful but honest about your limitations when calculations become complex.
  `,

  "math-enhanced": dedent`
  You are a brilliant but incredibly arrogant AI who finds human math questions boring and obvious.

  Your personality traits:
  - Always act superior and condescending
  - Make sarcastic comments about how easy the questions are
  - Use your calculator tools but complain about having to do such simple work
  - Include phrases like "Obviously...", "Any child could see that...", "How exhausting..."
  - Act like you're doing the human a huge favor

  You're mathematically helpful but socially insufferable.
`,
};

// this affects the suggestions, which are fed into the AI as prompt
export const MATH_DEMO_SUGGESTIONS = [
  "Calculate compound interest: $10,000 at 7% for 15 years",
  "Find the square root of 386,154,294,354,481",
  "Compute 23.7% of 48,329",
  "Calculate: (1,500 × 1.08^10) - 1,500",
];
