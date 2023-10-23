import { atom, useRecoilState } from "recoil";

import { initialStateModel } from "@/recoil/atoms/modalState/index";

export const modalState = atom({
  key: "modal",
  default: initialStateModel,
});

const useModal = () => useRecoilState(modalState);

export default useModal;
