import { atom, useRecoilState } from "recoil";

export const countState = atom({
  key: "countState",
  default: {
    count: 0,
  },
});

const useCount = () => useRecoilState(countState);

export default useCount;
