import React from "react";
import { render, screen } from "@testing-library/react";
import Ticket from "./Ticket";

const mockTicketCard = {
  id: "23",
  type: "A",
  description: "Тестовая карточка",
};

/**
 * Просто тест для демонстрации
 */
it("should render Ticket component", () => {
  render(<Ticket card={mockTicketCard} />);
  expect(screen.getByText(`№${mockTicketCard.type + mockTicketCard.id}, к доктору ${mockTicketCard.description}`)).toBeInTheDocument();
});
