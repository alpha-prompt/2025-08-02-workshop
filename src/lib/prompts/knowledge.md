# Knowledge Demo: Making Internal Data Consumable for AI Agents

## Key Takeaway

**The most critical insight from this demo**: Internal company data needs to be made consumable for AI agents to be truly useful. Raw data sitting in databases isn't enough - it must be structured, labeled, and accessible through well-designed tools.

This demo shows how different data organization approaches dramatically affect an AI agent's ability to retrieve the right information.

## Understanding the Knowledge Demo

The knowledge demo contrasts two AI configurations:

- **knowledge-basic**: AI without any external data access (pure language model)
- **knowledge-enhanced**: AI with access to web search and proprietary client database

This comparison demonstrates how external data access transforms AI from "limited by training data" to "capable of real-time information retrieval."

## Level 1: Web Search

Web search is included in this demo but is relatively straightforward - it works as expected and provides access to current information.

## Level 2: Client Lookup Tool

Let's explore how the client lookup tool currently works by examining `src/lib/tools/client-lookup.ts`:

### Current Database Structure

```typescript
const clientDatabase = {
  "ACME Corp": {
    id: "CLI001",
    name: "ACME Corporation",
    industry: "Technology",
    aum: "$2.4B",
    primaryContact: "Sarah Chen",
    lastMeeting: "2024-12-15",
    // ... more fields
  },
  // ... more clients
};
```

**Test these queries to see current behavior:**

- "Tell me about ACME Corp" (works - exact match)
- "Tell me about ACME" (works - partial matching implemented)
- "Tell me about our tech clients" (fails - no industry search)
- "Which clients have we met with recently?" (fails - can't aggregate)

## Level 3: Database Labels and Retrieval Impact

### Exercise 3.1: Poor Database Labels

Modify the client database to use generic, unhelpful labels:

```typescript
const clientDatabase = {
  "Client001": {
    field1: "CLI001",
    field2: "ACME Corporation",
    field3: "Technology",
    field4: "$2.4B",
    field5: "Sarah Chen",
    field6: "2024-12-15",
    // ...
  },
};
```

**Impact**: Even with exact client codes, the AI struggles because field names don't convey meaning.

**Test with**: "What's Client001's industry?" (AI can't understand which field contains industry data)

### Exercise 3.2: Improved Semantic Labels

Now use descriptive field names:

```typescript
const clientDatabase = {
  "ACME Corp": {
    clientId: "CLI001",
    fullLegalName: "ACME Corporation",
    primaryIndustryVertical: "Technology",
    totalAssetsUnderManagement: "$2.4B",
    keyAccountManagerName: "Sarah Chen",
    mostRecentMeetingDate: "2024-12-15",
    // ...
  },
};
```

**Impact**: Descriptive field names help the AI understand what data means and how to use it.

**Test with**: "What industry is ACME Corp in?" (much better results)

## Level 4: Data Structure and Query Limitations

### Exercise 4.1: Why Bulk Queries Fail

Try asking: **"How many clients have I met with in the past year?"**

**Current limitation**: The tool is designed for individual client lookup, not bulk data analysis. The AI can only:

1. Look up one client at a time
2. Access predefined data fields
3. Return individual client records

**Why this happens**: The tool's `execute` function expects a `clientName` parameter and returns a single client record. There's no mechanism for:

- Filtering across all clients
- Counting or aggregating data
- Date range queries across the entire dataset

### Tool Design Determines Capabilities

The current tool signature limits what's possible:

```typescript
parameters: z.object({
  clientName: z.string().describe("Name of the client or organization to look up"),
  infoType: z.enum(["overview", "contact", "strategy", "activity", "compliance"]).optional(),
}),
```

**Limitations this creates:**

- Can't search by industry: "Show me all tech clients"
- Can't filter by date: "Clients met in December 2024"
- Can't aggregate: "Total AUM across all clients"
- Can't compare: "Which client has the highest AUM?"

### Exercise 4.2: Enhanced Tool Design

To enable bulk queries, you'd need additional tools or parameters:

```typescript
// Hypothetical enhanced tool
parameters: z.object({
  queryType: z.enum(["single-client", "filter", "aggregate", "search"]),
  clientName: z.string().optional(),
  filters: z.object({
    industry: z.string().optional(),
    aumRange: z.string().optional(),
    meetingDateAfter: z.string().optional(),
    riskProfile: z.string().optional(),
  }).optional(),
  aggregationType: z.enum(["count", "sum", "average", "list"]).optional(),
})
```

**This would enable:**

- "How many technology clients do we have?" (filter + count)
- "What's our total AUM?" (aggregate + sum)
- "Which clients met in December?" (filter + list)

## Key Learning Points

### 1. Tool Design Determines AI Capabilities

- Single-record lookup ≠ bulk data analysis
- Parameter design directly limits what questions can be answered
- AI can only work with what the tools expose

### 2. Data Organization Matters Enormously

- Field names should be descriptive and semantic
- Consistent formats enable reliable parsing
- Structure determines queryability

### 3. Retrieval Method Shapes User Experience

- Exact matching is brittle but predictable
- Fuzzy matching is flexible but can be unpredictable
- Search strategy should match user mental models

### 4. Making Data "AI-Consumable"

It's not enough to have data - it must be:

- **Accessible**: Through well-designed tool interfaces
- **Structured**: With meaningful field names and consistent formats
- **Queryable**: Supporting the types of questions users will ask
- **Documented**: So AI understands what each field means

## Next Steps: Building Better Data Tools

Consider these improvements for real-world implementations:

1. **Multi-modal search**: Support both exact lookup and filtered search
2. **Semantic field names**: Use descriptive, business-meaningful names
3. **Consistent formatting**: Standardize dates, numbers, enums
4. **Relationship mapping**: Connect related data entities
5. **Aggregation capabilities**: Enable counting, summing, averaging
6. **Business logic**: Implement domain-specific search rules

The goal: Make your internal data as easy for AI to work with as public web data.
