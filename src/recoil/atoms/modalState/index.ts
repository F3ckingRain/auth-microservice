type modelStateType = {
  opened: boolean;
  showCode: boolean;
  showChangePhone: boolean;
  disabledPhone: boolean;
  disabledCode: boolean;
  timer: number;
};

const initTimer = localStorage.getItem("modal-timer")
  ? Number(localStorage.getItem("modal-timer"))
  : 60;

const initCode = localStorage.getItem("waiting-sms")
  ? !!localStorage.getItem("waiting-sms")
  : false;

const initialStateModel: modelStateType = {
  opened: false,
  showCode: initCode,
  disabledPhone: false,
  showChangePhone: false,
  disabledCode: false,
  timer: initTimer,
};

export { modelStateType, initialStateModel };
