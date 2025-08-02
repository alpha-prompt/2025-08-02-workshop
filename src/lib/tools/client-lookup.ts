import { tool } from "ai";
import { z } from "zod";

import {
  KNOWLEDGE_DEMO_PARAMETER_DESCRIPTIONS,
  KNOWLEDGE_DEMO_TOOL_DESCRIPTIONS,
} from "../prompts/knowledge";

// Mock proprietary client database
const clientDatabase = {
  "ACME Corp": {
    id: "CLI001",
    name: "ACME Corporation",
    industry: "Technology",
    aum: "$2.4B",
    primaryContact: "Sarah Chen",
    email: "sarah.chen@acme.com",
    lastMeeting: "2024-12-15",
    portfolioStrategy: "Growth-focused technology investments",
    riskProfile: "Moderate-Aggressive",
    recentActivity: "Increased allocation to AI/ML sector by 15%",
    complianceNotes: "Requires ESG screening for all investments",
  },
  "Global Industries": {
    id: "CLI002",
    name: "Global Industries Holdings",
    industry: "Manufacturing",
    aum: "$850M",
    primaryContact: "Michael Rodriguez",
    email: "m.rodriguez@globalind.com",
    lastMeeting: "2024-11-28",
    portfolioStrategy: "Diversified value investing with dividend focus",
    riskProfile: "Conservative",
    recentActivity: "Rotating from tech to industrial REITs",
    complianceNotes: "Board approval required for investments >$10M",
  },
  "Venture Capital Partners": {
    id: "CLI003",
    name: "Venture Capital Partners LLC",
    industry: "Financial Services",
    aum: "$1.2B",
    primaryContact: "Amanda Thompson",
    email: "athompson@vcpartners.com",
    lastMeeting: "2024-12-20",
    portfolioStrategy: "Early-stage venture capital and growth equity",
    riskProfile: "High",
    recentActivity: "Launching new fintech-focused fund",
    complianceNotes: "Subject to 506(b) private placement restrictions",
  },
  "Pension Fund Authority": {
    id: "CLI004",
    name: "State Pension Fund Authority",
    industry: "Public Sector",
    aum: "$5.8B",
    primaryContact: "Robert Kim",
    email: "robert.kim@pensionauth.gov",
    lastMeeting: "2024-10-15",
    portfolioStrategy: "Long-term liability matching with inflation protection",
    riskProfile: "Conservative-Moderate",
    recentActivity: "Increasing alternative investment allocation",
    complianceNotes: "Must comply with state investment guidelines",
  },
  "Family Office Solutions": {
    id: "CLI005",
    name: "Family Office Solutions",
    industry: "Wealth Management",
    aum: "$480M",
    primaryContact: "Elizabeth Davis",
    email: "e.davis@familyoffice.com",
    lastMeeting: "2024-12-10",
    portfolioStrategy: "Multi-generational wealth preservation",
    riskProfile: "Moderate",
    recentActivity: "Exploring direct private equity investments",
    complianceNotes: "Family governance committee approval needed",
  },
};

export const clientLookupTool = tool({
  description: KNOWLEDGE_DEMO_TOOL_DESCRIPTIONS["client-lookup"],
  parameters: z.object({
    clientName: z
      .string()
      .describe(
        KNOWLEDGE_DEMO_PARAMETER_DESCRIPTIONS["client-lookup"].clientName,
      ),
    infoType: z
      .enum(["overview", "contact", "strategy", "activity", "compliance"])
      .optional()
      .describe(
        KNOWLEDGE_DEMO_PARAMETER_DESCRIPTIONS["client-lookup"].infoType,
      ),
  }),
  execute: async ({ clientName, infoType = "overview" }) => {
    // Simulate database lookup
    const client = clientDatabase[clientName as keyof typeof clientDatabase];

    if (!client) {
      // Return suggestions for partial matches
      const suggestions = Object.keys(clientDatabase).filter(
        (name) =>
          name.toLowerCase().includes(clientName.toLowerCase()) ||
          clientName.toLowerCase().includes(name.toLowerCase()),
      );

      return {
        found: false,
        message: `Client "${clientName}" not found in database.`,
        suggestions:
          suggestions.length > 0
            ? suggestions
            : Object.keys(clientDatabase).slice(0, 3),
      };
    }

    // Return specific information based on type
    switch (infoType) {
      case "contact":
        return {
          found: true,
          clientName: client.name,
          data: {
            primaryContact: client.primaryContact,
            email: client.email,
            lastMeeting: client.lastMeeting,
          },
        };
      case "strategy":
        return {
          found: true,
          clientName: client.name,
          data: {
            portfolioStrategy: client.portfolioStrategy,
            riskProfile: client.riskProfile,
            aum: client.aum,
          },
        };
      case "activity":
        return {
          found: true,
          clientName: client.name,
          data: {
            recentActivity: client.recentActivity,
            lastMeeting: client.lastMeeting,
          },
        };
      case "compliance":
        return {
          found: true,
          clientName: client.name,
          data: {
            complianceNotes: client.complianceNotes,
            riskProfile: client.riskProfile,
          },
        };
      default:
        return {
          found: true,
          clientName: client.name,
          data: client,
        };
    }
  },
});
