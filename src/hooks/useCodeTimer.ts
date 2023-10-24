import { useEffect } from "react";

import ModalModel from "@/models/ModalModel/ModalModel";

const useCodeTimer = (showCode: boolean, autoLogin?: boolean) => {
  const { modalState, setTimer } = ModalModel();

  const { timer } = modalState;

  useEffect(() => {
    if (autoLogin) return undefined;

    if (timer < 1) {
      return localStorage.removeItem("modal-timer");
    }

    const handler = setInterval(() => {
      if (showCode) {
        localStorage.setItem("modal-timer", `${timer - 1}`);

        setTimer(timer - 1);
      }
    }, 1000);

    return () => clearInterval(handler);
  }, [timer, showCode]);

  useEffect(() => () => localStorage.removeItem("modal-timer"), []);
};

export default useCodeTimer;
