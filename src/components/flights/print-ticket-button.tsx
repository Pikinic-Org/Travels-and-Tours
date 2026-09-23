"use client";

import { Button } from "@/components/ui/button";

export const PrintTicketButton = () => (
  <Button type="button" variant="secondary" size="md" onClick={() => window.print()}>
    Print Ticket
  </Button>
);
