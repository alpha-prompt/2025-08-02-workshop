import { tool } from "ai";
import * as cheerio from "cheerio";
import { z } from "zod";

import {
  KNOWLEDGE_DEMO_PARAMETER_DESCRIPTIONS,
  KNOWLEDGE_DEMO_TOOL_DESCRIPTIONS,
} from "../prompts/knowledge";

// Helper function to extract text from HTML using cheerio
function extractTextFromHtml(html: string): string {
  const $ = cheerio.load(html);

  // Remove unwanted elements
  $(
    "script, style, nav, footer, aside, .advertisement, .ads, .sidebar",
  ).remove();

  // Focus on main content
  const contentSelectors = [
    "main",
    "article",
    ".content",
    ".main-content",
    "h1, h2, h3, h4, h5, h6",
    "p",
  ];

  let extractedText = "";

  for (const selector of contentSelectors) {
    const elements = $(selector);
    elements.each((_: any, element: any) => {
      const text = $(element).text().trim();
      if (text.length > 20) {
        extractedText += text + "\n";
      }
    });
  }

  // Fallback to body if no content found
  if (extractedText.length < 100) {
    extractedText = $("body").text();
  }

  return extractedText
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

// Helper function to extract title
function extractTitleFromHtml(html: string): string {
  const $ = cheerio.load(html);
  return (
    $("title").first().text().trim() ||
    $("h1").first().text().trim() ||
    "No title found"
  );
}

export const webSearchTool = tool({
  description: KNOWLEDGE_DEMO_TOOL_DESCRIPTIONS["web-search"],
  parameters: z.object({
    query: z
      .string()
      .describe(KNOWLEDGE_DEMO_PARAMETER_DESCRIPTIONS["web-search"].query),
    maxResults: z
      .number()
      .optional()
      .default(5)
      .describe(KNOWLEDGE_DEMO_PARAMETER_DESCRIPTIONS["web-search"].maxResults),
  }),
  execute: async ({ query, maxResults }) => {
    try {
      // Check if BRAVE_API_KEY is available
      const apiKey = process.env.BRAVE_API_KEY;
      if (!apiKey) {
        throw new Error("BRAVE_API_KEY environment variable is not set");
      }

      // Use Brave Search API
      const braveSearchUrl = `https://api.search.brave.com/res/v1/web/search`;

      // Build query parameters
      const params = new URLSearchParams({
        q: query,
        count: maxResults.toString(),
        country: "us",
        search_lang: "en",
      });

      const response = await fetch(`${braveSearchUrl}?${params.toString()}`, {
        headers: {
          "X-Subscription-Token": apiKey,
          Accept: "application/json",
        },
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(
          `Brave Search API responded with status ${response.status}`,
        );
      }

      const data = await response.json();
      let results: any[] = [];

      // Parse Brave Search results
      if (data.web && data.web.results) {
        results = data.web.results.slice(0, maxResults).map((result: any) => ({
          title: result.title || "No title",
          url: result.url || "",
          snippet:
            result.description || result.snippet || "No description available",
          date: result.age || new Date().toISOString().split("T")[0],
          source: result.profile?.name || new URL(result.url).hostname,
        }));
      }

      // If no results from Brave Search, provide a helpful message
      if (results.length === 0) {
        results = [
          {
            title: `No results found for "${query}"`,
            url: "https://brave.com/search/",
            snippet: `No search results were found for "${query}". Try refining your search terms or checking for spelling errors.`,
            date: new Date().toISOString().split("T")[0],
            source: "Brave Search",
          },
        ];
      }

      const finalResult = {
        query,
        results,
        message: `Found ${results.length} web search results for "${query}" using Brave Search API. This provides access to current information from Brave's independent web index.`,
        searchDate: new Date().toISOString().split("T")[0],
      };
      return finalResult;
    } catch (error) {
      console.error("Brave Search API error:", error);

      const errorResult = {
        query,
        results: [
          {
            title: "Web Search Error",
            url: "https://brave.com/search/",
            snippet: `Web search failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }. Please check your BRAVE_API_KEY environment variable and try again.`,
            date: new Date().toISOString().split("T")[0],
            source: "Error",
          },
        ],
        message: `Web search failed for "${query}". Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        searchDate: new Date().toISOString().split("T")[0],
      };
      return errorResult;
    }
  },
});

export const webFetchTool = tool({
  description: KNOWLEDGE_DEMO_TOOL_DESCRIPTIONS["web-fetch"],
  parameters: z.object({
    url: z
      .string()
      .url()
      .describe(KNOWLEDGE_DEMO_PARAMETER_DESCRIPTIONS["web-fetch"].url),
    maxLength: z
      .number()
      .optional()
      .default(5000)
      .describe(KNOWLEDGE_DEMO_PARAMETER_DESCRIPTIONS["web-fetch"].maxLength),
  }),
  execute: async ({ url, maxLength }) => {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const textContent = extractTextFromHtml(html);

      const truncatedContent =
        textContent.length > maxLength
          ? textContent.substring(0, maxLength) + "..."
          : textContent;

      return {
        url,
        title: extractTitleFromHtml(html),
        content: truncatedContent,
        contentLength: textContent.length,
        truncated: textContent.length > maxLength,
        fetchDate: new Date().toISOString(),
        message: `Successfully fetched content from ${
          new URL(url).hostname
        }. Content length: ${textContent.length} characters${
          textContent.length > maxLength ? ` (truncated to ${maxLength})` : ""
        }.`,
      };
    } catch (error) {
      return {
        url,
        title: "Error",
        content: `Failed to fetch content from ${url}. Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        contentLength: 0,
        truncated: false,
        fetchDate: new Date().toISOString(),
        message: `Failed to fetch content from ${url}. Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  },
});