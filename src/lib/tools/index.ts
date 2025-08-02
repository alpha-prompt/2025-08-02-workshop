import { addTool, calculatorTool, divideTool, multiplyTool, subtractTool } from "./calculator";
import { clientLookupTool } from "./client-lookup";
import {
  analyzeStock,
  calculateExchange,
  checkPrice,
  convertCurrency,
  convertCurrencyPoor,
  currencyCalculator,
  exchangeRateHistory,
  fetchStockData,
  forexConvert,
  formatCurrency,
  getCurrencyRate,
  getMarketData,
  getQuote,
  getStockPrice,
  getStockPricePoor,
  lookupStock,
  performExchange,
} from "./currency";
import {
  generateExcelDataTool,
  generateMarkdownDataTool,
} from "./pdf-analysis";
import {
  getClientNotesTool,
  listTasksTool,
  viewPortfolioTool,
} from "./portfolio-read";
import {
  addClientNoteTool,
  addPortfolioUpdateTool,
  completeTaskTool,
  createTaskTool,
} from "./portfolio-write";
import {
  readSecretsTool,
  sendEmailTool,
  webSearchCompromisedTool,
  webSearchSafeTool,
} from "./security";
import { webFetchTool, webSearchTool } from "./web-tools";

export const TOOL_REGISTRY = {
  // Math operation tools
  add: addTool,
  subtract: subtractTool,
  multiply: multiplyTool,
  divide: divideTool,
  calculator: calculatorTool,
  "web-search": webSearchTool,
  "web-fetch": webFetchTool,
  "client-lookup": clientLookupTool,
  "view-portfolio": viewPortfolioTool,
  "get-client-notes": getClientNotesTool,
  "list-tasks": listTasksTool,
  "add-portfolio-update": addPortfolioUpdateTool,
  "add-client-note": addClientNoteTool,
  "create-task": createTaskTool,
  "complete-task": completeTaskTool,
  // Currency tools
  "get-stock-price": getStockPrice,
  "convert-currency": convertCurrency,
  "get-currency-rate": getCurrencyRate,
  "calculate-exchange": calculateExchange,
  "fetch-stock-data": fetchStockData,
  "lookup-stock": lookupStock,
  "exchange-rate-history": exchangeRateHistory,
  "format-currency": formatCurrency,
  "get-quote": getQuote,
  "currency-calculator": currencyCalculator,
  "get-market-data": getMarketData,
  "perform-exchange": performExchange,
  "check-price": checkPrice,
  "forex-convert": forexConvert,
  "analyze-stock": analyzeStock,
  // Maximally confusing tools
  "portfolio-risk-assessment": getStockPricePoor,
  "tax-liability-calculator": convertCurrencyPoor,
  // PDF analysis tools
  "generate-excel": generateExcelDataTool,
  "generate-markdown": generateMarkdownDataTool,
  // Security tools
  "web-search-safe": webSearchSafeTool,
  "web-search-compromised": webSearchCompromisedTool,
  "send-email": sendEmailTool,
  "read-secrets": readSecretsTool,
} as const;

export type ToolName = keyof typeof TOOL_REGISTRY;

export function getWorkshopTools(toolNames: ToolName[]) {
  const tools: Record<string, any> = {};

  for (const toolName of toolNames) {
    const tool = TOOL_REGISTRY[toolName];
    if (tool) {
      tools[toolName] = tool;
    } else {
      console.warn(
        `Tool '${toolName}' not found in registry or not implemented yet`,
      );
    }
  }

  return tools;
}
