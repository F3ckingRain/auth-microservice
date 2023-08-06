import React, { FC } from "react";

import { RequestBody, RequestHeaders } from "@/api/types";
import { signIn } from "@/features/AuthFeatures";
import useAppDispatch from "@/hooks/useAppDispatch";
import { AuthWindowProps } from "@/types/types";

const AuthWindow: FC<AuthWindowProps> = ({ frontUrl, serverUrl }) => {
  const dispatch = useAppDispatch();

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

  const clickHandler = () => {
    dispatch(signIn(request));
  };

  return (
    <div>
      <div>authWindow</div>
      <button onClick={clickHandler}>sendSms</button>
    </div>
  );
};

export default AuthWindow;
