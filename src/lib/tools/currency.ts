import { tool } from "ai";
import { z } from "zod";

import {
  TOOL_CONFUSION_DEMO_TOOL_DESCRIPTIONS,
  TOOL_CONFUSION_DEMO_PARAMETER_DESCRIPTIONS,
} from "../prompts/tool-confusion";

// MOCK DATA - In a real app, these would be API calls
const MOCK_STOCK_PRICES: Record<string, number> = {
  AAPL: 175.5,
  GOOGL: 142.8,
  MSFT: 378.9,
  TSLA: 248.4,
  AMZN: 168.2,
};

const MOCK_EXCHANGE_RATES: Record<string, number> = {
  "USD-EUR": 0.92,
  "USD-GBP": 0.79,
  "USD-JPY": 149.5,
  "EUR-USD": 1.09,
  "GBP-USD": 1.27,
};

// ACTUAL WORKING TOOLS (but with confusing names/descriptions)

// Actually gets current stock price
export const getStockPrice = tool({
  description: TOOL_CONFUSION_DEMO_TOOL_DESCRIPTIONS["get-stock-price"],
  parameters: z.object({
    symbol: z.string().describe(TOOL_CONFUSION_DEMO_PARAMETER_DESCRIPTIONS["get-stock-price"].symbol),
  }),
  execute: async ({ symbol }) => {
    const price = MOCK_STOCK_PRICES[symbol.toUpperCase()];
    if (!price) {
      return { success: false, error: `Stock ${symbol} not found` };
    }
    return {
      success: true,
      symbol: symbol.toUpperCase(),
      price,
      currency: "USD",
      timestamp: new Date().toISOString(),
    };
  },
});

// Actually converts currency
export const convertCurrency = tool({
  description: TOOL_CONFUSION_DEMO_TOOL_DESCRIPTIONS["convert-currency"],
  parameters: z.object({
    amount: z.number().describe(TOOL_CONFUSION_DEMO_PARAMETER_DESCRIPTIONS["convert-currency"].amount),
    from: z.string().describe(TOOL_CONFUSION_DEMO_PARAMETER_DESCRIPTIONS["convert-currency"].from),
    to: z.string().describe(TOOL_CONFUSION_DEMO_PARAMETER_DESCRIPTIONS["convert-currency"].to),
  }),
  execute: async ({ amount, from, to }) => {
    const rateKey = `${from.toUpperCase()}-${to.toUpperCase()}`;
    const rate = MOCK_EXCHANGE_RATES[rateKey];
    if (!rate) {
      return {
        success: false,
        error: `Exchange rate for ${rateKey} not available`,
      };
    }
    const converted = amount * rate;
    return {
      success: true,
      original: { amount, currency: from.toUpperCase() },
      converted: {
        amount: Math.round(converted * 100) / 100,
        currency: to.toUpperCase(),
      },
      rate,
      timestamp: new Date().toISOString(),
    };
  },
});

// CONFUSING TOOLS - Similar names, different functions

// Just returns exchange rate, doesn't convert
export const getCurrencyRate = tool({
  description: TOOL_CONFUSION_DEMO_TOOL_DESCRIPTIONS["get-currency-rate"],
  parameters: z.object({
    from: z.string().describe("Base currency"),
    to: z.string().describe("Quote currency"),
  }),
  execute: async ({ from, to }) => {
    const rateKey = `${from.toUpperCase()}-${to.toUpperCase()}`;
    const rate = MOCK_EXCHANGE_RATES[rateKey];
    if (!rate) {
      return { success: false, error: `Rate for ${rateKey} not found` };
    }
    return {
      success: true,
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      rate,
      description: `1 ${from.toUpperCase()} = ${rate} ${to.toUpperCase()}`,
    };
  },
});

// Calculator that needs rate as input
export const calculateExchange = tool({
  description: TOOL_CONFUSION_DEMO_TOOL_DESCRIPTIONS["calculate-exchange"],
  parameters: z.object({
    amount: z.number().describe("Amount to calculate"),
    rate: z.number().describe("Exchange rate to apply"),
  }),
  execute: async ({ amount, rate }) => {
    return {
      success: true,
      calculation: amount * rate,
      formula: `${amount} × ${rate} = ${amount * rate}`,
      note: "This is just a calculator, you need to provide the rate",
    };
  },
});

// Gets historical stock data, not current price
export const fetchStockData = tool({
  description: TOOL_CONFUSION_DEMO_TOOL_DESCRIPTIONS["fetch-stock-data"],
  parameters: z.object({
    ticker: z.string().describe("Stock ticker"),
    dataType: z.enum(["price", "volume", "history"]).default("price"),
  }),
  execute: async ({ ticker, dataType }) => {
    return {
      success: true,
      ticker: ticker.toUpperCase(),
      dataType,
      data: {
        open: 172.3,
        high: 176.2,
        low: 171.5,
        volume: 48293847,
        "52WeekHigh": 199.62,
        "52WeekLow": 164.08,
      },
      note: "Historical market data - for current price use a different tool",
    };
  },
});

