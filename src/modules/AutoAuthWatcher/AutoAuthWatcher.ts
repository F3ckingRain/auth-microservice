import { useContext, useEffect } from "react";

import { useLocation } from "react-router-dom";

import endpoints from "@/api/endpoints";
import { instance } from "@/api/instance";
import ModalModel from "@/models/ModalModel/ModalModel";
import UserModel from "@/models/UserModel/UserModel";
import { ThemeContext } from "@/theme/ThemeProvider";

export const removeTokenFromUrl = (token: string) => {
  window.location.search.replace(token, "");
};

const autoAuthWatcher = () => {
  const { search } = useLocation();

  const { backUrl } = useContext(ThemeContext);

  const { setDisabledPhone, setDisabledCode, setShowChangePhone, setShowCode } =
    ModalModel();
  const { setPhone, setSmsCode, setUserType, setAutoAuthToken } = UserModel();

  useEffect(() => {
    if (!search.includes("token")) return;

    const tokenIndex = search.indexOf("token=");

    const token = search.substring(tokenIndex + 6, tokenIndex + 22);

    if (token.length !== 15) return;

    instance
      .get(`${backUrl}/${endpoints.getAutoLoginData}?autologin_token=${token}`)
      .then((res) => {
        setAutoAuthToken(token);
        setPhone(res.data.phone);
        setDisabledPhone(true);
        setShowChangePhone(false);

        if (res.data.code) {
          setSmsCode(`${res.data.code}`);
          setShowCode(true);
          setDisabledCode(true);
          setUserType("BASIC_SMS");
        } else {
          setUserType("MTS_ID");
        }
      });
  }, [search, backUrl]);
};

export default autoAuthWatcher;
