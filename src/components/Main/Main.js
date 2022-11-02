import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeTicket } from "../../redux/ticketsSlice";
import TicketDeletePopup from "../Popups/TicketDeletePopup";
import Ticket from "./Ticket";

export default function Main() {
  const dispatch = useDispatch();
  const { tickets } = useSelector((state) => state.tickets);

  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [deletePopupOpened, setDeletePopupOpened] = useState(false);

  const handleOpenDeletePopup = (item) => {
    setTicketToDelete(item);
    setDeletePopupOpened(true);

    setTimeout(function () {
      dispatch(removeTicket(item));
    }, 5000);
  };

  const ticketsForRendering = () => {
    if (tickets.length) {
      return tickets.slice(0, 10).map((ticket) => <Ticket card={ticket} key={ticket.id} deleteTicket={handleOpenDeletePopup} />);
    } else {
      return <p className="main__text">На данный момент талонов нет</p>;
    }
  };

  return (
    <div className="main">
      <div className="main__text-container">
        <h2 className="main__heading">Посетитель</h2>
        <h2 className="main__heading">Осталось до приёма</h2>
      </div>
      <div className="main__ticket-container">{ticketsForRendering()}</div>
      {ticketToDelete && (
        <TicketDeletePopup isOpen={deletePopupOpened} onClose={() => setDeletePopupOpened(false)} ticket={ticketToDelete} />
      )}
    </div>
  );
}
