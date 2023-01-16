export default function GenerateTimetable(ticketsLastId) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const dateForGenerator = `${currentYear}-${
    currentMonth <= 9 ? "0" + currentMonth : currentMonth
  }-${currentDay <= 9 ? "0" + currentDay : currentDay}`;
  const typeArr = ["A", "B", "C", "D"];
  const typeForGenerator = typeArr[Math.floor(Math.random() * typeArr.length)];
  const timeArr = [
    "08",
    "09",
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
  ];
  const hourForGenerator = timeArr[Math.floor(Math.random() * timeArr.length)];
  const timeForGenerator = `${hourForGenerator}:00:00`;
  const ticketFromGenerator = {
    id: ticketsLastId + 1,
    type: typeForGenerator,
    description: "sampleText",
    date: dateForGenerator,
    time: timeForGenerator,
  };
  return ticketFromGenerator;
}