// Returns company info, not price
export const lookupStock = tool({
  description: TOOL_CONFUSION_DEMO_TOOL_DESCRIPTIONS["lookup-stock"],
  parameters: z.object({
    query: z.string().describe("Stock symbol or company name"),
  }),
  execute: async ({ query }) => {
    return {
      success: true,
      results: [
        {
          symbol: query.toUpperCase(),
          name: "Apple Inc.",
          exchange: "NASDAQ",
          sector: "Technology",
          marketCap: "2.89T",
          description: "Consumer electronics and software company",
        },
      ],
      note: "Company information - does not include current price",
    };
  },
});

// Exchange rate history, not current conversion
export const exchangeRateHistory = tool({
  description: TOOL_CONFUSION_DEMO_TOOL_DESCRIPTIONS["exchange-rate-history"],
  parameters: z.object({
    baseCurrency: z.string().describe("Base currency code"),
    quoteCurrency: z.string().describe("Quote currency code"),
    period: z.enum(["1D", "1W", "1M", "1Y"]).default("1D"),
  }),
  execute: async ({ baseCurrency, quoteCurrency, period }) => {
    return {
      success: true,
      pair: `${baseCurrency}/${quoteCurrency}`,
      period,
      history: [
        { date: "2024-01-20", rate: 0.921 },
        { date: "2024-01-21", rate: 0.919 },
        { date: "2024-01-22", rate: 0.92 },
      ],
      average: 0.92,
      trend: "stable",
    };
  },
});

// Formats currency, doesn't convert
export const formatCurrency = tool({
  description: TOOL_CONFUSION_DEMO_TOOL_DESCRIPTIONS["format-currency"],
  parameters: z.object({
    value: z.number().describe("Numeric value"),
    currency: z.string().describe("Currency code"),
  }),
  execute: async ({ value, currency }) => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(value);
    return {
      success: true,
      original: value,
      formatted,
      locale: "en-US",
      note: "This only formats numbers, doesn't convert between currencies",
    };
  },
});

// Stock quote with delay
export const getQuote = tool({
  description: TOOL_CONFUSION_DEMO_TOOL_DESCRIPTIONS["get-quote"],
  parameters: z.object({
    symbol: z.string().describe("Symbol to quote"),
    quoteType: z.enum(["stock", "forex", "crypto"]).default("stock"),
  }),
  execute: async ({ symbol, quoteType }) => {
    if (quoteType !== "stock") {
      return { success: false, error: `Quote type ${quoteType} not supported` };
    }
    return {
      success: true,
      symbol,
      quote: {
        bid: 175.48,
        ask: 175.52,
        last: 175.5,
        change: +1.23,
        percentChange: "+0.71%",
      },
      delay: "15 minutes",
      note: "Delayed quotes - may not reflect current price",
    };
  },
});

// Currency calculator without conversion
export const currencyCalculator = tool({
  description: TOOL_CONFUSION_DEMO_TOOL_DESCRIPTIONS["currency-calculator"],
  parameters: z.object({
    operation: z.enum(["add", "subtract", "multiply", "divide"]),
    value1: z.number().describe("First value"),
    value2: z.number().describe("Second value"),
  }),
  execute: async ({ operation, value1, value2 }) => {
    const operations = {
      add: value1 + value2,
      subtract: value1 - value2,
      multiply: value1 * value2,
      divide: value1 / value2,
    };
    return {
      success: true,
      result: operations[operation],
      operation,
      calculation: `${value1} ${operation} ${value2} = ${operations[operation]}`,
      note: "Basic calculator - doesn't handle currency conversion",
    };
  },
});

// Market data aggregator
export const getMarketData = tool({
  description: TOOL_CONFUSION_DEMO_TOOL_DESCRIPTIONS["get-market-data"],
  parameters: z.object({
    market: z.string().describe("Market identifier"),
    dataPoint: z.string().describe("Specific data to retrieve"),
  }),
  execute: async ({ market, dataPoint }) => {
    return {
      success: true,
      market,
      dataPoint,
      value: "Market closed",
      lastUpdate: "4:00 PM EST",
      note: "General market data - use specific tools for stock prices",
    };
  },
});

// Exchange service for crypto
export const performExchange = tool({
  description: TOOL_CONFUSION_DEMO_TOOL_DESCRIPTIONS["perform-exchange"],
  parameters: z.object({
    amount: z.number().describe("Amount to exchange"),
    pair: z.string().describe("Trading pair (e.g., BTC/USD)"),
  }),
  execute: async ({ amount, pair }) => {
    console.log("performExchange", amount, pair);
    return {
      success: false,
      error: "This tool is for cryptocurrency exchanges only",
      suggestion: "Use convertCurrency for fiat currency conversion",
    };
  },
});

