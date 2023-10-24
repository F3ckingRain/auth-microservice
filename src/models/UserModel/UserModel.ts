import { useCallback } from "react";

import { UserAuthType } from "@/recoil/atoms/userState";
import useUser from "@/recoil/atoms/userState/userState";
import { resetMask } from "@/utils/validation";

const UserModel = () => {
  const [state, setState] = useUser();

  const setUserType = useCallback((type: UserAuthType) => {
    setState((s) => ({ ...s, type }));
  }, []);

  const setPhone = useCallback((phone: string) => {
    setState((s) => ({ ...s, phone }));
  }, []);

  const setBirthday = useCallback((birthDate: string) => {
    setState((s) => ({ ...s, birthDate }));
  }, []);

  const setAutoAuthToken = useCallback((autoAuthToken: string) => {
    setState((s) => ({ ...s, autoAuthToken }));
  }, []);

  const toggleAccept = useCallback((value?: boolean) => {
    setState((s) => ({ ...s, accept: (value && value) || !s.accept }));
  }, []);

  const setSmsCode = useCallback((code: string) => {
    setState((s) => ({ ...s, code }));
  }, []);

  const checkPhoneNumber = (value: string) => resetMask(value).length >= 11;

  const checkBirthDay = (value: string) => resetMask(value).length === 8;

  const checkAccept = (value: boolean) => {
    if (checkPhoneNumber(state.phone) && checkBirthDay(state.birthDate)) {
      return value;
    }

    return true;
  };

  return {
    userState: state,
    setUserType,
    setPhone,
    toggleAccept,
    setAutoAuthToken,
    setBirthday,
    setSmsCode,

    checkPhoneNumber,
    checkBirthDay,
    checkAccept,
  };
};

export default UserModel;
