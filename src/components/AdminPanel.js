import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeTicket } from "./../redux/ticketsSlice";
import AddTicketPopup from "./Popups/AddTicketPopup";
import { Checkbox } from "./Popups/Checkbox";
import EditTicketPopup from "./Popups/EditTicketPopup";
import InfoPopup from "./Popups/InfoPopup";

/**
 * админ панель для редактирования и удаления талона
 */
export default function AdminPanel() {
  const dispatch = useDispatch();
  const { tickets } = useSelector((state) => state.tickets);

  const [isOpenEditTicketPopup, setOpenEditTicketPopup] = useState(false);
  const [isOpenNewTicketPopup, setOpenNewTicketPopup] = useState(false);
  const [isOpenInfoPopup, setOpenInfoPopup] = useState(false);
  const [deleteForm, setDeleteForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isTicketToDelete, setTicketToDelete] = useState(null);

  // функция удаления талона
  function handleDeleteTicket(ticket) {
    setTicketToDelete(ticket);
    setOpenInfoPopup(true);
    dispatch(removeTicket(ticket));
    setDeleteForm(false);
  }

  // функция выбора талона
  function handleChooseTicket(e) {
    const { value } = e.target;
    let findedTicket = tickets.find((elem) => elem.id === +value);
    setDeleteForm(true);
    setSelectedTicket(findedTicket);
  }

  function closeAllPopups() {
    setOpenEditTicketPopup(false);
    setOpenNewTicketPopup(false);
    setDeleteForm(false);
  }

  const renderContent = () => {
    if (deleteForm) {
      return (
        <>
          <h2 className="popup__subtitle">Талон {selectedTicket?.type + selectedTicket?.id} выбран. Что нужно сделать?</h2>
          <div className="popup__checkboxes">
            <button type="button" className="popup__button" onClick={() => handleDeleteTicket(selectedTicket)}>
              Удалить
            </button>
            <button type="button" className="popup__button" onClick={() => setOpenEditTicketPopup(true)}>
              Редактировать
            </button>
            <button type="button" className="popup__button" onClick={() => setDeleteForm(false)}>
              Назад
            </button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <h2 className="popup__subtitle">Выберите талон</h2>
          <div className="popup__checkboxes">
            {tickets.length ? (
              tickets.map((item, i) => {
                return <Checkbox label={item.type + item.id} value={item.id} onChange={handleChooseTicket} key={i} />;
              })
            ) : (
              <p>Талонов не осталось</p>
            )}
          </div>
        </>
      );
    }
  };

  return (
    <div className="terminal">
      {renderContent()}
      <h2 className="popup__subtitle">Или добавьте новый талон</h2>
      <button type="button" className="popup__button" onClick={() => setOpenNewTicketPopup(true)}>
        Добавить
      </button>
      {isOpenEditTicketPopup && <EditTicketPopup isOpen={isOpenEditTicketPopup} onClose={closeAllPopups} chosenTicket={selectedTicket} />}
      {isOpenNewTicketPopup && <AddTicketPopup isOpen={isOpenNewTicketPopup} onClose={closeAllPopups} />}
      {isOpenInfoPopup && (
        <InfoPopup isOpen={isOpenInfoPopup} onClose={() => setOpenInfoPopup(false)} isInfo={isTicketToDelete} isDelete={true} />
      )}
    </div>
  );
}
