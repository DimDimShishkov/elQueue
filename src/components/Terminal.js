import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Timetable from "./../utils/Timetable.json";
import Branches from "./../utils/Branches.json";
import Doctors from "./../utils/Doctors.json";
import { Checkbox } from "./Popups/Checkbox";
import { addTicket } from "./../redux/ticketsSlice";
import InfoPopup from "./Popups/InfoPopup";

/**
 * форма с добавлением талона
 */
export default function Terminal() {
  const [buttonText, setButtonText] = useState("Записаться");
  const [formPoints, setFormPoints] = useState(Timetable);
  const [chosenTime, setChosenTime] = useState(null);
  const [chosenBranch, setChosenBranch] = useState(null);
  const [chosenDoctor, setChosenDoctor] = useState(null);
  const [doctorsArr, setDoctorsArr] = useState({});
  const [isOpenInfoPopup, setOpenInfoPopup] = useState(false);
  const [errInfo, setErrInfo] = useState(false);
  const dispatch = useDispatch();
  const { tickets, ticketsLastId } = useSelector((state) => state.tickets);
  const [newTicket, setNewTicket] = useState(null);

  function handleSubmitAddForm(evt) {
    evt.preventDefault();

    // захардкодил обращение к серверу
    setButtonText("Идет загрузка...");
    setTimeout(function () {
      setButtonText("Записаться");
    }, 1000);
    const chosenDate = new Date().toISOString().split("T")[0];
    const date2 = new Date(`${chosenDate}T${chosenTime}`);
    const currentDate = new Date();
    const diffTime = (date2 - currentDate) / 1000;
    if (!chosenTime || diffTime < 0) {
      setErrInfo("Выберите подходящее время");
      setOpenInfoPopup(true);
    } else if (tickets.some((elem) => elem.time === chosenTime)) {
      setErrInfo("Время занято");
      setOpenInfoPopup(true);
    } else if (!chosenDoctor || !chosenBranch) {
      setErrInfo("Выберите направление и врача");
      setOpenInfoPopup(true);
    } else {
      setNewTicket({
        id: ticketsLastId + 1,
        type: chosenBranch,
      });
      setOpenInfoPopup(true);
      dispatch(
        addTicket({
          id: ticketsLastId + 1,
          type: chosenBranch,
          description: chosenDoctor,
          date: chosenDate,
          time: chosenTime,
        })
      );
      setChosenTime(null);
    }
  }

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
  }, []);

  // функция выбора доктора
  const handleChosenDoctor = (e) => {
    const { value } = e.target;
    setChosenDoctor(value);
  };

  useEffect(() => {
    setChosenBranch("A");
  }, []);

  useEffect(() => {
    let doctorsArr = Doctors.filter((arr) => arr.branch === chosenBranch);
    setDoctorsArr(doctorsArr);
    setChosenDoctor(doctorsArr[0].text);
  }, [chosenBranch]);

  return (
    <div className="terminal">
      <h2 className="popup__subtitle">Записаться к врачу</h2>
      <form className="popup__form" onSubmit={handleSubmitAddForm}>
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
              defaultValue={doctorsArr[0].value}
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
      {isOpenInfoPopup && (
        <InfoPopup
          isOpen={isOpenInfoPopup}
          onClose={() => setOpenInfoPopup(false)}
          isInfo={errInfo}
          isErr={true}
        />
      )}
      {newTicket && (
        <InfoPopup
          isOpen={isOpenInfoPopup}
          onClose={() => setOpenInfoPopup(false)}
          isInfo={newTicket}
        />
      )}
    </div>
  );
}
