import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeTicket } from "../../redux/ticketsSlice";
import PopupWithForm from "./PopupWithForm";

/**
 * попап редактирования талона
 */
export default function EditTicketPopup({ isOpen, onClose }) {
  const [buttonText, setButtonText] = useState("Искать");
  const [editForm, setEditForm] = useState(false);
  const [deleteForm, setDeleteForm] = useState(false);
  const [chosenTicket, setChosenTicket] = useState({});
  const [formTitle, setFormTitle] = useState("Удалить или редактировать талон");
  const { tickets } = useSelector((state) => state.tickets);
  const ticketRef = useRef(null);
  const dispatch = useDispatch();

  // функция поиска талона
  function handleFindingTicket(evt) {
    evt.preventDefault();
    let findedTicket = tickets.find(
      (elem) => elem.id === +ticketRef.current.value
    );
    if (findedTicket) {
      setChosenTicket(findedTicket);
      setButtonText("Редактировать");
      setDeleteForm(true);
    } else {
      setButtonText("Талон не найден");
    }
  }
  // функция удаления талона
  function handleDeleteTicket(ticket) {
    dispatch(removeTicket(ticket));
    handleOnClosePopup();
  }
  // функция закрытия попапа
  function handleOnClosePopup() {
    onClose();
    setEditForm(false);
    setFormTitle("Удалить или редактировать талон");
    setDeleteForm(false);
    setButtonText("Искать");
    setChosenTicket({});
  }
  // функция редактирования талона
  function handleEditFormTitle() {
    setEditForm(true);
    setFormTitle("Редактировать запись");
  }

  let form;
  if (deleteForm) {
    form = (
      <div className="popup__form">
        <p className="popup__subtitle">
          Талон {chosenTicket.id} найден. Выберите действие:
        </p>
        <button
          type="button"
          className="popup__submit-button"
          onClick={() => handleDeleteTicket(chosenTicket)}
        >
          Удалить
        </button>
        <button
          type="button"
          className="popup__submit-button"
          onClick={handleEditFormTitle}
        >
          {buttonText}
        </button>
      </div>
    );
  } else {
    form = (
      <form className="popup__form" onSubmit={handleFindingTicket}>
        <p className="popup__subtitle">Введите номер талона</p>
        <input
          className="popup__input"
          placeholder="номер талона"
          type="number"
          ref={ticketRef}
        ></input>
        <button type="submit" className="popup__submit-button">
          {buttonText}
        </button>
      </form>
    );
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={handleOnClosePopup}
      isAddTicketForm={editForm}
      children={form}
      title={formTitle}
      isEditTicket={chosenTicket}
    />
  );
}

// при редактировании талона,
// изначально выбранное время должно подсвечиваться
