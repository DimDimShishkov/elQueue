import Doctors from "./Doctors";

export default function GenerateTimetable(ticketsLastId) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentHour = currentDate.getHours();
  const dateForGenerator = `${currentYear}-${currentMonth}-${
    currentDay <= 9 ? "0" + currentDay : currentDay
  }`;
  const typeArr = ["A", "B", "C", "D"];
  const typeForGenerator = typeArr[Math.floor(Math.random() * typeArr.length)];
  const timeArr = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].filter(
    (el) => el >= currentHour
  );
  const hourForGenerator = timeArr[Math.floor(Math.random() * timeArr.length)];
  const timeForGenerator = `${hourForGenerator}:00:00`;
  const descriptionForGenerator = Doctors.filter(
    (el) => el.branch === typeForGenerator
  )[0].text;
  const ticketFromGenerator = {
    id: ticketsLastId + 1,
    type: typeForGenerator,
    description: descriptionForGenerator,
    date: dateForGenerator,
    time: timeForGenerator,
  };
  return ticketFromGenerator;
}
