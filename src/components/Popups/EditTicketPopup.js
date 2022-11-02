import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Checkbox } from "./Checkbox";
import Timetable from "../../utils/Timetable.json";
import Branches from "../../utils/Branches.json";
import Doctors from "../../utils/Doctors.json";
import { editTicket } from "../../redux/ticketsSlice";
import InfoPopup from "./InfoPopup";

/**
 * попап редактирования талона
 */
export default function EditTicketPopup({ isOpen, onClose, chosenTicket }) {
  const [formPoints, setFormPoints] = useState(Timetable);
  const [chosenTime, setChosenTime] = useState(chosenTicket.time);
  const [chosenBranch, setChosenBranch] = useState(chosenTicket.type);
  const [chosenDoctor, setChosenDoctor] = useState(chosenTicket.description);
  const [buttonText, setButtonText] = useState("Редактировать запись");
  const dispatch = useDispatch();
  const { tickets } = useSelector((state) => state.tickets);
  const [newTicket, setNewTicket] = useState(null);

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

  // подсветка существующего времени
  useEffect(() => {
    const index = Timetable.findIndex(
      (item) => item.time.split(":")[0] === chosenTicket.time.split(":")[0]
    );
    const newForm = [...Timetable];
    const item = Timetable[index];
    newForm[index] = { ...item, checked: true };
    setFormPoints(newForm);
  }, [chosenTicket]);

  // функция выбора направления
  const handleChosenBranch = (e) => {
    const { value } = e.target;
    setChosenBranch(value);
  };

  // функция смены времени для записи
  const handleChangeTime = (e) => {
    const { checked, name } = e.target;
    const index = Timetable.findIndex((item) => item.name === name);
    const newForm = [...Timetable];
    const item = Timetable[index];
    newForm[index] = { ...item, checked };
    setFormPoints(newForm);
    setChosenTime(item.time);
  };

  // функция выбора доктора
  const handleChosenDoctor = (e) => {
    const { value } = e.target;
    setChosenDoctor(value);
  };

  function handleSubmitEditForm(evt) {
    evt.preventDefault();
    const date2 = new Date(`${chosenTicket.date}T${chosenTime}`);
    const currentDate = new Date();
    const diffTime = (Date.parse(date2) - Date.parse(currentDate)) / 1000;
    if (diffTime < 0) {
      setButtonText("Выбранно прошедшее время");
    } else if (
      tickets.some(
        (elem) => elem.time === chosenTime && elem.id !== chosenTicket.id
      )
    ) {
      setButtonText("Время занято");
    } else {
      setNewTicket({ id: chosenTicket.id, type: chosenBranch });
      dispatch(
        editTicket({
          id: chosenTicket.id,
          type: chosenBranch,
          description: chosenDoctor,
          date: chosenTicket.date,
          time: chosenTime,
        })
      );
    }
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
        <form className="popup__form" onSubmit={handleSubmitEditForm}>
          <p className="popup__subtitle">Выберите направление</p>
          <select
            onChange={handleChosenBranch}
            className="popup__select"
            defaultValue={chosenBranch}
          >
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

          <p className="popup__subtitle">Выберите лечащего врача</p>
          <select
            onChange={handleChosenDoctor}
            className="popup__select"
            defaultValue={chosenDoctor}
          >
            {Doctors.filter((arr) => arr.branch === chosenBranch).map(
              (el, i) => (
                <option value={el.value} key={i}>
                  {el.text}
                </option>
              )
            )}
          </select>

          <button type="submit" className="popup__submit-button">
            {buttonText}
          </button>
        </form>
        <button
          className="popup__exit-button"
          type="button"
          onClick={() => onClose()}
        ></button>
      </div>
      {newTicket && (
        <InfoPopup isOpen={isOpen} onClose={onClose} isInfo={newTicket} isEdit={true}/>
      )}
    </div>
  );
}
