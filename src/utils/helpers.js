import MockDoctors from "./MockDoctors";
import Timetable from "./Timetable.json";

export function generateTimetable(ticketsLastId) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentHour = currentDate.getHours();
  const dateForGenerator = `${currentYear}-${currentMonth}-${currentDay <= 9 ? "0" + currentDay : currentDay}`;
  const typeArr = ["A", "B", "C", "D"];
  const typeForGenerator = typeArr[Math.floor(Math.random() * typeArr.length)];
  const timeArr = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].filter((el) => el >= currentHour);
  const hourForGenerator = timeArr[Math.floor(Math.random() * timeArr.length)];
  const timeForGenerator = `${hourForGenerator}:00:00`;
  const descriptionForGenerator = MockDoctors.filter((el) => el.branch === typeForGenerator)[0].text;
  const ticketFromGenerator = {
    id: ticketsLastId + 1,
    type: typeForGenerator,
    description: descriptionForGenerator,
    date: dateForGenerator,
    time: timeForGenerator,
  };
  return ticketFromGenerator;
}

export function sortingTimetable(tickets, chosenTicket = false) {
  const currentTime = new Date().toLocaleTimeString();
  let index;
  if (chosenTicket) {
    index = Timetable.findIndex((item) => item.time.split(":")[0] >= chosenTicket.time.split(":")[0]);
  } else {
    index = Timetable.findIndex((item) => item.time.split(":")[0] > currentTime.split(":")[0]);
  }
  const newTimetableForm = [...Timetable];
  const item = Timetable[index];
  newTimetableForm[index] = { ...item, checked: true };
  if (tickets.length) {
    newTimetableForm.forEach((x) => {
      x.disabled = tickets?.some((elem) => elem.time === x.time || x.time.split(":")[0] <= currentTime.split(":")[0]);
    });
  } else {
    newTimetableForm.forEach((x) => {
      x.disabled = x.time.split(":")[0] <= currentTime.split(":")[0];
    });
  }

  return newTimetableForm;
}
