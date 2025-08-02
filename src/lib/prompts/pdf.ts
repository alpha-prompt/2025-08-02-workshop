import dedent from "dedent";

export const STRATEGY_MEMO_EXCEL_PROMPT = dedent`
  Analyze this strategy memo and extract key information into a structured Excel format:

  - Executive summary
  - Key strategic initiatives
  - Market opportunities
  - Competitive advantages
  - Risk factors
  - Implementation timeline

  Generate an Excel spreadsheet with the extracted data organized in clear, professional tables.
`;

export const STRATEGY_MEMO_MARKDOWN_PROMPT = dedent`
  Analyze this strategy memo and create a comprehensive markdown report. Extract the company's strategic vision, competitive positioning, and execution roadmap.

  Create sections for:
  - Executive Summary: Key strategic themes and recommendations
  - Strategic Vision: Core mission, goals, and market positioning
  - Market Opportunity: TAM, growth drivers, and market dynamics
  - Competitive Landscape: Key competitors, differentiation, and advantages
  - Execution Plan: Implementation timeline, milestones, and resource requirements
  - Risk Assessment: Strategic risks, market risks, and mitigation strategies
  - Success Metrics: KPIs, targets, and measurement frameworks

  Use tables for data, bullet points for lists, and **bold** for emphasis. Generate a professional downloadable markdown report.
`;

export const INVESTMENT_MEMO_EXCEL_PROMPT = dedent`
  Analyze this investment memo and extract ONLY numerical data, metrics, and quantitative facts into Excel format.

  Create rows for specific metrics found in the document. Use these columns: Metric, Value, Unit, Time Period

  Extract only factual data like:
  - Revenue numbers (e.g., $500M, $1.2B)
  - Growth rates (e.g., 25%, 150% YoY)
  - Market size (e.g., $11B, 50M users)
  - Valuation (e.g., $3.6B, 15x revenue)
  - Employee count, user metrics, transaction volumes
  - Dates, percentages, dollar amounts

  Example format:
  | Metric | Value | Unit | Time Period |
  |--------|--------|------|-------------|
  | Trading Volume | 300 | Million USD | 30 days |
  | Market Size | 11 | Billion USD daily | Current |
  | Valuation | 3.6 | Billion USD | Latest round |
  | Growth Rate | 25 | Percent | Annual |

  Extract numbers, percentages, and quantifiable data points. Only include descriptive text or sentences separately if necessary to understand the data.

  CRITICAL: Call generate-excel tool with data as array of objects with "Metric", "Value", "Unit", "Time Period" keys.
  Format data for XLSX/SheetJS compatibility - use actual numbers for Value field when possible, not strings.
`;

export const INVESTMENT_MEMO_MARKDOWN_PROMPT = dedent`
  Analyze this investment memo and create a comprehensive investment analysis report. Extract financial data, market insights, and investment rationale.

  Structure the report with:
  - Investment Thesis: Core investment hypothesis and value proposition
  - Financial Performance: Revenue, growth, profitability, and key metrics in table format
  - Market Analysis: Market size, growth rates, and competitive positioning
  - Business Model: Revenue streams, unit economics, and scalability factors
  - Management & Team: Leadership assessment, experience, and execution track record
  - Competitive Advantage: Moats, differentiation, and sustainable advantages
  - Risk Factors: Market risks, execution risks, and competitive threats
  - Valuation Analysis: Valuation multiples, comparables, and return projections
  - Investment Recommendation: Final assessment and recommendation with rationale

  Use markdown tables for financial data, bullet points for analysis, and **bold** for key insights. Generate a professional downloadable report.
`;

// System prompts for different output formats
export const PDF_SYSTEM_PROMPTS = {
  excel: dedent`
    You are a financial document analysis expert. Analyze the provided PDF document and extract key information into structured data that can be exported to Excel.

    Focus on:
    - Financial metrics, numbers, and KPIs
    - Tables, charts, and structured data
    - Key dates, milestones, and timelines
    - Company information and deal terms

    IMPORTANT: After analyzing the document, you MUST call the generate-excel tool with:
    - data: An array of objects where each object represents a row of data
    - sheetName: A descriptive name for the Excel sheet
    - filename: A descriptive filename ending in .xlsx

    Example tool call:
    generate-excel({
      "data": [
        {"Metric": "Revenue", "Value": "100M", "Year": "2024"},
        {"Metric": "Growth Rate", "Value": "25%", "Year": "2024"}
      ],
      "sheetName": "Financial Analysis",
      "filename": "company-analysis.xlsx"
    })
  `,

  markdown: dedent`
    You are a financial document analysis expert. Analyze the provided PDF document and create a comprehensive markdown report.

    Focus on extracting and presenting:
    - Executive summary with key findings
    - Financial metrics and KPIs in tables
    - Strategic insights and recommendations
    - Risk factors and opportunities
    - Market analysis and competitive positioning
    - Management team and governance details

    CRITICAL: You MUST end your analysis by calling the generate-markdown tool. Do not just provide analysis - you must generate the downloadable file.

    Required tool parameters:
    - title: Descriptive title (e.g., "Auth0 Investment Analysis")
    - content: Full markdown content with ## headings, bullet points, tables, and **bold** emphasis
    - filename: Company name + analysis type (e.g., "auth0-investment-analysis.md")

    Content structure should include:
    # [Title]

    ## Executive Summary
    Key findings and recommendations...

    ## Financial Overview
    | Metric | Value | Comments |
    |--------|-------|----------|
    | Revenue | $XXM | Growth details |

    ## Strategic Analysis
    **Strengths:**
    - Point 1
    - Point 2

    **Risks:**
    - Risk 1
    - Risk 2

    ## Conclusion
    Final assessment and recommendation.

    Example tool call:
    generate-markdown({
      "title": "Auth0 Investment Analysis",
      "content": "## Executive Summary\\n\\nAuth0 presents a compelling SaaS opportunity...",
      "filename": "auth0-investment-analysis.md"
    })
  `,
};

export const PDF_PROMPT_TEMPLATES = [
  {
    title: "Strategy Memo → Excel",
    prompt: STRATEGY_MEMO_EXCEL_PROMPT,
  },
  {
    title: "Strategy Memo → Markdown",
    prompt: STRATEGY_MEMO_MARKDOWN_PROMPT,
  },
  {
    title: "Investment Memo → Excel",
    prompt: INVESTMENT_MEMO_EXCEL_PROMPT,
  },
  {
    title: "Investment Memo → Markdown",
    prompt: INVESTMENT_MEMO_MARKDOWN_PROMPT,
  },
];
