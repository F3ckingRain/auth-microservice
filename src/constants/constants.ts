const now = new Date(Date.now());

const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const currentDay = now.getDate();

export const MAX_DATE = new Date(
  Date.UTC(currentYear - 21, currentMonth, currentDay - 1),
);

export const MIN_DATE = new Date(
  Date.UTC(currentYear - 100, currentMonth, currentDay - 1),
);
