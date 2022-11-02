import { useEffect, useState } from "react";
import logo from "./../images/logoScrubs.png";

export default function Header({ headerButtons, changePanel }) {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );

  let buttons;
  if (headerButtons === "admin") {
    buttons = (
      <div className="header__buttons">
        <button
          type="button"
          className="header__button"
          onClick={() => changePanel("scoreboard")}
        >
          Общее табло
        </button>
        <button
          type="button"
          className="header__button"
          onClick={() => changePanel("terminal")}
        >
          Записаться
        </button>
      </div>
    );
  } else if (headerButtons === "scoreboard") {
    buttons = (
      <div className="header__buttons">
        <button
          type="button"
          className="header__button"
          onClick={() => changePanel("admin")}
        >
          Админ
        </button>
        <button
          type="button"
          className="header__button"
          onClick={() => changePanel("terminal")}
        >
          Записаться
        </button>
      </div>
    );
  } else {
    buttons = (
      <div className="header__buttons">
        <button
          type="button"
          className="header__button"
          onClick={() => changePanel("admin")}
        >
          Админ
        </button>
        <button
          type="button"
          className="header__button"
          onClick={() => changePanel("scoreboard")}
        >
          Общее табло
        </button>
      </div>
    );
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
      setCurrentDate(new Date().toLocaleDateString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      <img src={logo} alt="sacred logo" className="header__logo" />
      <h1 className="header__title">Sacred Heart Hospital</h1>
      {buttons}
      <div className="header__time-container">
        <div className="header__current-time">{currentTime}</div>
        <div className="header__current-date">{currentDate}</div>
      </div>
    </header>
  );
}
