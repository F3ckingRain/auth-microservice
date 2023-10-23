type modelStateType = {
  opened: boolean;
  showCode: boolean;
  showChangePhone: boolean;
  timer: number;
};

const initTimer = localStorage.getItem("modal-timer")
  ? Number(localStorage.getItem("modal-timer"))
  : 60;

const initialStateModel: modelStateType = {
  opened: false,
  showCode: false,
  showChangePhone: true,
  timer: initTimer,
};

export { modelStateType, initialStateModel };
