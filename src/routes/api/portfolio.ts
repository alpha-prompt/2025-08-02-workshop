import { createServerFileRoute } from "@tanstack/react-start/server";

import { getBackendPortfolioState } from "@/lib/portfolio-backend";

export const ServerRoute = createServerFileRoute("/api/portfolio").methods({
  GET: async () => {
    const state = getBackendPortfolioState();
    return Response.json(state);
  },
});
