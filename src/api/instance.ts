import axios from "axios";

export const instance = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json, text/plain, */*",
    frm: window.location.search || null,
    fronturl: window.location.origin,
  },
  baseURL: "https://develop.onbank.online",
});
