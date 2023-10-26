const endpoints = {
  // Basic
  signIn: "api/auth/sign-in",
  signUp: "api/auth/sign-up",
  confirm: "api/auth/confirm",
  sendSmsToUser: "api/send_sms_to_user",
  checkForChangeNumber: "api/check_for_change_number",

  // MTS_ID
  mobileIdSendSms: "api/auth/mobile_id/send-sms",
  mtsSignIn: "api/auth/sign_in_mts",
  mtsSignUp: "api/auth/sign_up_mts",
  verifySms: "api/auth/mobile_id/verify-sms",

  // Autologin
  getAutoLoginData: "api/auth/get_autologin_data",
  confirmAutologin: "api/auth/confirm_autologin",

  // Form
  authInfo: "api/form/create/auth_info",
};

export default endpoints;
