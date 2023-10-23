import { authType } from "@/recoil/atoms/userState";

export type AuthWindowProps = {
  changeAuthType?: (type: authType) => void;
};
