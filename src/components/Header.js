import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "./../images/logoScrubs.png";

export default function Header() {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );

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
      <div className="header__links">
        <Link className="header__link" to="/">
          Общее табло
        </Link>
        <Link className="header__link" to="/admin">
          Админ
        </Link>
        <Link className="header__link" to="/terminal">
          Записаться
        </Link>
      </div>
      <div className="header__time-container">
        <div className="header__current-time">{currentTime}</div>
        <div className="header__current-date">{currentDate}</div>
      </div>
    </header>
  );
}
