import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeTicket } from "./../redux/ticketsSlice";
import AddTicketPopup from "./Popups/AddTicketPopup";
import { Checkbox } from "./Popups/Checkbox";
import EditTicketPopup from "./Popups/EditTicketPopup";
import InfoPopup from "./Popups/InfoPopup";

/**
 * админ панель для редактирования и удаления талона
 */
export default function AdminPanel() {
  const [isOpenEditTicketPopup, setOpenEditTicketPopup] = useState(false);
  const [isOpenNewTicketPopup, setOpenNewTicketPopup] = useState(false);
  const [isOpenInfoPopup, setOpenInfoPopup] = useState(false);
  const [deleteForm, setDeleteForm] = useState(false);
  const [chosenTicket, setChosenTicket] = useState({});
  const { tickets } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();
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
    setChosenTicket(findedTicket);
  }

  function closeAllPopups() {
    setOpenEditTicketPopup(false);
    setOpenNewTicketPopup(false);
    setDeleteForm(false);
  }

  let content;
  if (deleteForm) {
    content = (
      <>
        <h2 className="popup__subtitle">
          Талон {chosenTicket.type + chosenTicket.id} выбран. Что нужно сделать?
        </h2>
        <div className="popup__checkboxs">
          <button
            type="button"
            className="popup__button"
            onClick={() => handleDeleteTicket(chosenTicket)}
          >
            Удалить
          </button>
          <button
            type="button"
            className="popup__button"
            onClick={() => setOpenEditTicketPopup(true)}
          >
            Редактировать
          </button>
          <button
            type="button"
            className="popup__button"
            onClick={() => setDeleteForm(false)}
          >
            Назад
          </button>
        </div>
      </>
    );
  } else {
    content = (
      <>
        <h2 className="popup__subtitle">Выберите талон</h2>
        <div className="popup__checkboxs">
          {tickets.length > 0 ? (
            tickets.map((item, i) => {
              return (
                <Checkbox
                  label={item.type + item.id}
                  value={item.id}
                  onChange={handleChooseTicket}
                  key={i}
                />
              );
            })
          ) : (
            <p>Талонов не осталось</p>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="terminal">
      {content}
      <h2 className="popup__subtitle">Или добавьте новый талон</h2>
      <button
        type="button"
        className="popup__button"
        onClick={() => setOpenNewTicketPopup(true)}
      >
        Добавить
      </button>
      {isOpenEditTicketPopup && (
        <EditTicketPopup
          isOpen={isOpenEditTicketPopup}
          onClose={closeAllPopups}
          chosenTicket={chosenTicket}
        />
      )}
      {isOpenNewTicketPopup && (
        <AddTicketPopup
          isOpen={isOpenNewTicketPopup}
          onClose={closeAllPopups}
        />
      )}
      {isOpenInfoPopup && (
        <InfoPopup
          isOpen={isOpenInfoPopup}
          onClose={() => setOpenInfoPopup(false)}
          isInfo={isTicketToDelete}
          isDelete={true}
        />
      )}
    </div>
  );
}
