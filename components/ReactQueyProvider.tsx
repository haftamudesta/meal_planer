"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const client = new QueryClient();

const ReactQueyProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </div>
  );
};

export default ReactQueyProvider;
