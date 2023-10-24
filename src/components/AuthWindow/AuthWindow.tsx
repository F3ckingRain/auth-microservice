import React, {
  CSSProperties,
  FC,
  useCallback,
  useContext,
  useEffect,
} from "react";

import {
  CheckboxInput,
  CustomButton,
  DatePickerContainer,
  FormInput,
} from "@ca-actual-projects/sobankui";
import { AxiosError } from "axios";

import styles from "./AuthWindow.module.scss";

import endpoints from "@/api/endpoints";
import { instance } from "@/api/instance";
import { MAX_DATE, MIN_DATE } from "@/constants/constants";
import useCodeTimer from "@/hooks/useCodeTimer";
import ModalModel from "@/models/ModalModel/ModalModel";
import UserModel from "@/models/UserModel/UserModel";
import autoAuthWatcher, {
  removeTokenFromUrl,
} from "@/modules/AutoAuthWatcher/AutoAuthWatcher";
import { UserAuthType } from "@/recoil/atoms/userState";
import { ThemeContext } from "@/theme/ThemeProvider";
import { AuthWindowProps } from "@/types/types";
import { getDateFromString } from "@/utils/date";
import { validatePhone } from "@/utils/validation";

const AuthWindow: FC<AuthWindowProps> = ({ changeAuthType, afterAuth }) => {
  const { theme, backUrl, authType } = useContext(ThemeContext);

  const {
    userState,
    setUserType,
    setPhone,
    setBirthday,
    toggleAccept,
    setSmsCode,
    checkPhoneNumber,
    checkAccept,
    checkBirthDay,
  } = UserModel();
  const {
    modalState,
    setOpenedModal,
    setDisabledPhone,
    setShowChangePhone,
    setShowCode,
  } = ModalModel();

  const { type, birthDate, code, phone, accept, autoAuthToken } = userState;
  const {
    opened,
    showChangePhone,
    showCode,
    timer,
    disabledPhone,
    disabledCode,
  } = modalState;
  useCodeTimer(showCode, !!autoAuthToken);

  autoAuthWatcher();

  const waitingForSms = !!localStorage.getItem("waiting-sms");
  const labelStyle: CSSProperties =
    theme === "sobank" ? { display: "none" } : {};

  const changeNumber = useCallback(() => {
    localStorage.clear();
    setPhone("");
  }, []);

  const sendSms = useCallback(
    (userType: UserAuthType, phoneNumber: string, birthDay?: string) => {
      if (waitingForSms || autoAuthToken) return;

      if (userType === "MTS_ID") {
        if (!checkBirthDay(birthDay!)) return;

        instance
          .post(`${backUrl}/${endpoints.mobileIdSendSms}`, {
            phone_number: { phone: phoneNumber },
            send_sms_code_body: { phone: phoneNumber, birthday: birthDay },
          })
          .then(() => {
            localStorage.setItem("waiting-sms", `${true}`);
            setShowCode(true);
          })
          .catch((err: AxiosError) => {
            if (err.status === 404) {
              instance
                .post(`${backUrl}/${endpoints.mtsSignIn}`, {
                  phone: phoneNumber,
                })
                .then(() => {
                  setUserType("BASIC_SMS");
                  localStorage.setItem("waiting-sms", `${true}`);
                  setShowCode(true);
                })
                .catch((e: AxiosError) => {
                  if (e.status === 404) {
                    instance
                      .post(`${backUrl}/${endpoints.mtsSignUp}`, {
                        phone: phoneNumber,
                      })
                      .then(() => {
                        setUserType("BASIC_SMS");
                        localStorage.setItem("waiting-sms", `${true}`);
                        setShowCode(true);
                      });
                  }
                });
            }
          });
      } else
        instance
          .post(`${backUrl}/${endpoints.signIn}`, { phone: phoneNumber })
          .then(() => {
            localStorage.setItem("waiting-sms", `${true}`);
            setShowCode(true);
          })
          .catch((err: AxiosError) => {
            if (err.status === 404) {
              instance
                .post(`${backUrl}/${endpoints.signUp}`, {
                  phone: phoneNumber,
                })
                .then(() => {
                  localStorage.setItem("waiting-sms", `${true}`);
                  setShowCode(true);
                });
            }
          });
    },
    [backUrl, autoAuthToken, waitingForSms],
  );

  const confirmSms = useCallback(
    async (userType: UserAuthType, phoneNumber: string, smsCode: string) => {
      if (userType === "MTS_ID") {
        try {
          await instance.post(`${backUrl}/${endpoints.verifySms}`, {
            phone: phoneNumber,
            code: smsCode,
          });
          localStorage.removeItem("phoneNumber");
          localStorage.removeItem("modal-timer");
          localStorage.removeItem("dateBirthday");
          localStorage.removeItem("waiting-sms");

          if (afterAuth) afterAuth();
          return true;
        } catch {
          return false;
        }
      }
      try {
        await instance.post(`${backUrl}/${endpoints.confirm}`, {
          phone: phoneNumber,
          code: smsCode,
        });
        localStorage.removeItem("phoneNumber");
        localStorage.removeItem("modal-timer");
        localStorage.removeItem("dateBirthday");
        localStorage.removeItem("waiting-sms");

        if (afterAuth) afterAuth();
        return true;
      } catch {
        return false;
      }
    },
    [backUrl, afterAuth],
  );

  const confirmAutoLogin = useCallback(() => {
    if (accept) return;

    if (type === "MTS_ID") return;

    instance
      .post(`${backUrl}/${endpoints.confirmAutologin}`, {
        phone,
        code: Number(code),
        token: autoAuthToken,
      })
      .then(() => {
        setOpenedModal(false);
        removeTokenFromUrl(autoAuthToken!);

        if (afterAuth) afterAuth();
      });
  }, [backUrl, phone, code, autoAuthToken, type]);

  const smsChangeHandler = useCallback(
    (value: string) => {
      if (value.length !== 4) return setSmsCode(value);

      return confirmSms(type, phone, value);
    },
    [type, phone, accept],
  );

  const closeHandler = useCallback(() => {
    setOpenedModal(false);
  }, [setOpenedModal]);

  const phoneChangeHandler = useCallback(
    (value: string) => {
      if (autoAuthToken) return;

      const filled = checkPhoneNumber(value);

      if (filled) {
        document.getElementById("auth-phone")!.blur();
        document.getElementById("auth-birthdate")?.focus();
        sendSms(type, value, birthDate);
      }

      setPhone(value);
    },
    [birthDate, type, autoAuthToken],
  );

  const birthDayHandler = useCallback(
    (value: string) => {
      if (!checkPhoneNumber(phone)) return setBirthday(value);

      if (checkBirthDay(value)) sendSms(type, phone, value);

      return setBirthday(value);
    },
    [setBirthday, phone, type],
  );

  const phoneChecker = useCallback(
    (value: string) => {
      if (autoAuthToken) return true;

      const filled = checkPhoneNumber(value);
      setDisabledPhone(filled);

      if (filled) {
        sendSms(type, value, birthDate);
      }

      return checkPhoneNumber(value);
    },
    [setDisabledPhone, type, birthDate, autoAuthToken],
  );

  const onUnloadCallback = useCallback(() => {
    if (autoAuthToken) return;

    localStorage.setItem("phoneNumber", phone);
    localStorage.setItem("dateBirthday", birthDate);
  }, [phone, birthDate, autoAuthToken]);

  useEffect(() => {
    if (autoAuthToken) return undefined;

    if (disabledPhone) return setShowChangePhone(true);

    return setShowChangePhone(false);
  }, [disabledPhone, autoAuthToken]);

  useEffect(() => {
    if (authType === type) return;

    if (changeAuthType) {
      changeAuthType(type);
    }
  }, [authType, type, changeAuthType]);

  useEffect(() => {
    window.addEventListener("beforeunload", onUnloadCallback);

    return () => window.removeEventListener("beforeunload", onUnloadCallback);
  }, [onUnloadCallback]);

  return opened ? (
    <div
      className={`${styles.authWindow} ${styles[`authWindow__${theme}`]}`}
      onClick={(e) => e.stopPropagation()}
      aria-hidden
    >
      <button
        className={`${styles.closeBtn} ${styles[`closeBtn__${theme}`]}`}
        type="button"
        onClick={closeHandler}
      />

      <div className={`${styles.authBlock} ${styles[`authBlock__${theme}`]}`}>
        <div
          className={`${styles.authBlock__title} ${
            styles[`authBlock__${theme}__title`]
          }`}
        >
          Укажите ваш номер телефона для отправки заявки
        </div>

        <FormInput
          theme={theme}
          value={phone}
          onChange={phoneChangeHandler}
          disabled={disabledPhone}
          label="Введите номер телефона"
          labelStyle={labelStyle}
          mask="+7-(999)-999-99-99"
          formKey="auth-phone"
          id="auth-phone"
          checker={phoneChecker}
          validator={validatePhone}
          required
        />

        {showChangePhone && (
          <button
            className={`${styles.btn} ${styles[`btn__${theme}`]}`}
            onClick={changeNumber}
          >
            Изменить номер телефона
          </button>
        )}
      </div>

      {type === "MTS_ID" && (
        <div className={`${styles.authBlock} ${styles[`authBlock__${theme}`]}`}>
          <DatePickerContainer
            value={getDateFromString(birthDate)}
            id="auth-birthdate"
            theme={theme}
            label="Введите вашу дату рождения"
            minDate={MIN_DATE}
            maxDate={MAX_DATE}
            onDateSelect={birthDayHandler}
          />
        </div>
      )}

      {showCode && (
        <div className={`${styles.authBlock} ${styles[`authBlock__${theme}`]}`}>
          <div className={`${styles.sms} ${styles[`sms__${theme}`]}`}>
            {!autoAuthToken
              ? `Вам поступит СМС в формате «1234» - Ваш одноразовый код, не
            сообщайте его никому`
              : "Ваш код авторизации"}
          </div>

          <FormInput
            theme={theme}
            value={code}
            onChange={smsChangeHandler}
            label="Введите код подтверждения из СМС"
            inputClass={`${styles.codeInput} ${styles[`codeInput__${theme}`]}`}
            mask="9999"
            disabled={disabledCode}
            formKey="auth-code"
            errorMessage="Вы ввели неверной код!"
          />

          {timer > 0 && timer < 60 ? (
            <div className={`${styles.code} ${styles[`code__${theme}`]}`}>
              Не пришёл код? Запросите повторно через{" "}
              <span>{`0: ${timer}`}</span>
            </div>
          ) : (
            <div className={`${styles.code} ${styles[`code__${theme}`]}`}>
              <button className={`${styles.btn} ${styles[`btn__${theme}`]}`}>
                Отправить код повторно
              </button>
            </div>
          )}
        </div>
      )}

      <CheckboxInput
        theme={theme}
        text="Я даю согласие на обработку моих персональных данных, получение информационных и рекламных сообщений, а также согашаюсь с условиями оферты"
        errorText="Вы не можете авторизоваться без принятия условий"
        checked={accept}
        onChange={toggleAccept}
        disabled={waitingForSms}
        checker={checkAccept}
        required
        documents={[
          { title: "согласие", path: "politics" },
          { title: "оферты", path: "offer" },
        ]}
      />

      <CustomButton
        theme={theme}
        onClick={confirmAutoLogin}
        additionalClassName={`${styles.autologinBtn} ${
          styles[`autologinBtn__${theme}`]
        }`}
      >
        Войти
      </CustomButton>
    </div>
  ) : null;
};

export default AuthWindow;
