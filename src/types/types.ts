import { UserAuthType } from "@/recoil/atoms/userState";

export type AuthWindowProps = {
  afterAuth?: () => void;
  changeAuthType?: (type: UserAuthType) => void;
  pdfOpen?: (doc: "politics" | "offer" | "processing") => void;
  notify: (text: string) => void;
};

export type Nullable<T> = T | null;