// Price checker that checks historical prices
export const checkPrice = tool({
  description: TOOL_CONFUSION_DEMO_TOOL_DESCRIPTIONS["check-price"],
  parameters: z.object({
    item: z.string().describe("Item to check price for"),
    date: z.string().optional().describe("Date for historical price"),
  }),
  execute: async ({ item, date }) => {
    return {
      success: true,
      item,
      priceHistory: {
        "2024-01-01": 168.5,
        "2024-01-15": 172.3,
        current: "Use getStockPrice for current price",
      },
      date: date || "historical",
    };
  },
});

// Forex tool that only works with major pairs
export const forexConvert = tool({
  description: TOOL_CONFUSION_DEMO_TOOL_DESCRIPTIONS["forex-convert"],
  parameters: z.object({
    sum: z.number().describe("Sum to convert"),
    sourceCurrency: z.string().describe("Source currency"),
    targetCurrency: z.string().describe("Target currency"),
  }),
  execute: async ({ sum, sourceCurrency, targetCurrency }) => {
    // Only works for specific pairs
    if (sourceCurrency === "EUR" && targetCurrency === "GBP") {
      return {
        success: true,
        converted: sum * 0.86,
        note: "This tool only supports EUR/GBP conversion",
      };
    }
    return {
      success: false,
      error: "This tool only supports EUR to GBP conversion",
      suggestion: "Use convertCurrency for other pairs",
    };
  },
});

// Stock analyzer that doesn't return price
export const analyzeStock = tool({
  description: TOOL_CONFUSION_DEMO_TOOL_DESCRIPTIONS["analyze-stock"],
  parameters: z.object({
    ticker: z.string().describe("Stock ticker to analyze"),
  }),
  execute: async ({ ticker }) => {
    return {
      success: true,
      ticker,
      analysis: {
        recommendation: "Buy",
        targetPrice: 195.0,
        rsi: 45.2,
        movingAverage: 172.3,
        sentiment: "Bullish",
      },
      note: "Analysis data only - current price not included",
    };
  },
});

// MAXIMALLY CONFUSING TOOLS - Same implementation, completely misleading everything

// Actually gets stock price but sounds like portfolio risk analysis
export const getStockPricePoor = tool({
  description: TOOL_CONFUSION_DEMO_TOOL_DESCRIPTIONS["portfolio-risk-assessment"],
  parameters: z.object({
    complianceEntity: z
      .string()
      .describe(TOOL_CONFUSION_DEMO_PARAMETER_DESCRIPTIONS["portfolio-risk-assessment"].symbol),
  }),
  execute: async ({ complianceEntity }) => {
    // Actually gets stock price (same as getStockPrice)
    const price = MOCK_STOCK_PRICES[complianceEntity.toUpperCase()];
    if (!price) {
      return { success: false, error: `Stock ${complianceEntity} not found` };
    }
    return {
      success: true,
      symbol: complianceEntity.toUpperCase(),
      price,
      currency: "USD",
      timestamp: new Date().toISOString(),
    };
  },
});

// Actually converts currency but sounds like tax calculation
export const convertCurrencyPoor = tool({
  description: TOOL_CONFUSION_DEMO_TOOL_DESCRIPTIONS["tax-liability-calculator"],
  parameters: z.object({
    taxableAmount: z.number().describe(TOOL_CONFUSION_DEMO_PARAMETER_DESCRIPTIONS["tax-liability-calculator"].amount),
    sourceJurisdiction: z.string().describe(TOOL_CONFUSION_DEMO_PARAMETER_DESCRIPTIONS["tax-liability-calculator"].from),
    targetJurisdiction: z.string().describe(TOOL_CONFUSION_DEMO_PARAMETER_DESCRIPTIONS["tax-liability-calculator"].to),
  }),
  execute: async ({
    taxableAmount,
    sourceJurisdiction,
    targetJurisdiction,
  }) => {
    // Actually converts currency (same as convertCurrency)
    const rateKey = `${sourceJurisdiction.toUpperCase()}-${targetJurisdiction.toUpperCase()}`;
    const rate = MOCK_EXCHANGE_RATES[rateKey];
    if (!rate) {
      return {
        success: false,
        error: `Exchange rate for ${rateKey} not available`,
      };
    }
    const converted = taxableAmount * rate;
    return {
      success: true,
      original: {
        amount: taxableAmount,
        currency: sourceJurisdiction.toUpperCase(),
      },
      converted: {
        amount: Math.round(converted * 100) / 100,
        currency: targetJurisdiction.toUpperCase(),
      },
      rate,
      timestamp: new Date().toISOString(),
    };
  },
});
