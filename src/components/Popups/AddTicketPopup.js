import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTicket } from "../../redux/ticketsSlice";
import { sortingTimetable } from "../../utils/helpers";
import MockBranches from "../../utils/MockBranches.json";
import MockDoctors from "../../utils/MockDoctors.json";
import Timetable from "../../utils/Timetable.json";
import { Checkbox } from "./Checkbox";
import InfoPopup from "./InfoPopup";

/**
 * попап добавления талона
 */
export default function AddTicketPopup({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { tickets, ticketsLastId } = useSelector((state) => state.tickets);
  const [timePoints, setTimePoints] = useState(Timetable);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [buttonText, setButtonText] = useState("Записаться");
  const [newTicket, setNewTicket] = useState(null);
  const [doctors, setDoctors] = useState({});

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

  // подсветка текущего времени
  useEffect(() => {
    setTimePoints(sortingTimetable(tickets));
    setSelectedTime(sortingTimetable(tickets).find((item) => item.checked).time);
    setSelectedBranch("A");
  }, []);

  useEffect(() => {
    let filteredDoctors = MockDoctors.filter((x) => x.branch === selectedBranch);
    setDoctors(filteredDoctors);
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
    if (tickets.length) {
      newTimetableForm.forEach((x) => {
        x.disabled = tickets?.some((ticket) => ticket.time === x.time || x.time.split(":")[0] <= currentTime.split(":")[0]);
      });
    } else {
      newTimetableForm.forEach((x) => {
        x.disabled = x.time.split(":")[0] <= currentTime.split(":")[0];
      });
    }
    setTimePoints(newTimetableForm);
    setSelectedTime(newTimetableForm[index].checked ? newTimetableForm[index].time : null);
  };

  // функция выбора доктора
  const handleChosenDoctor = (e) => {
    const { value } = e.target;
    setSelectedDoctor(value);
  };

  // отправка формы
  const handleSubmitEditForm = (evt) => {
    evt.preventDefault();

    // захардкодил обращение к серверу
    setButtonText("Идет загрузка...");
    setTimeout(function () {
      setButtonText("Записаться");
      setNewTicket(null);
    }, 1000);

    const chosenDate = new Date().toISOString().split("T")[0];
    const date2 = new Date(`${chosenDate}T${selectedTime}`);
    const currentDate = new Date();
    const diffTime = (Date.parse(date2) - Date.parse(currentDate)) / 1000;
    if (!selectedTime || diffTime < 0) {
      return setButtonText("Выберите подходящее время");
    }
    if (tickets.some((elem) => elem.time === selectedTime)) {
      return setButtonText("Время занято");
    }
    setNewTicket({ id: ticketsLastId + 1, type: selectedBranch });
    dispatch(
      addTicket({
        id: ticketsLastId + 1,
        type: selectedBranch,
        description: selectedDoctor,
        date: chosenDate,
        time: selectedTime,
      })
    );
    setTimePoints(sortingTimetable(tickets));
  };

  return (
    <div className={`popup ${isOpen && "popup_opened"}`} onClick={() => onClose()}>
      <div className="popup__container" onClick={(evt) => evt.stopPropagation()}>
        <form className="popup__form" onSubmit={handleSubmitEditForm}>
          <p className="popup__subtitle">Выберите направление</p>
          <select onChange={handleChosenBranch} className="popup__select" defaultValue={"A"}>
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

          {selectedBranch && (
            <>
              <p className="popup__subtitle">Выберите лечащего врача</p>
              <select onChange={handleChosenDoctor} className="popup__select" defaultValue={doctors[0]?.value}>
                {doctors?.map((doctor) => (
                  <option value={doctor.text} key={doctor.text}>
                    {doctor.text}
                  </option>
                ))}
              </select>
            </>
          )}

          <button type="submit" className="popup__submit-button">
            {buttonText}
          </button>
        </form>
        <button className="popup__exit-button" type="button" onClick={() => onClose()}></button>
      </div>
      {newTicket && <InfoPopup isOpen={isOpen} onClose={onClose} isInfo={newTicket} />}
    </div>
  );
}
