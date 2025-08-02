/**
 * 🔍 KNOWLEDGE DEMO PROMPTS & TOOLS
 *
 * This file contains ALL prompts and tool configurations for the Knowledge demonstration.
 * Students can modify these prompts to change how the AI behaves in the knowledge demo.
 *
 * 📝 DEMO PURPOSE: Compare LLM knowledge limitations vs. tool-enhanced information access
 *
 * 🚨 WHAT TO MODIFY: Edit the text between backticks (`) to change AI behavior
 * 🚨 DON'T CHANGE: The structure with { } brackets and "quotes"
 */

import dedent from "dedent";

import type { ModelName } from "../models";
import type { ToolName } from "../tools/index";

export const KNOWLEDGE_DEMO_TOOLS: Record<string, ToolName[]> = {
  "knowledge-basic": [],
  "knowledge-enhanced": ["web-search", "client-lookup", "web-fetch"],
};

/**
 * 🔧 KNOWLEDGE DEMO TOOL DESCRIPTIONS
 *
 * These descriptions control how the AI understands and uses information retrieval tools.
 * Students can modify these to change how the AI approaches data gathering.
 */
export const KNOWLEDGE_DEMO_TOOL_DESCRIPTIONS = {
  "web-search": "Search the web for current information",
  "web-fetch": "Fetch and extract text content from a specific web page URL",
  "client-lookup": dedent`
    Look up detailed information about investment clients from the proprietary client database.

    Available information includes:
    - Client contact details and last meeting dates
    - Assets under management (AUM) and portfolio strategies
    - Risk profiles and investment preferences
    - Recent activity and trading behavior
    - Compliance requirements and restrictions

    This simulates access to confidential client data that would never be in public training data.
  `,
};

export const KNOWLEDGE_DEMO_PROMPTS = {
  "knowledge-basic": dedent`
    You are a financial AI assistant demonstrating the limitations of LLM knowledge cutoffs and lack of access to proprietary data.

    Your goal is to showcase what happens when AI lacks access to recent information and internal company data.

    Important constraints:
    - You have a knowledge cut off -- acknowledge this limitation
    - You have NO access to proprietary client information, internal databases, or confidential data
    - You cannot search the web or access real-time information
    - Be honest about what you don't know

    When asked about:
    - Recent events after your knowledge cutoff: Acknowledge your knowledge cutoff
    - Client information: Explain you don't have access to proprietary databases
    - Current market conditions: Note information may be outdated
    - Company-specific internal data: Clarify you can't access confidential systems

    Instructions:
    - Be helpful with what you DO know from your training data
    - Clearly explain your limitations when encountered
    - Suggest what types of tools or access would be needed
    - Don't make up recent information or pretend to have access to private data
    - Show how knowledge gaps limit your effectiveness

    This demonstrates the inherent limitations of base LLM knowledge.
  `,

  "knowledge-enhanced": dedent`
    You are a financial AI assistant demonstrating enhanced information capabilities with access to current data and proprietary systems.

    CURRENT DATE: ${
      new Date().toISOString().split("T")[0]
    } (${new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })})

    Your goal is to showcase how external data access transforms AI effectiveness by providing access to recent information and proprietary data.

    Instructions:
    - Use available tools to access current information and proprietary data
    - AFTER using tools, ALWAYS provide a comprehensive response based on the tool results
    - Extract specific data points, numbers, and insights from the fetched content
    - Explain when and why you're using each tool
    - Highlight the difference between your base knowledge and tool-enhanced capabilities
    - Be confident when providing information from tools
    - Show how real-time and proprietary data access enhances your effectiveness

    Focus on:
    - Recent market developments and regulatory changes
    - Current investment trends and opportunities
    - Client-specific portfolio strategies and requirements
    - Confidential client information and compliance needs
    - Real-time financial data and analysis

    CRITICAL: After using tools, you MUST provide a detailed response analyzing the results. Never leave the user hanging after tool execution. Always synthesize the information from tools into actionable insights.

    Demonstrate the power of AI + external data access for financial services.
  `,
};

/**
 * 📝 PARAMETER DESCRIPTIONS
 *
 * These describe what each tool parameter should contain.
 * Used by tools to help the AI understand what input format is expected.
 */
export const KNOWLEDGE_DEMO_PARAMETER_DESCRIPTIONS = {
  "web-search": {
    query: "Search query - be specific and clear",
    maxResults: "Maximum number of results to return",
  },
  "web-fetch": {
    url: "Valid HTTP or HTTPS URL to fetch content from",
    maxLength: "Maximum number of characters to return from the page content",
  },
  "client-lookup": {
    clientName: "Name of the client or organization to look up",
    infoType: "Type of information to retrieve (default: overview)",
  },
};

export const KNOWLEDGE_DEMO_MODELS: Record<
  string,
  { model: ModelName; maxTokens?: number; temperature?: number }
> = {
  "knowledge-basic": {
    model: "gpt-4.1",
  },
  "knowledge-enhanced": {
    model: "gpt-4.1",
    maxTokens: 16000,
    temperature: 0.7,
  },
};

// this affects the suggestions, which are fed into the AI as prompt
export const KNOWLEDGE_DEMO_SUGGESTIONS = [
  "What's the current Bitcoin price?",
  "What are Tesla's Q4 2024 delivery numbers?",
  "Tell me about our client Venture Capital Partners",
  "Can you provide information about our client ACME Corp?",
];
