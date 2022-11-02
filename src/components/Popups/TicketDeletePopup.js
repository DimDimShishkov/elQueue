import { useEffect } from "react";

/**
 * попап с талоном удаления из очереди
 */
export default function TicketDeletePopup({ isOpen, onClose, ticket }) {

  useEffect(() => {
    setTimeout(function () {
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
