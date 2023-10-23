import useModal from "@/recoil/atoms/modalState/modalState";

const ModalModel = () => {
  const [state, setState] = useModal();

  const setOpenedModal = (opened: boolean) => {
    setState((s) => ({ ...s, opened }));
  };

  const setTimer = (timer: number) => {
    setState((s) => ({ ...s, timer }));
  };

  return { modalState: state, setOpenedModal, setTimer };
};

export default ModalModel;
