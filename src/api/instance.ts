import axios from "axios";

export const instance = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    frm: window.location.search || null,
    fronturl: window.location.origin,
  },
});
