import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Checkbox } from "./Checkbox";
import Timetable from "../../utils/Timetable.json";
import MockBranches from "../../utils/MockBranches.json";
import MockDoctors from "../../utils/MockDoctors.json";
import { editTicket } from "../../redux/ticketsSlice";
import InfoPopup from "./InfoPopup";
import { sortingTimetable } from "../../utils/helpers";

/**
 * попап редактирования талона
 */
export default function EditTicketPopup({ isOpen, onClose, chosenTicket }) {
  const dispatch = useDispatch();
  const { tickets } = useSelector((state) => state.tickets);

  const [timePoints, setTimePoints] = useState(Timetable);
  const [selectedTime, setSelectedTime] = useState(chosenTicket.time);
  const [selectedBranch, setSelectedBranch] = useState(chosenTicket.type);
  const [selectedDoctor, setSelectedDoctor] = useState(chosenTicket.description);
  const [buttonText, setButtonText] = useState("Редактировать запись");
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
    setTimePoints(sortingTimetable(tickets, chosenTicket));
  }, [chosenTicket]);

  useEffect(() => {
    const filteredDoctors = MockDoctors.filter((x) => x.branch === selectedBranch);
    setSelectedDoctor(filteredDoctors[0]?.text);
  }, [selectedBranch]);

  // функция выбора направления
  const handleChosenBranch = (e) => {
    const { value } = e.target;
    setSelectedBranch(value);
  };

  // функция смены времени для записи
  const handleChangeTime = (e) => {
    const { checked, name } = e.target;
    const currentTime = new Date().toLocaleTimeString();
    const index = Timetable.findIndex((item) => item.name === name);
    const newTimetableForm = [...Timetable];
    const item = Timetable[index];
    newTimetableForm[index] = { ...item, checked };
    newTimetableForm.forEach((x) => {
      x.disabled = tickets?.some(
        (ticket) => x.time.split(":")[0] <= currentTime.split(":")[0] || (ticket.time === x.time && ticket.time !== chosenTicket.time)
      );
    });
    setTimePoints(newTimetableForm);
    setSelectedTime(newTimetableForm[index].checked ? newTimetableForm[index].time : null);
  };

  // функция выбора доктора
  const handleChosenDoctor = (e) => {
    const { value } = e.target;
    console.log(value)
    setSelectedDoctor(value);
  };

  // отправка формы
  const handleSubmitEditForm = (evt) => {
    evt.preventDefault();
    const date2 = new Date(`${chosenTicket.date}T${selectedTime}`);
    const currentDate = new Date();
    const diffTime = (Date.parse(date2) - Date.parse(currentDate)) / 1000;
    if (!selectedTime || diffTime < 0) {
      return setButtonText("Выбранно прошедшее время");
    }
    if (tickets.some((ticket) => ticket.time === selectedTime && ticket.id !== chosenTicket.id)) {
      return setButtonText("Время занято");
    }
    setNewTicket({ id: chosenTicket.id, type: selectedBranch });
    dispatch(
      editTicket({
        id: chosenTicket.id,
        type: selectedBranch,
        description: selectedDoctor,
        date: chosenTicket.date,
        time: selectedTime,
      })
    );
  };

  return (
    <div className={`popup ${isOpen && "popup_opened"}`} onClick={() => onClose()}>
      <div className="popup__container" onClick={(evt) => evt.stopPropagation()}>
        <form className="popup__form" onSubmit={handleSubmitEditForm}>
          <p className="popup__subtitle">Выберите направление</p>
          <select onChange={handleChosenBranch} className="popup__select" defaultValue={selectedBranch}>
            {MockBranches.map((branch) => (
              <option value={branch.value} key={branch.value}>
                {branch.text}
              </option>
            ))}
          </select>

          <p className="popup__subtitle">Выберите время</p>
          <div className="popup__checkboxes">
            {timePoints?.map((point) => {
              return (
                <Checkbox
                  label={point.label}
                  value={point.value}
                  name={point.name}
                  checked={point.checked}
                  disabled={point.disabled}
                  onChange={handleChangeTime}
                  key={point.value}
                />
              );
            })}
          </div>

          <p className="popup__subtitle">Выберите лечащего врача</p>
          <select onChange={handleChosenDoctor} className="popup__select" defaultValue={selectedDoctor}>
            {MockDoctors.filter((doctors) => doctors.branch === selectedBranch).map((doctor) => (
              <option value={doctor.text} key={doctor.text}>
                {doctor.text}
              </option>
            ))}
          </select>

          <button type="submit" className="popup__submit-button">
            {buttonText}
          </button>
        </form>
        <button className="popup__exit-button" type="button" onClick={() => onClose()}></button>
      </div>
      {newTicket && <InfoPopup isOpen={isOpen} onClose={onClose} isInfo={newTicket} isEdit={true} />}
    </div>
  );
}
