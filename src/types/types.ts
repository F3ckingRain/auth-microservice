import { UserAuthType } from "@/recoil/atoms/userState";

export type AuthWindowProps = {
  afterAuth?: () => void;
  changeAuthType?: (type: UserAuthType) => void;
};

export type Nullable<T> = T | null;
