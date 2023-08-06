import { TypedUseSelectorHook, useSelector } from "react-redux";

import { RootState } from "@/store/redux/store";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default useAppSelector;
