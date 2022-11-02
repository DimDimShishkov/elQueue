import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTicket } from "./../redux/ticketsSlice";
import MockBranches from "./../utils/Branches.json";
import MockDoctors from "./../utils/Doctors.json";
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
    const currentTime = new Date().toLocaleTimeString();
    const index = Timetable.findIndex((item) => item.time.split(":")[0] > currentTime.split(":")[0]);
    const newTimetableForm = [...Timetable];
    const item = Timetable[index];
    newTimetableForm[index] = { ...item, checked: true };

    newTimetableForm.forEach((x) => {
      x.disabled = tickets.some((elem) => elem.time === x.time);
    });

    setFormPoints(newTimetableForm);
    setSelectedTime(item.time);
    setSelectedBranch("A");
  }, []);

  useEffect(() => {
    const filteredDoctors = MockDoctors.filter((x) => x.branch === selectedBranch);

    setDoctors(filteredDoctors);
    setSelectedDoctor(filteredDoctors[0]?.text);
  }, [selectedBranch]);

  const handleSubmitAddForm = (evt) => {
    evt.preventDefault();

    // захардкодил обращение к серверу
    setButtonText("Идет загрузка...");
    setTimeout(function () {
      setButtonText("Записаться");
    }, 1000);
    const chosenDate = new Date().toISOString().split("T")[0];
    const date2 = new Date(`${chosenDate}T${selectedTime}`);
    const currentDate = new Date();
    const diffTime = (date2 - currentDate) / 1000;
    if (!selectedTime || diffTime < 0) {
      setErrInfo("Выберите подходящее время");
      setOpenInfoPopup(true);
    } else if (tickets.some((elem) => elem.time === selectedTime)) {
      setErrInfo("Время занято");
      setOpenInfoPopup(true);
    } else if (!selectedDoctor || !selectedBranch) {
      setErrInfo("Выберите направление и врача");
      setOpenInfoPopup(true);
    } else {
      setNewTicket({
        id: ticketsLastId + 1,
        type: selectedBranch,
      });
      setOpenInfoPopup(true);
      dispatch(
        addTicket({
          id: ticketsLastId + 1,
          type: selectedBranch,
          description: selectedDoctor,
          date: chosenDate,
          time: selectedTime,
        })
      );
      setSelectedTime(null);
    }
  };

  // функция смены времени для записи
  const handleChangeTime = (e) => {
    const { checked, name } = e.target;
    const index = Timetable.findIndex((item) => item.name === name);
    const newForm = [...Timetable];
    const item = Timetable[index];
    newForm[index] = { ...item, checked };
    setFormPoints(newForm);
    setSelectedTime(item.time);
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
          {MockBranches.map((el, i) => (
            <option value={el.value} key={i}>
              {el.text}
            </option>
          ))}
        </select>
        <p className="popup__subtitle">Выберите время</p>
        <div className="popup__checkboxes">
          {formPoints?.map((item, i) => (
            <Checkbox
              label={item.label}
              value={item.value}
              name={item.name}
              checked={item.checked}
              disabled={item.disabled}
              onChange={handleChangeTime}
              key={i}
            />
          ))}
        </div>

        {selectedBranch && (
          <>
            <p className="popup__subtitle">Выберите лечащего врача</p>
            <select onChange={handleChosenDoctor} className="popup__select" defaultValue={doctors[0]?.value}>
              {doctors?.map((el, i) => (
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
      {isOpenInfoPopup && <InfoPopup isOpen={isOpenInfoPopup} onClose={() => setOpenInfoPopup(false)} isInfo={errInfo} isErr={true} />}
      {newTicket && <InfoPopup isOpen={isOpenInfoPopup} onClose={() => setOpenInfoPopup(false)} isInfo={newTicket} />}
    </div>
  );
}
