import { AxiosError } from "axios";

import { instance } from "@/api/instance";
import { SignRequest } from "@/api/types";

export const signUp = (backUrl: string, phone: string) => {
  instance.post(`${backUrl}/api/auth/sign-up`, { phone }).then(() => {});
};

export const signIn = (backUrl: string, phone: string) => {
  instance
    .post<SignRequest>(`${backUrl}/api/auth/sign-in`, { phone })
    .then(() => {})
    .catch((err: AxiosError) => {
      if (!err.status) return;

      if (err.status === 404) {
        signUp(backUrl, phone);
      }
    });
};
