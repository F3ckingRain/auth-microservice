import React, { useCallback, useEffect } from "react";

import AuthWindow from "./components/AuthWindow/AuthWindow";

import ModalModel from "@/models/ModalModel/ModalModel";
import ThemeProvider from "@/theme/ThemeProvider";

const App = () => {
  const { modalState, setOpenedModal } = ModalModel();

  const openHandler = useCallback(() => {
    setOpenedModal(!modalState.opened);
  }, [setOpenedModal]);

  useEffect(() => localStorage.clear(), []);

  return (
    <ThemeProvider
      theme="creditPro"
      backUrl="https://develop.onbank.online"
      authType="MTS_ID"
    >
      <AuthWindow />

      <button onClick={openHandler}>open modal</button>
    </ThemeProvider>
  );
};

export default App;
