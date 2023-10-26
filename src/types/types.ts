import { FC } from "react";

import { UserAuthType } from "@/recoil/atoms/userState";

export type AuthWindowProps = {
  afterAuth?: () => void;
  changeAuthType?: (type: UserAuthType) => void;
  pdfOpen?: (doc: "politics" | "offer" | "processing") => void;
  Loader?: FC<{ text: string }>;
};

export type Nullable<T> = T | null;
