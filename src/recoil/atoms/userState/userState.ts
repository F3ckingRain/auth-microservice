import { atom, useRecoilState } from "recoil";

import { initialStateUser } from "@/recoil/atoms/userState/index";

export const userState = atom({
  key: "userState",
  default: initialStateUser,
});

const useUser = () => useRecoilState(userState);

export default useUser;
