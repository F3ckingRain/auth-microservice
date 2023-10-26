type modelStateType = {
  opened: boolean;
  showCode: boolean;
  showChangePhone: boolean;
  disabledPhone: boolean;
  disabledCode: boolean;
  timer: number;
};

const DEFAULT_CODE_TIMER = 60; // in seconds

const initTimer = localStorage.getItem("modal-timer")
  ? Number(localStorage.getItem("modal-timer"))
  : DEFAULT_CODE_TIMER;

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

export { modelStateType, initialStateModel, DEFAULT_CODE_TIMER };
