import { AuthApi } from "@/api/AuthApi";
import { SignRequest } from "@/api/types";
import { AppDispatch } from "@/recoil/redux/recoil";

export const signIn = (request: SignRequest) => (dispatch: AppDispatch) => {
  dispatch(AuthApi.endpoints?.signIn.initiate(request))
    .unwrap()
    .then();
};
