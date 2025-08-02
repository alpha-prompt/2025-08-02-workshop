import { tool } from "ai";
import { z } from "zod";

export const generateExcelDataTool = tool({
  description: "Structure data for Excel export - returns data that frontend will convert to Excel file",
  parameters: z.object({
    data: z.array(z.record(z.any())).describe("Array of objects representing rows of data"),
    sheetName: z.string().default("Analysis").describe("Name for the Excel sheet"),
    filename: z.string().default("pdf-analysis.xlsx").describe("Filename for the Excel file")
  }),
  execute: async ({ data, sheetName = "Analysis", filename = "pdf-analysis.xlsx" }) => {
    return {
      type: "excel_data",
      data,
      sheetName,
      filename,
      message: `Prepared ${data.length} rows for Excel export as "${filename}"`
    };
  }
});

export const generateMarkdownDataTool = tool({
  description: "Generate formatted markdown content - returns content that frontend will convert to downloadable file",
  parameters: z.object({
    title: z.string().describe("Title for the markdown document"),
    content: z.string().describe("Markdown content with proper formatting"),
    filename: z.string().default("pdf-analysis.md").describe("Filename for the markdown file")
  }),
  execute: async ({ title, content, filename = "pdf-analysis.md" }) => {
    const markdownContent = `# ${title}\n\n${content}`;
    
    return {
      type: "markdown_data",
      content: markdownContent,
      filename,
      message: `Generated markdown document "${filename}"`
    };
  }
});