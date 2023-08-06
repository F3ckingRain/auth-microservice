import { AuthApi } from "@/api/AuthApi";
import { SignRequest } from "@/api/types";
import { AppDispatch } from "@/store/redux/store";

export const signIn = (request: SignRequest) => (dispatch: AppDispatch) => {
  dispatch(AuthApi.endpoints?.signIn.initiate(request))
    .unwrap()
    .then();
};
