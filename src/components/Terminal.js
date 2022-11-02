import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sortingTimetable } from "../utils/helpers";
import { addTicket } from "./../redux/ticketsSlice";
import MockBranches from "./../utils/MockBranches.json";
import MockDoctors from "./../utils/MockDoctors.json";
import Timetable from "./../utils/Timetable.json";
import { Checkbox } from "./Popups/Checkbox";
import InfoPopup from "./Popups/InfoPopup";

/**
 * форма с добавлением талона
 */
export default function Terminal() {
  const dispatch = useDispatch();
  const { tickets, ticketsLastId } = useSelector((state) => state.tickets);

  const [buttonText, setButtonText] = useState("Записаться");
  const [formPoints, setFormPoints] = useState(Timetable);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState({});
  const [isOpenInfoPopup, setOpenInfoPopup] = useState(false);
  const [errInfo, setErrInfo] = useState(false);
  const [newTicket, setNewTicket] = useState(null);

  // подсветка текущего времени
  useEffect(() => {
    setFormPoints(sortingTimetable(tickets));
    setSelectedTime(sortingTimetable(tickets).find((item) => item.checked).time);

    setSelectedBranch("A");
  }, []);

  useEffect(() => {
    const filteredDoctors = MockDoctors.filter((x) => x.branch === selectedBranch);
    setDoctors(filteredDoctors);
    setSelectedDoctor(filteredDoctors[0]?.text);
  }, [selectedBranch]);

  // отправка формы
  const handleSubmitAddForm = (evt) => {
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
    const diffTime = (date2 - currentDate) / 1000;
    if (!selectedTime || diffTime < 0) {
      setErrInfo("Выберите подходящее время");
      return setOpenInfoPopup(true);
    }
    if (tickets.some((elem) => elem.time === selectedTime)) {
      setErrInfo("Время занято");
      return setOpenInfoPopup(true);
    }
    if (!selectedDoctor || !selectedBranch) {
      setErrInfo("Выберите направление и врача");
      return setOpenInfoPopup(true);
    }
    dispatch(
      addTicket({
        id: ticketsLastId + 1,
        type: selectedBranch,
        description: selectedDoctor,
        date: chosenDate,
        time: selectedTime,
      })
    );
    setNewTicket({
      id: ticketsLastId + 1,
      type: selectedBranch,
    });
    setFormPoints(sortingTimetable(tickets));
    setOpenInfoPopup(true);
    return setSelectedTime(null);
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
    setFormPoints(newTimetableForm);
    setSelectedTime(newTimetableForm[index].checked ? newTimetableForm[index].time : null);
  };

  // функция выбора направления
  const handleChosenBranch = (e) => {
    const { value } = e.target;
    setSelectedBranch(value);
  };

  // функция выбора доктора
  const handleChosenDoctor = (e) => {
    const { value } = e.target;
    setSelectedDoctor(value);
  };

  return (
    <div className="terminal">
      <h2 className="popup__subtitle">Записаться к врачу</h2>
      <form className="popup__form" onSubmit={handleSubmitAddForm}>
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
          {formPoints.map((point) => (
            <Checkbox
              label={point.label}
              value={point.value}
              name={point.name}
              checked={point.checked}
              disabled={point.disabled}
              onChange={handleChangeTime}
              key={point.value}
            />
          ))}
        </div>

        {selectedBranch && (
          <>
            <p className="popup__subtitle">Выберите лечащего врача</p>
            <select onChange={handleChosenDoctor} className="popup__select" defaultValue={doctors[0]?.text}>
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
      {errInfo && <InfoPopup isOpen={isOpenInfoPopup} onClose={() => setOpenInfoPopup(false)} isInfo={errInfo} isErr={true} />}
      {newTicket && <InfoPopup isOpen={isOpenInfoPopup} onClose={() => setOpenInfoPopup(false)} isInfo={newTicket} />}
    </div>
  );
}
