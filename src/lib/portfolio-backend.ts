// Backend state management for portfolio demo
// This runs on the server and is shared across requests
import type {
  ClientNote,
  PortfolioCompany,
  PortfolioState,
  Task,
} from "./portfolio-state";

// Global backend state - persists for the server session
let backendPortfolioState: PortfolioState = {
  companies: [
    {
      name: "TechFlow AI",
      sector: "AI/ML",
      currentValuation: 18500000,
      revenue: 2500000,
    },
    {
      name: "GreenEnergy Solutions",
      sector: "Clean Tech",
      currentValuation: 35000000,
      revenue: 8000000,
    },
  ],
  clientNotes: [
    {
      id: "1",
      clientName: "TechFlow AI",
      content: "Quarterly check-in completed.",
      createdAt: "2024-12-01T10:00:00Z",
      updatedAt: "2024-12-01T10:00:00Z",
    },
  ],
  tasks: [
    {
      id: "1",
      description:
        "Introduce TechFlow AI to Series B investors for European expansion",
      priority: "high",
      createdAt: "2024-12-01T09:00:00Z",
      completed: false,
    },
  ],
};

// Get current backend state
export function getBackendPortfolioState(): PortfolioState {
  return {
    companies: [...backendPortfolioState.companies],
    clientNotes: [...backendPortfolioState.clientNotes],
    tasks: [...backendPortfolioState.tasks],
  };
}

// Reset backend state to initial values
export function resetBackendPortfolioState(): void {
  backendPortfolioState = {
    companies: [
      {
        name: "TechFlow AI",
        sector: "AI/ML",
        currentValuation: 18500000,
        revenue: 2500000,
      },
      {
        name: "GreenEnergy Solutions",
        sector: "Clean Tech",
        currentValuation: 35000000,
        revenue: 8000000,
      },
    ],
    clientNotes: [
      {
        id: "1",
        clientName: "TechFlow AI",
        content: "Quarterly check-in completed.",
        createdAt: "2024-12-01T10:00:00Z",
        updatedAt: "2024-12-01T10:00:00Z",
      },
    ],
    tasks: [
      {
        id: "1",
        description:
          "Introduce TechFlow AI to Series B investors for European expansion",
        priority: "high",
        createdAt: "2024-12-01T09:00:00Z",
        completed: false,
      },
    ],
  };
}

// Backend portfolio operations
export function addBackendPortfolioUpdate(update: {
  companyName: string;
  revenue?: number;
  valuation?: number;
  sector?: string;
}): PortfolioCompany {
  const existingIndex = backendPortfolioState.companies.findIndex(
    (company) =>
      company.name.toLowerCase() === update.companyName.toLowerCase(),
  );

  if (existingIndex >= 0) {
    // Update existing company
    const existing = backendPortfolioState.companies[existingIndex];
    backendPortfolioState.companies[existingIndex] = {
      ...existing,
      ...(update.revenue !== undefined && { revenue: update.revenue }),
      ...(update.valuation !== undefined && {
        currentValuation: update.valuation,
      }),
      ...(update.sector && { sector: update.sector }),
    };
    return backendPortfolioState.companies[existingIndex];
  } else {
    // Create new company
    const newCompany: PortfolioCompany = {
      name: update.companyName,
      sector: update.sector || "Technology",
      currentValuation: update.valuation || 1000000,
      revenue: update.revenue || 0,
    };
    backendPortfolioState.companies.push(newCompany);
    return newCompany;
  }
}

export function addBackendClientNote(
  clientName: string,
  content: string,
): ClientNote {
  const note: ClientNote = {
    id: Date.now().toString(),
    clientName,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  backendPortfolioState.clientNotes.push(note);
  return note;
}

export function addBackendTask(
  description: string,
  priority: Task["priority"] = "medium",
): Task {
  const task: Task = {
    id: Date.now().toString(),
    description,
    priority,
    createdAt: new Date().toISOString(),
    completed: false,
  };

  backendPortfolioState.tasks.push(task);
  return task;
}

export function completeBackendTask(id: string): Task | null {
  const task = backendPortfolioState.tasks.find((t) => t.id === id);
  if (task) {
    task.completed = true;
    return task;
  }
  return null;
}
