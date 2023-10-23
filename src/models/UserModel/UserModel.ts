import { authType } from "@/recoil/atoms/userState";
import useUser from "@/recoil/atoms/userState/userState";

const UserModel = () => {
  const [state, setState] = useUser();

  const setUserType = (type: authType) => {
    setState((s) => ({ ...s, type }));
  };

  const setPhone = (phone: string) => {
    setState((s) => ({ ...s, phone }));
  };

  const setAutoAuth = (autoAuth: boolean) => {
    setState((s) => ({ ...s, autoAuth }));
  };

  return { userState: state, setUserType, setPhone, setAutoAuth };
};

export default UserModel;
