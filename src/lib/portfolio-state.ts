// Data persists during session but resets on refresh
export interface PortfolioCompany {
  name: string;
  sector: string;
  currentValuation: number;
  revenue: number;
}

export interface ClientNote {
  id: string;
  clientName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  description: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  completed: boolean;
}

export interface PortfolioState {
  companies: PortfolioCompany[];
  clientNotes: ClientNote[];
  tasks: Task[];
}
