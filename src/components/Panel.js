import logo from "./../images/logoScrubs.png";

export default function Panel({
  editTicketPopup,
  newTicketPopup,
  currentTime,
  currentDate,
}) {
  return (
    <div className="panel">
      <img src={logo} alt="sacred logo" className="panel__logo" />
      <button className="panel__button" onClick={() => newTicketPopup(true)}>
        Записаться к врачу
      </button>
      <button className="panel__button" onClick={() => editTicketPopup(true)}>
        Редактировать запись
      </button>
      <div className="panel__time-container">
        <p className="panel__time-text">Текущее время</p>
        <div className="panel__current-time">{currentTime}</div>
        <p className="panel__time-text">Сегодня</p>
        <div className="panel__current-date">{currentDate}</div>
      </div>
    </div>
  );
}
