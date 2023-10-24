import { useCallback } from "react";

import useModal from "@/recoil/atoms/modalState/modalState";

const ModalModel = () => {
  const [state, setState] = useModal();

  const setOpenedModal = useCallback((opened: boolean) => {
    setState((s) => ({ ...s, opened }));
  }, []);

  const setTimer = useCallback((timer: number) => {
    setState((s) => ({ ...s, timer }));
  }, []);

  const setShowChangePhone = useCallback((showChangePhone: boolean) => {
    setState((s) => ({ ...s, showChangePhone }));
  }, []);

  const setShowCode = useCallback((showCode: boolean) => {
    setState((s) => ({ ...s, showCode }));
  }, []);

  const setDisabledPhone = useCallback((disabledPhone: boolean) => {
    setState((s) => ({ ...s, disabledPhone }));
  }, []);

  const setDisabledCode = useCallback((disabledCode: boolean) => {
    setState((s) => ({ ...s, disabledCode }));
  }, []);

  return {
    modalState: state,
    setOpenedModal,
    setTimer,
    setShowChangePhone,
    setDisabledPhone,
    setShowCode,
    setDisabledCode,
  };
};

export default ModalModel;
