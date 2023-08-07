import { TypedUseSelectorHook, useSelector } from "react-redux";

import { RootState } from "@/recoil/redux/recoil";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default useAppSelector;
