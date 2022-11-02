import { useState, useEffect } from "react";
import { Checkbox } from "./Checkbox";
import Timetable from "../../utils/Timetable.json";
import Branches from "../../utils/Branches.json";
import Doctors from "../../utils/Doctors.json";
import { useSelector, useDispatch } from "react-redux";
import { addTicket } from "../../redux/ticketsSlice";
import InfoPopup from "./InfoPopup";

/**
 * попап добавления талона
 */
export default function AddTicketPopup({ isOpen, onClose }) {
  const [formPoints, setFormPoints] = useState(Timetable);
  const [chosenTime, setChosenTime] = useState(null);
  const [chosenBranch, setChosenBranch] = useState(null);
  const [chosenDoctor, setChosenDoctor] = useState(null);
  const [buttonText, setButtonText] = useState("Записаться");
  const dispatch = useDispatch();
  const { tickets, ticketsLastId } = useSelector((state) => state.tickets);
  const [newTicket, setNewTicket] = useState(null);
  const [doctorsArr, setDoctorsArr] = useState({});

  useEffect(() => {
    setChosenBranch("A");
  }, []);

  useEffect(() => {
    let doctorsArr = Doctors.filter((arr) => arr.branch === chosenBranch);
    setDoctorsArr(doctorsArr);
    setChosenDoctor(doctorsArr[0]?.text);
  }, [chosenBranch]);

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

  // функция выбора направления
  const handleChosenBranch = (e) => {
    const { value } = e.target;
    setChosenBranch(value);
  };

  // подсветка текущего времени
  useEffect(() => {
    const currentTime = new Date().toLocaleTimeString();
    const index = Timetable.findIndex(
      (item) => item.time.split(":")[0] > currentTime.split(":")[0]
    );
    const newForm = [...Timetable];
    const item = Timetable[index];
    newForm[index] = { ...item, checked: true };
    setFormPoints(newForm);
    setChosenTime(item.time);
  }, [isOpen]);

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
    const chosenDate = new Date().toISOString().split("T")[0];
    const date2 = new Date(`${chosenDate}T${chosenTime}`);
    const currentDate = new Date();
    const diffTime = (Date.parse(date2) - Date.parse(currentDate)) / 1000;
    if (diffTime < 0) {
      setButtonText("Выбранно прошедшее время");
    } else if (tickets.some((elem) => elem.time === chosenTime)) {
      setButtonText("Время занято");
    } else {
      setNewTicket({ id: ticketsLastId + 1, type: chosenBranch });
      dispatch(
        addTicket({
          id: ticketsLastId + 1,
          type: chosenBranch,
          description: chosenDoctor,
          date: chosenDate,
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
            defaultValue={"A"}
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

          {chosenBranch && (
            <>
              <p className="popup__subtitle">Выберите лечащего врача</p>
              <select
                onChange={handleChosenDoctor}
                className="popup__select"
                defaultValue={doctorsArr[0]?.value}
              >
                {doctorsArr?.map((el, i) => (
                  <option value={el.value} key={i}>
                    {el.text}
                  </option>
                ))}
              </select>
            </>
          )}

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
        <InfoPopup isOpen={isOpen} onClose={onClose} isInfo={newTicket} />
      )}
    </div>
  );
}
