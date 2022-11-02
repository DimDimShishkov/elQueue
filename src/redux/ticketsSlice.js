import { createSlice } from "@reduxjs/toolkit";
import { generateTimetable } from "./../utils/helpers";

let initialTickets = JSON.parse(localStorage.getItem("tickets"));

function setTicketsToLS(items) {
  localStorage.setItem("tickets", JSON.stringify(items));
}

if (!initialTickets || initialTickets.length === 0) {
  let ticketsArr = []; // для сгенерированных талонов
  for (let i = 0; i < 10; i++) {
    ticketsArr.push(generateTimetable(i));
  }
  ticketsArr.sort(
    (firstTicket, secondTicket) => firstTicket.time.split(":").slice(0, 2).join("") - secondTicket.time.split(":").slice(0, 2).join("")
  );
  setTicketsToLS(ticketsArr);
  initialTickets = ticketsArr;
}

function lastId(arr) {
  let arrCopy = [...arr];
  arrCopy.sort(function (firstElement, secondElement) {
    return firstElement.id - secondElement.id;
  });
  return arrCopy[arrCopy.length - 1]?.id;
}

const initialState = {
  tickets: initialTickets,
  ticketsLastId: lastId(initialTickets),
};

export const ticketsSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    // добавить талон
    addTicket: (state, action) => {
      state.tickets.push(action.payload);
      state.tickets.sort(function (firstTicket, secondTicket) {
        return firstTicket.time.split(":").slice(0, 2).join("") - secondTicket.time.split(":").slice(0, 2).join("");
      });
      state.ticketsLastId = lastId(state.tickets);
      setTicketsToLS(state.tickets);
    },
    // удалить талон
    removeTicket: (state, action) => {
      const newTickets = state.tickets.filter((el) => el.id !== action.payload.id);
      state.tickets = newTickets;
      state.ticketsLastId = lastId(state.tickets);
      setTicketsToLS(state.tickets);
    },
    // отредактировать талон
    editTicket: (state, action) => {
      const newTickets = state.tickets.map((el) => (el.id === action.payload.id ? action.payload : { ...el }));
      state.tickets = newTickets;
      state.tickets.sort(function (firstTicket, secondTicket) {
        return firstTicket.time.split(":").slice(0, 2).join("") - secondTicket.time.split(":").slice(0, 2).join("");
      });
      state.ticketsLastId = lastId(state.tickets);
      setTicketsToLS(state.tickets);
    },
    // загрузить талоны с сервера
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
  },
});

export const { addTicket, removeTicket, editTicket, setTickets } = ticketsSlice.actions;

export default ticketsSlice.reducer;
