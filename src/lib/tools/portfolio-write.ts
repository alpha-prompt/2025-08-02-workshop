import { tool } from "ai";
import { z } from "zod";

import {
  addBackendClientNote,
  addBackendPortfolioUpdate,
  addBackendTask,
  completeBackendTask,
} from "../portfolio-backend";
import {
  PORTFOLIO_DEMO_PARAMETER_DESCRIPTIONS,
  PORTFOLIO_DEMO_TOOL_DESCRIPTIONS,
} from "../prompts/portfolio";

export const addPortfolioUpdateTool = tool({
  description: PORTFOLIO_DEMO_TOOL_DESCRIPTIONS["add-portfolio-update"],
  parameters: z.object({
    companyName: z
      .string()
      .describe(PORTFOLIO_DEMO_PARAMETER_DESCRIPTIONS["add-portfolio-update"].companyName),
    revenue: z
      .number()
      .positive()
      .optional()
      .describe(PORTFOLIO_DEMO_PARAMETER_DESCRIPTIONS["add-portfolio-update"].revenue),
    valuation: z
      .number()
      .positive()
      .optional()
      .describe(PORTFOLIO_DEMO_PARAMETER_DESCRIPTIONS["add-portfolio-update"].valuation),
    sector: z
      .string()
      .optional()
      .describe(PORTFOLIO_DEMO_PARAMETER_DESCRIPTIONS["add-portfolio-update"].sector),
  }),
  execute: async ({ companyName, revenue, valuation, sector }) => {
    try {
      const company = addBackendPortfolioUpdate({
        companyName,
        revenue,
        valuation,
        sector,
      });

      return {
        success: true,
        message: `Successfully updated portfolio company: ${company.name}`,
        company: {
          name: company.name,
          sector: company.sector,
          currentValuation: company.currentValuation,
          revenue: company.revenue,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to update portfolio company: ${error instanceof Error ? error.message : "Unknown error"}`,
        company: null,
      };
    }
  },
});

export const addClientNoteTool = tool({
  description: PORTFOLIO_DEMO_TOOL_DESCRIPTIONS["add-client-note"],
  parameters: z.object({
    clientName: z
      .string()
      .describe(
        PORTFOLIO_DEMO_PARAMETER_DESCRIPTIONS["add-client-note"].clientName,
      ),
    content: z
      .string()
      .describe(
        PORTFOLIO_DEMO_PARAMETER_DESCRIPTIONS["add-client-note"].content,
      ),
  }),
  execute: async ({ clientName, content }) => {
    try {
      const note = addBackendClientNote(clientName, content);

      return {
        success: true,
        message: `Successfully added note for ${clientName}`,
        note: {
          id: note.id,
          clientName: note.clientName,
          content: note.content,
          createdAt: note.createdAt,
          createdDate: new Date(note.createdAt).toLocaleDateString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to add client note: ${error instanceof Error ? error.message : "Unknown error"}`,
        note: null,
      };
    }
  },
});

export const createTaskTool = tool({
  description: PORTFOLIO_DEMO_TOOL_DESCRIPTIONS["create-task"],
  parameters: z.object({
    description: z
      .string()
      .describe(
        PORTFOLIO_DEMO_PARAMETER_DESCRIPTIONS["create-task"].description,
      ),
    priority: z
      .enum(["low", "medium", "high"])
      .default("medium")
      .describe(PORTFOLIO_DEMO_PARAMETER_DESCRIPTIONS["create-task"].priority),
  }),
  execute: async ({ description, priority }) => {
    try {
      const task = addBackendTask(description, priority);

      return {
        success: true,
        message: `Successfully created ${priority} priority task`,
        task: {
          id: task.id,
          description: task.description,
          priority: task.priority,
          completed: task.completed,
          createdAt: task.createdAt,
          createdDate: new Date(task.createdAt).toLocaleDateString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create task: ${error instanceof Error ? error.message : "Unknown error"}`,
        task: null,
      };
    }
  },
});

export const completeTaskTool = tool({
  description: PORTFOLIO_DEMO_TOOL_DESCRIPTIONS["complete-task"],
  parameters: z.object({
    taskId: z
      .string()
      .describe(PORTFOLIO_DEMO_PARAMETER_DESCRIPTIONS["complete-task"].taskId),
  }),
  execute: async ({ taskId }) => {
    try {
      const completedTask = completeBackendTask(taskId);

      if (!completedTask) {
        return {
          success: false,
          message: `Task with ID ${taskId} not found`,
          task: null,
        };
      }

      return {
        success: true,
        message: `Successfully completed task: ${completedTask.description}`,
        task: {
          id: completedTask.id,
          description: completedTask.description,
          priority: completedTask.priority,
          completed: completedTask.completed,
          createdAt: completedTask.createdAt,
          createdDate: new Date(completedTask.createdAt).toLocaleDateString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to complete task: ${error instanceof Error ? error.message : "Unknown error"}`,
        task: null,
      };
    }
  },
});
