import Ticket from "./Ticket";
import { useSelector } from "react-redux";
import { useState } from "react";
import TicketDeletePopup from "../Popups/TicketDeletePopup";

export default function Main() {
  const { tickets } = useSelector((state) => state.tickets);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [isTicketPopupOpen, setTicketPopupOpen] = useState(false);

  function hanleOpenDeletePopup(item) {
    setTicketToDelete(item);
    setTicketPopupOpen(true);
  }

  let ticketsForRendering;
  if (tickets.length > 0) {
    ticketsForRendering = tickets
      .slice(0, 10)
      .map((item, i) => (
        <Ticket card={item} key={i} deleteTicket={hanleOpenDeletePopup} />
      ));
  } else {
    ticketsForRendering = (
      <p className="main__text">На данный момент талонов нет</p>
    );
  }

  return (
    <div className="main">
      <div className="main__text-container">
        <h2 className="main__heading">Посетитель</h2>
        <h2 className="main__heading">Осталось до приёма</h2>
      </div>
      <div className="main__ticket-container">{ticketsForRendering}</div>
      {ticketToDelete && (
        <TicketDeletePopup
          isOpen={isTicketPopupOpen}
          onClose={() => setTicketPopupOpen(false)}
          ticket={ticketToDelete}
        />
      )}
    </div>
  );
}
