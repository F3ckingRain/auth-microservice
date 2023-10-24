import { Nullable } from "@/types/types";

export const getDateFromString = (value: string): Nullable<Date> => {
  const arr = value.split("-");

  if (arr.length !== 3) return null;

  const res = [arr[1], arr[0], arr[2]].join("/");

  return new Date(Date.parse(res));
};
