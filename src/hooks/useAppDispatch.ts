import { useDispatch } from "react-redux";

import { AppDispatch } from "@/recoil/redux/recoil";

const useAppDispatch = () => useDispatch<AppDispatch>();

export default useAppDispatch;
