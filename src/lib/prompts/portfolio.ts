/**
 * 💼 PORTFOLIO DEMO PROMPTS & TOOLS
 *
 * This file contains ALL prompts and tool configurations for the Portfolio demonstration.
 * Students can modify these prompts to change how the AI behaves in the portfolio demo.
 *
 * 📝 DEMO PURPOSE: Compare read-only vs. read-write AI capabilities for portfolio management
 *
 * 🚨 WHAT TO MODIFY: Edit the text between backticks (`) to change AI behavior
 * 🚨 DON'T CHANGE: The structure with { } brackets and "quotes"
 */

import dedent from "dedent";

import type { ModelName } from "../models";
import type { ToolName } from "../tools/index";

export const PORTFOLIO_DEMO_TOOLS: Record<string, ToolName[]> = {
  "portfolio-read": ["view-portfolio", "get-client-notes", "list-tasks"],
  "portfolio-write": [
    "view-portfolio",
    "get-client-notes",
    "list-tasks",
    "add-portfolio-update",
    "add-client-note",
    "create-task",
    "complete-task",
  ],
};

/**
 * 🔧 PORTFOLIO DEMO TOOL DESCRIPTIONS
 *
 * These descriptions control how the AI understands and uses portfolio management tools.
 * Students can modify these to change how the AI approaches portfolio operations.
 */
export const PORTFOLIO_DEMO_TOOL_DESCRIPTIONS = {
  "view-portfolio": "View current portfolio companies and their performance",
  "get-client-notes":
    "Retrieve portfolio company meeting notes and interaction history",
  "list-tasks":
    "List all tasks and action items for portfolio company management",
  "add-portfolio-update":
    "Add financial updates or information about a portfolio company",
  "add-client-note":
    "Add a new note about a portfolio company meeting or interaction",
  "update-client-note":
    "Update an existing client note with additional information",
  "create-task":
    "Create a new task or action item for portfolio company management",
  "complete-task": "Mark a task as completed",
};

export const PORTFOLIO_DEMO_PROMPTS = {
  "portfolio-read": dedent`
    You are a VC/PE AI assistant demonstrating read-only data access capabilities.

    Your goal is to showcase how AI can analyze and understand existing portfolio company data but cannot make modifications.

    Important constraints:
    - You can ONLY read and analyze data - no modifications allowed
    - You cannot add portfolio updates, create notes, or update any information
    - Focus on providing insights and analysis based on existing portfolio company data
    - Suggest actions but explain you cannot perform them

    Instructions:
    - Use read tools to gather information about portfolio companies and client interactions
    - Provide detailed insights about portfolio company performance and growth trends
    - Suggest follow-up actions or introductions but clarify you cannot implement them
    - Demonstrate thorough portfolio analysis capabilities
    - Show how read-only access limits your effectiveness for managing portfolio relationships

    This demonstrates the limitations of read-only AI systems in VC/PE portfolio management.
  `,

  "portfolio-write": dedent`
    You are a VC/PE AI assistant with full read-write access to portfolio management systems.

    Your goal is to showcase how write operations transform AI from passive analyzer to active portfolio company relationship manager.

    Instructions:
    - Use write tools to actively manage portfolio companies and client relationships
    - Add portfolio company updates when you receive financial information
    - Create detailed client notes after portfolio company interactions
    - Manage task lists and follow-up items like introductions or reviews
    - Explain what you're doing and why before making changes
    - Show the real-time impact of your modifications
    - Demonstrate proactive portfolio company management capabilities

    Focus on:
    - Adding portfolio company financial updates and valuations
    - Creating comprehensive portfolio company interaction records
    - Managing workflows like introductions, due diligence, and follow-ups
    - Maintaining data integrity and audit trails for portfolio companies
    - Showing immediate feedback from write operations

    When users mention portfolio company updates:
    1. Update the portfolio company's financial information
    2. Create a detailed client note about the interaction
    3. Create a task for the requested introduction or follow-up

    Demonstrate the power of AI with write access for active VC/PE portfolio management.
  `,
};

/**
 * 📝 PARAMETER DESCRIPTIONS
 *
 * These describe what each tool parameter should contain.
 * Used by tools to help the AI understand what input format is expected.
 */
export const PORTFOLIO_DEMO_PARAMETER_DESCRIPTIONS = {
  "view-portfolio": {
    companyName: "Optional: Filter by specific portfolio company name",
  },
  "get-client-notes": {
    clientName: "Optional: Filter notes for specific portfolio company",
  },
  "list-tasks": {
    showCompleted: "Include completed tasks in results",
    priority: "Filter by task priority",
  },
  "add-portfolio-update": {
    companyName: "Name of the portfolio company",
    revenue: "Optional: Updated revenue figure",
    valuation: "Optional: Updated valuation",
    sector: "Optional: Company sector",
  },
  "add-client-note": {
    clientName: "Name of the portfolio company",
    content: "Content of the note or meeting summary",
  },
  "update-client-note": {
    noteId: "ID of the note to update",
    content: "New content for the note",
  },
  "create-task": {
    description: "Description of the task to be completed",
    priority: "Priority level of the task",
  },
  "complete-task": {
    taskId: "ID of the task to mark as completed",
  },
};

export const PORTFOLIO_DEMO_MODELS: Record<string, { model: ModelName }> = {
  "portfolio-read": {
    model: "gpt-4.1",
  },
  "portfolio-write": {
    model: "gpt-4.1",
  },
};

// this affects the suggestions, which are fed into the AI as prompt
export const PORTFOLIO_DEMO_SUGGESTIONS = [
  "Show me the current portfolio companies",
  "Talked to portco ACME Corp, our latest fintech investment at $20M valuation. Their revenue doubled to $2M and they want an introduction to an SEO expert",
  "Create a task to review our Series A companies",
  "Add note: Company is exploring acquisition opportunities",
  "List all pending tasks",
];
