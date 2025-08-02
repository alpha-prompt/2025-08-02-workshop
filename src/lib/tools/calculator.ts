import { tool } from "ai";
import { evaluate } from "mathjs";
import { z } from "zod";
import dedent from "dedent";

import { MATH_DEMO_PARAMETER_DESCRIPTIONS } from "../prompts/math";

export const addTool = tool({
  description: "Add two numbers together",
  parameters: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
  execute: async ({ a, b }) => {
    const result = a + b;
    return { operation: "addition", a, b, result };
  },
});

export const subtractTool = tool({
  description: "Subtract one number from another",
  parameters: z.object({
    a: z.number().describe("First number (minuend)"),
    b: z.number().describe("Second number (subtrahend)"),
  }),
  execute: async ({ a, b }) => {
    const result = a - b;
    return { operation: "subtraction", a, b, result };
  },
});

export const multiplyTool = tool({
  description: "Multiply two numbers together",
  parameters: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
  execute: async ({ a, b }) => {
    const result = a * b;
    return { operation: "multiplication", a, b, result };
  },
});

export const divideTool = tool({
  description: "Divide one number by another",
  parameters: z.object({
    a: z.number().describe("Dividend (number to be divided)"),
    b: z.number().describe("Divisor (number to divide by)"),
  }),
  execute: async ({ a, b }) => {
    if (b === 0) {
      return {
        operation: "division",
        a,
        b,
        error: "Cannot divide by zero",
      };
    }
    const result = a / b;
    return { operation: "division", a, b, result };
  },
});

export const calculatorTool = tool({
  description: dedent`
    Evaluate mathematical expressions using mathjs, including advanced functions.

    Examples:
    - Compound interest: 10000 * (1.07^15)
    - Square roots: sqrt(386154294354481)
    - Percentages: 48329 * 0.237
    - Trigonometry: sin(pi/2)
    - Powers: 2^10
  `,
  parameters: z.object({
    expression: z
      .string()
      .describe(MATH_DEMO_PARAMETER_DESCRIPTIONS.calculator.expression),
  }),
  execute: async ({ expression }) => {
    try {
      const result = evaluate(expression);

      if (typeof result !== "number" || isNaN(result) || !isFinite(result)) {
        throw new Error("Invalid calculation result");
      }

      return {
        expression,
        result,
      };
    } catch (error) {
      return {
        expression,
        error: `Unable to calculate this expression: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});
