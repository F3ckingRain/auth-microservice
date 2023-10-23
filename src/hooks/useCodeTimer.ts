import { useEffect, useState } from "react";

import ModalModel from "@/models/ModalModel/ModalModel";

const useCodeTimer = (showCode: boolean) => {
  const { modalState, setTimer } = ModalModel();

  const stateTimer = modalState.timer;
  const lsTimer =
    !!localStorage.getItem("modal-timer") &&
    Number(localStorage.getItem("modal-timer"));

  const [timer, setTimerState] = useState<number>(lsTimer || stateTimer);

  useEffect(() => {
    if (timer < 1) {
      return localStorage.removeItem("modal-timer");
    }

    const handler = setInterval(() => {
      if (showCode) {
        setTimerState((s) => {
          setTimer(s - 1);
          localStorage.setItem("modal-timer", `${s - 1}`);

          return s - 1;
        });
      }
    }, 1000);

    return () => clearInterval(handler);
  }, [timer, showCode, setTimerState]);

  useEffect(() => () => localStorage.removeItem("modal-timer"), []);
};

export default useCodeTimer;
