import { useState, useEffect } from "react";

export default function Ticket({ card, deleteTicket }) {
  const [leftTime, setLeftTime] = useState();
  const currentDate = new Date();

  useEffect(() => {
    const cardDate = new Date(`${card.date}T${card.time}`);
    const diffTime = (cardDate - currentDate) / 1000;
    let hours = Math.floor(diffTime / 60 / 60);
    let minutes = Math.floor(diffTime / 60) - hours * 60;
    let seconds = Math.floor(diffTime % 60);
    const resultTime = [hours, minutes, seconds];
    const resultTimeString = resultTime
      .map((x) => (x <= 9 ? "0" + x : x))
      .join(":");
    setLeftTime(resultTimeString);
    if (diffTime <= 0) {
      deleteTicket(card);
      setLeftTime("00:00:00");
    }
  }, [card, currentDate, deleteTicket]);

  return (
    <div className="ticket">
      <div className="ticket__info">{card.type + card.id}</div>
      <div className="ticket__time">{leftTime} </div>
    </div>
  );
}
