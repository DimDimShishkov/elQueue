import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeTicket } from "../../redux/ticketsSlice";

/**
 * попап с талоном
 */
export default function TicketPopup({ isOpen, onClose, ticket }) {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(function () {
      dispatch(removeTicket(ticket));
      onClose();
    }, 5000);
  }, [ticket]);

  return (
    <div className={`popup ${isOpen && "popup_opened"}`}>
      <div className="popup__container">
        <h2 className="popup__title">Талон {ticket.type + ticket.id}</h2>
        <h2 className="popup__title">Подойдите к окну №2</h2>
      </div>
    </div>
  );
}
