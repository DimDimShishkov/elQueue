import { useState, useEffect, useRef } from "react";
import { Checkbox } from "./Checkbox";
import Timetable from "../../utils/Timetable.json";
import Branches from "../../utils/Branches.json";
import Doctors from "../../utils/Doctors.json";
import { useSelector, useDispatch } from "react-redux";
import { addTicket, editTicket } from "../../redux/ticketsSlice";

/**
 * попап формы с добавлением талона
 */
export default function PopupWithForm({
  isOpen,
  onClose,
  isAddTicketForm,
  isEditTicket = false,
  children,
  title,
}) {
  const [buttonText, setButtonText] = useState("Записаться");
  const [isSubmitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [formPoints, setFormPoints] = useState(Timetable);
  const [chosenTime, setChosenTime] = useState(null);
  const ticketTypeRef = useRef(null);
  const ticketDescrRef = useRef(null);
  const dispatch = useDispatch();
  const { tickets, ticketsLastId } = useSelector((state) => state.tickets);

  // функция смены времени для записи
  const handleChangeTime = (e) => {
    const { checked, name } = e.target;
    // добавить подсветку редактируемого времени
    if (isEditTicket) {
      const index = Timetable.findIndex(
        (item) => item.time === isEditTicket.time
      );
      const newForm = [...Timetable];
      const item = Timetable[index];
      newForm[index] = { ...item, checked };
      setFormPoints(newForm);
      setChosenTime(isEditTicket.time);
    } else {
      const index = Timetable.findIndex((item) => item.name === name);
      const newForm = [...Timetable];
      const item = Timetable[index];
      newForm[index] = { ...item, checked };
      setFormPoints(newForm);
      setChosenTime(item.time);
    }
  };

  // закрытие попаппа по нажатию Esc
  useEffect(() => {
    const closeOnEsc = (evt) => {
      if (evt.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", closeOnEsc);
    return () => {
      document.removeEventListener("keydown", closeOnEsc);
    };
  }, [onClose]);

  function handleSubmitAddForm(evt) {
    evt.preventDefault();

    // захардкодил обращение к серверу
    setButtonText("Идет загрузка...");

    const chosenDate = new Date().toISOString().split("T")[0];
    const date2 = new Date(`${chosenDate}T${chosenTime}`);
    const currentDate = new Date();
    const diffTime = (date2 - currentDate) / 1000;
    if (chosenTime == null || diffTime < 0) {
      setButtonText("Выберите подходящее время");
    } else if (tickets.some((elem) => elem.time === chosenTime)) {
      setButtonText("Время занято");
    } else {
      setSubmitButtonDisabled(false);
      if (isEditTicket) {
        dispatch(
          editTicket({
            id: isEditTicket.id,
            type: ticketTypeRef.current.value,
            description: ticketDescrRef.current.value,
            date: chosenDate,
            time: chosenTime,
          })
        );
      } else {
        dispatch(
          addTicket({
            id: ticketsLastId + 1,
            type: ticketTypeRef.current.value,
            description: ticketDescrRef.current.value,
            date: chosenDate,
            time: chosenTime,
          })
        );
      }

      // захардкодил обращение к серверу
      setTimeout(function () {
        setButtonText("Записаться");
        onClose();
      }, 1000);
    }
  }

  let content;
  if (isAddTicketForm) {
    content = (
      <form className="popup__form" onSubmit={handleSubmitAddForm}>
        <p className="popup__subtitle">Выберите направление</p>
        <select ref={ticketTypeRef} className="popup__select">
          {Branches.map((el, i) => (
            <option value={el.value} key={i}>
              {el.text}
            </option>
          ))}
        </select>

        <p className="popup__subtitle">Выберите время</p>
        <div className="popup__checkboxs">
          {formPoints?.map((item, i) => {
            return (
              <Checkbox
                label={item.label}
                value={item.value}
                name={item.name}
                checked={item.checked}
                onChange={handleChangeTime}
                key={i}
              />
            );
          })}
        </div>
        {ticketTypeRef && (
          <>
            <p className="popup__subtitle">Выберите лечащего врача</p>
            <select ref={ticketDescrRef} className="popup__select">
              {Doctors.filter(
                (arr) => arr.branch === ticketTypeRef.current?.value
              ).map((el, i) => (
                <option value={el.value} key={i}>
                  {el.text}
                </option>
              ))}
            </select>
          </>
        )}
        <button
          type="submit"
          className={`popup__submit-button ${
            isSubmitButtonDisabled && "popup__submit-button_disabled"
          }`}
        >
          {buttonText}
        </button>
      </form>
    );
  } else {
    content = children;
  }

  return (
    <div
      className={`popup ${isOpen && "popup_opened"}`}
      onClick={() => onClose()}
    >
      <div
        className="popup__container"
        onClick={(evt) => evt.stopPropagation()}
      >
        <h2 className="popup__title">{title}</h2>
        {content}
        <button
          className="popup__exit-button"
          type="button"
          onClick={() => onClose()}
        ></button>
      </div>
    </div>
  );
}
