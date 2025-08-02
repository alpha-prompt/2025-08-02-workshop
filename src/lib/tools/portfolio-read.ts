import { tool } from "ai";
import { z } from "zod";

import { getBackendPortfolioState } from "../portfolio-backend";
import {
  PORTFOLIO_DEMO_PARAMETER_DESCRIPTIONS,
  PORTFOLIO_DEMO_TOOL_DESCRIPTIONS,
} from "../prompts/portfolio";

export const viewPortfolioTool = tool({
  description: PORTFOLIO_DEMO_TOOL_DESCRIPTIONS["view-portfolio"],
  parameters: z.object({
    companyName: z
      .string()
      .optional()
      .describe(PORTFOLIO_DEMO_PARAMETER_DESCRIPTIONS["view-portfolio"].companyName),
  }),
  execute: async ({ companyName }) => {
    const state = getBackendPortfolioState();
    let companies = state.companies;

    if (companyName) {
      companies = companies.filter(
        (company) => company.name.toLowerCase().includes(companyName.toLowerCase()),
      );
    }

    if (companies.length === 0) {
      return {
        message: companyName
          ? `No portfolio companies found matching: ${companyName}`
          : "Portfolio is currently empty",
        companies: [],
        totalValue: 0,
      };
    }

    const totalValue = companies.reduce(
      (sum, company) => sum + company.currentValuation,
      0,
    );

    const totalRevenue = companies.reduce(
      (sum, company) => sum + company.revenue,
      0,
    );

    return {
      message: `Portfolio contains ${companies.length} company(ies)`,
      companies: companies.map((company) => ({
        name: company.name,
        sector: company.sector,
        currentValuation: company.currentValuation,
        revenue: company.revenue,
      })),
      summary: {
        totalValue: Math.round(totalValue * 100) / 100,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        companiesCount: companies.length,
      },
    };
  },
});

export const getClientNotesTool = tool({
  description: PORTFOLIO_DEMO_TOOL_DESCRIPTIONS["get-client-notes"],
  parameters: z.object({
    clientName: z
      .string()
      .optional()
      .describe(
        PORTFOLIO_DEMO_PARAMETER_DESCRIPTIONS["get-client-notes"].clientName,
      ),
  }),
  execute: async ({ clientName }) => {
    const state = getBackendPortfolioState();
    let notes = state.clientNotes;

    if (clientName) {
      notes = notes.filter((note) =>
        note.clientName.toLowerCase().includes(clientName.toLowerCase()),
      );
    }

    if (notes.length === 0) {
      return {
        message: clientName
          ? `No notes found for client: ${clientName}`
          : "No client notes available",
        notes: [],
      };
    }

    return {
      message: `Found ${notes.length} note(s)${
        clientName ? ` for ${clientName}` : ""
      }`,
      notes: notes.map((note) => ({
        id: note.id,
        clientName: note.clientName,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        lastModified: new Date(note.updatedAt).toLocaleDateString(),
      })),
    };
  },
});

export const listTasksTool = tool({
  description: PORTFOLIO_DEMO_TOOL_DESCRIPTIONS["list-tasks"],
  parameters: z.object({
    showCompleted: z
      .boolean()
      .optional()
      .default(false)
      .describe(
        PORTFOLIO_DEMO_PARAMETER_DESCRIPTIONS["list-tasks"].showCompleted,
      ),
    priority: z
      .enum(["low", "medium", "high"])
      .optional()
      .describe(PORTFOLIO_DEMO_PARAMETER_DESCRIPTIONS["list-tasks"].priority),
  }),
  execute: async ({ showCompleted, priority }) => {
    const state = getBackendPortfolioState();
    let tasks = state.tasks;

    if (!showCompleted) {
      tasks = tasks.filter((task) => !task.completed);
    }

    if (priority) {
      tasks = tasks.filter((task) => task.priority === priority);
    }

    if (tasks.length === 0) {
      return {
        message: "No tasks found matching criteria",
        tasks: [],
      };
    }

    const pendingTasks = tasks.filter((t) => !t.completed);
    const completedTasks = tasks.filter((t) => t.completed);

    return {
      message: `Found ${tasks.length} task(s) - ${pendingTasks.length} pending, ${completedTasks.length} completed`,
      tasks: tasks.map((task) => ({
        id: task.id,
        description: task.description,
        priority: task.priority,
        completed: task.completed,
        createdAt: task.createdAt,
        createdDate: new Date(task.createdAt).toLocaleDateString(),
      })),
      summary: {
        total: tasks.length,
        pending: pendingTasks.length,
        completed: completedTasks.length,
        highPriority: tasks.filter((t) => t.priority === "high" && !t.completed)
          .length,
      },
    };
  },
});
