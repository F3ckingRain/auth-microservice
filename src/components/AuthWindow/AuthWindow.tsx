import React, { FC } from "react";

import { RequestBody, RequestHeaders } from "@/api/types";
import Counter from "@/components/Counter";
import { signIn } from "@/features/AuthFeatures";
import { AuthWindowProps } from "@/types/types";

const AuthWindow: FC<AuthWindowProps> = ({ frontUrl, serverUrl }) => {
  const phone = "";

  const headers: RequestHeaders = {
    frm: frontUrl.search || "null",
    fronturl: frontUrl.origin,
  };

  const bodySignIn: RequestBody<{ phone: string }> = {
    method: "POST",
    url: `${serverUrl}/api/auth/sign-in`,
    body: {
      phone,
    },
  };

  const request = {
    headers,
    body: bodySignIn,
  };

  const clickHandler = () => {};

  return (
    <div>
      <div>authWindow</div>
      <button onClick={clickHandler}>sendSms</button>

      <Counter />
    </div>
  );
};

export default AuthWindow;
