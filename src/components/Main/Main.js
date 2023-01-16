import { useSelector } from "react-redux";
import Ticket from "./Ticket";

export default function Main({ ticketToDelete }) {
  const { tickets } = useSelector((state) => state.tickets);

  let ticketsForRendering;
  if (tickets.length > 0) {
    ticketsForRendering = tickets.slice(0, 10).map((item, i) => <Ticket card={item} key={i} deleteTicket={ticketToDelete} />);
  } else {
    ticketsForRendering = <p className="main__text">На данный момент талонов нет</p>;
  }

  return (
    <div className="main">
      <div className="main__text-container">
        <h2 className="main__heading">Посетитель</h2>
        <h2 className="main__heading">Осталось до приёма</h2>
      </div>
      <div className="main__ticket-container">{ticketsForRendering}</div>
    </div>
  );
}
