type UserAuthType = "BASIC_SMS" | "MTS_ID";

type userState = {
  type: UserAuthType;
  phone: string;
  code: string;
  accept: boolean;
  birthDate: string;
  autoAuthToken?: string;
};

const initPhone = localStorage.getItem("phoneNumber") || "";
const initBirthDate = localStorage.getItem("dateBirthday") || "";

const initialStateUser: userState = {
  type: "BASIC_SMS",
  phone: initPhone,
  code: "",
  accept: true,
  birthDate: initBirthDate,
  autoAuthToken: undefined,
};

export { UserAuthType, initialStateUser };
