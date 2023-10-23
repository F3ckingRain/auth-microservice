type authType = "BASIC_SMS" | "MTS_ID";

type userState = {
  type: authType;
  phone: string;
  code: string;
  birthDate: string;
  autoAuth: boolean;
};
const initialStateUser: userState = {
  type: "BASIC_SMS",
  phone: "",
  code: "",
  birthDate: "",
  autoAuth: false,
};

export { authType, initialStateUser };
