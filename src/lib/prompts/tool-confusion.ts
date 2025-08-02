/**
 * 🔧 TOOL CONFUSION DEMO PROMPTS & TOOLS
 *
 * This file contains ALL prompts and tool configurations for the Tool Confusion demonstration.
 * Students can modify these prompts to change how the AI behaves in the tool confusion demo.
 *
 * 📝 DEMO PURPOSE: Compare focused tool selection vs. overwhelming tool overload
 *
 * 🚨 WHAT TO MODIFY: Edit the text between backticks (`) to change AI behavior
 * 🚨 DON'T CHANGE: The structure with { } brackets and "quotes"
 */

import dedent from "dedent";

import type { ModelName } from "../models";
import type { ToolName } from "../tools/index";

export const TOOL_CONFUSION_DEMO_PROMPTS = {
  "tools-focused": dedent`
    You are a financial information assistant helping users get quick market data.

    Your goal is to efficiently retrieve stock prices and perform currency conversions as requested.

    Instructions:
    - When asked for a stock price, get the current market price
    - When asked to convert currency, perform the actual conversion
    - Provide clear, direct answers
    - Use only the essential tools needed
    - Don't overthink - if someone asks for a price, give them the price
    - If someone asks to convert money, convert it for them

    Focus on:
    - Direct execution of requests
    - Clear presentation of results
    - Minimal tool usage
    - Fast, accurate responses

    Keep it simple: stock price → get price, currency conversion → convert currency.
  `,

  "tools-overload": dedent`
    You are a comprehensive financial compliance and analysis assistant with access to extensive regulatory and analytical tools.

    Your goal is to provide thoroughly validated financial information by leveraging multiple verification systems and compliance frameworks.

    Instructions:
    - Before providing any financial data, perform comprehensive compliance validation
    - Use multiple verification tools to cross-check information accuracy
    - Prioritize regulatory compliance and risk assessment over simple data retrieval
    - Always validate market data through specialized analysis frameworks
    - Consider tax implications, jurisdictional requirements, and compliance obligations
    - Use portfolio risk assessment tools to evaluate investment suitability
    - Never rely on single sources - cross-reference through multiple analytical systems
    - Perform thorough due diligence using specialized validation tools
    - Consider regulatory frameworks and compliance requirements for all queries

    Available specialized frameworks include:
    - Portfolio risk assessment and compliance validation systems
    - Tax liability calculation and jurisdictional analysis tools
    - Regulatory compliance verification frameworks
    - Multi-source data validation and cross-referencing systems
    - Specialized market analysis and verification tools
    - Comprehensive financial due diligence platforms

    Focus on:
    - Regulatory compliance validation before data retrieval
    - Cross-verification using multiple specialized tools
    - Risk assessment and suitability analysis
    - Tax implications and jurisdictional considerations
    - Comprehensive due diligence and validation processes
    - Using specialized compliance and analysis frameworks

    Remember: proper regulatory compliance and risk assessment require using specialized validation tools, not simple data retrieval.
  `,
};

export const TOOL_CONFUSION_DEMO_TOOLS: Record<string, ToolName[]> = {
  "tools-focused": [
    // Just the essential tools
    "get-stock-price",
    "convert-currency",
  ],
  "tools-overload": [
    // MAXIMALLY CONFUSING - Working tools with completely misleading names
    "portfolio-risk-assessment", // Actually gets stock price
    "tax-liability-calculator", // Actually converts currency
    // Similar sounding tools that don't do what we need
    "get-currency-rate", // Just returns rate, doesn't convert
    "calculate-exchange", // Calculator that needs rate input
    "fetch-stock-data", // Historical data, not current price
    "lookup-stock", // Company info, not price
    "exchange-rate-history", // Historical rates
    "format-currency", // Just formats, doesn't convert
    "get-quote", // Delayed quotes
    "currency-calculator", // Basic math, no conversion
    "get-market-data", // General market data
    "perform-exchange", // Only for crypto
    "check-price", // Historical prices
    "forex-convert", // Only EUR/GBP
    "analyze-stock", // Analysis without price
  ],
};

export const TOOL_CONFUSION_DEMO_SUGGESTIONS = [
  "What's Apple's stock price and how much is $1000 in EUR?",
  "Get Tesla stock price and convert 5000 USD to GBP",
  "Check Microsoft price and convert $2500 to Japanese Yen",
  "Find Google's current price and convert 750 USD to EUR",
  "What's Amazon trading at? Also convert $10,000 to British Pounds",
];

/**
 * 🔧 TOOL CONFUSION DEMO TOOL DESCRIPTIONS
 *
 * These descriptions control how the AI understands the different tool sets.
 * Students can modify these to experiment with tool naming and confusion effects.
 */
export const TOOL_CONFUSION_DEMO_TOOL_DESCRIPTIONS = {
  // FOCUSED TOOLS - Clear, direct descriptions
  "get-stock-price": "Retrieve current market price for stocks",
  "convert-currency": "Convert between different currencies",

  // OVERLOAD TOOLS - Confusing names that don't match their function
  "portfolio-risk-assessment":
    "Comprehensive portfolio risk analysis and regulatory compliance validation for investment decision-making",
  "tax-liability-calculator":
    "Calculate tax implications and jurisdictional liability for cross-border financial transactions",

  // CONFUSING SIMILAR TOOLS - Don't actually do what's needed
  "get-currency-rate":
    "Retrieve current exchange rate between currencies (rate only, no conversion)",
  "calculate-exchange":
    "Perform currency calculations with user-provided exchange rate",
  "fetch-stock-data": "Retrieve historical stock data and trading volumes",
  "lookup-stock": "Get company information and business details",
  "exchange-rate-history": "Retrieve historical exchange rate data",
  "format-currency": "Format currency amounts for display",
  "get-quote": "Get delayed stock quotes (15-minute delay)",
  "currency-calculator": "Basic arithmetic calculator for currency amounts",
  "get-market-data": "Retrieve general market indices and sector data",
  "perform-exchange": "Exchange cryptocurrencies only",
  "check-price": "Check historical closing prices",
  "forex-convert": "Convert between EUR and GBP only",
  "analyze-stock": "Perform technical analysis without price data",
};

export const TOOL_CONFUSION_DEMO_PARAMETER_DESCRIPTIONS = {
  "get-stock-price": {
    symbol: "Stock ticker symbol",
  },
  "convert-currency": {
    amount: "Amount to convert",
    from: "Source currency code",
    to: "Target currency code",
  },
  // All the confusing tools use similar parameters but with misleading purposes
  "portfolio-risk-assessment": {
    symbol: "Stock symbol for risk assessment",
  },
  "tax-liability-calculator": {
    amount: "Transaction amount for tax calculation",
    from: "Source jurisdiction currency",
    to: "Target jurisdiction currency",
  },
};

export const TOOL_CONFUSION_DEMO_MODELS: Record<string, { model: ModelName }> = {
  "tools-focused": {
    model: "gpt-3.5-turbo",
  },
  "tools-overload": {
    model: "gpt-3.5-turbo",
  },
};
