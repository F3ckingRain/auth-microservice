import React, {
  CSSProperties,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  CheckboxInput,
  CustomButton,
  DatePickerContainer,
  FormInput,
  Loader,
} from "@ca-actual-projects/sobankui";
import { AxiosError, AxiosResponse } from "axios";
import { useCookies } from "react-cookie";

import styles from "./AuthWindow.module.scss";

import endpoints from "@/api/endpoints";
import {
  createAuthInfoRequest,
  getTextForTimer,
} from "@/components/AuthWindow/helpers";
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
import { resetMask, validatePhone } from "@/utils/validation";

type LoaderType = {
  showed: boolean;
  text: string;
};

const AuthWindow: FC<AuthWindowProps> = ({
  changeAuthType,
  afterAuth,
  pdfOpen,
}) => {
  const [, setCookies] = useCookies();

  const [loaderState, setLoaderState] = useState<LoaderType>({
    text: "",
    showed: false,
  });

  const { theme, instance, authType } = useContext(ThemeContext);

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
    checkSmsCode,
  } = UserModel();
  const {
    modalState,
    setOpenedModal,
    setDisabledPhone,
    setShowChangePhone,
    setShowCode,
    resetTimer,
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

  const waitingForSms = !!localStorage.getItem("waiting-sms");
  const showChangeCode = !autoAuthToken && waitingForSms;
  const labelStyle: CSSProperties =
    theme === "sobank" ? { display: "none" } : {};

  useCodeTimer(showCode, !!autoAuthToken);

  autoAuthWatcher();

  const changeNumber = useCallback(() => {
    instance.get(`${endpoints.checkForChangeNumber}`).then(() => {
      setDisabledPhone(false);

      localStorage.removeItem("phoneNumber");
      localStorage.removeItem("waiting-sms");
      setPhone("");
      setShowChangePhone(false);
      setSmsCode("");
      setShowCode(false);
    });
  }, [instance]);

  const sendSms = useCallback(
    (userType: UserAuthType, phoneNumber: string, birthDay?: string) => {
      if (!!localStorage.getItem("waiting-sms") || autoAuthToken) return;

      if (userType === "MTS_ID") {
        if (!checkBirthDay(birthDay!)) return;

        instance
          .post(`${endpoints.mobileIdSendSms}`, {
            phone_number: { phone: phoneNumber },
            send_sms_code_body: { phone: phoneNumber, birthday: birthDay },
          })
          .then(() => {
            localStorage.setItem("waiting-sms", `${true}`);
            setShowCode(true);
          })
          .catch((err: AxiosError) => {
            if (err.response?.status === 404) {
              instance
                .post(`${endpoints.mtsSignIn}`, {
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
                      .post(`${endpoints.mtsSignUp}`, {
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
          .post(`${endpoints.signIn}`, { phone: phoneNumber })
          .then(() => {
            localStorage.setItem("waiting-sms", `${true}`);
            setShowCode(true);
          })
          .catch((err: AxiosError) => {
            if (!err.response?.status) {
              localStorage.setItem("waiting-sms", `${true}`);
              setShowCode(true);
            }

            if (err.response?.status === 404) {
              instance
                .post(`${endpoints.signUp}`, {
                  phone: phoneNumber,
                })
                .then(() => {
                  localStorage.setItem("waiting-sms", `${true}`);
                  setShowCode(true);
                })
                .catch((e: AxiosError) => {
                  if (!e.response?.status) {
                    localStorage.setItem("waiting-sms", `${true}`);
                    setShowCode(true);
                  }
                });
            }
          });
    },
    [instance, autoAuthToken, waitingForSms],
  );

  const afterConfirmCallback = useCallback(
    (res: AxiosResponse, smsCode: string) => {
      localStorage.removeItem("phoneNumber");
      localStorage.removeItem("modal-timer");
      localStorage.removeItem("dateBirthday");
      localStorage.removeItem("waiting-sms");

      setCookies("Bearer", res.data.token);

      instance.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${res.data.token}`;

        return config;
      });

      setOpenedModal(false);

      setLoaderState((s) => ({ ...s, showed: false }));

      setLoaderState({
        text: "Получаем информацию по вашей анкете",
        showed: true,
      });

      instance
        .post(
          `${endpoints.authInfo}`,
          createAuthInfoRequest({ phone, code: smsCode, type }),
        )
        .then(() => {
          if (afterAuth) afterAuth();
        })
        .finally(() => setLoaderState((s) => ({ ...s, showed: false })));
    },
    [instance, afterAuth, phone, type],
  );

  const confirmSms = useCallback(
    (userType: UserAuthType, phoneNumber: string, smsCode: string) => {
      setLoaderState({ text: "Идёт проверка смс-кода", showed: true });

      if (userType === "MTS_ID") {
        instance
          .post(`${endpoints.verifySms}`, {
            phone: phoneNumber,
            code: smsCode,
          })
          .then((res) => afterConfirmCallback(res, smsCode))
          .finally(() => setLoaderState((s) => ({ ...s, showed: false })));
      } else
        instance
          .post(`${endpoints.confirm}`, {
            phone: phoneNumber,
            code: smsCode,
          })
          .then((res) => afterConfirmCallback(res, smsCode))
          .finally(() => setLoaderState((s) => ({ ...s, showed: false })));
    },
    [afterAuth, phone, type],
  );

  const getNewCode = useCallback(() => {
    localStorage.removeItem("waiting-sms");
    setShowCode(false);
    resetTimer();

    if (type === "MTS_ID")
      instance
        .post(`${endpoints.mobileIdSendSms}`, {
          phone_number: { phone },
          send_sms_code_body: { phone, birthday: birthDate },
        })
        .then(() => {
          localStorage.setItem("waiting-sms", `${true}`);
          setShowCode(true);
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 400) {
            instance.post(`${endpoints.sendSmsToUser}`, { phone }).then(() => {
              localStorage.setItem("waiting-sms", `${true}`);
              setShowCode(true);
            });
          }
        });
    else {
      instance.post(`${endpoints.sendSmsToUser}`, { phone }).then(() => {
        localStorage.setItem("waiting-sms", `${true}`);
        setShowCode(true);
      });
    }
  }, [instance, type, phone, birthDate]);

  const confirmAutoLogin = useCallback(() => {
    if (!accept) return;

    if (type === "MTS_ID") return;

    instance
      .post(`${endpoints.confirmAutologin}`, {
        phone,
        code: Number(code),
        token: autoAuthToken,
      })
      .then((res) => {
        afterConfirmCallback(res, code);

        removeTokenFromUrl(autoAuthToken!);
      });
  }, [instance, phone, code, autoAuthToken, type]);

  const smsChangeHandler = useCallback(
    (value: string) => {
      setSmsCode(resetMask(value));

      if (resetMask(value).length !== 4 || !accept || !waitingForSms)
        return undefined;

      return confirmSms(type, phone, resetMask(value));
    },
    [type, phone, accept, waitingForSms],
  );

  const closeHandler = useCallback(() => {
    setOpenedModal(false);
  }, []);

  const phoneChangeHandler = useCallback(
    (value: string) => {
      if (autoAuthToken) return undefined;

      setPhone(value);

      const filled = checkPhoneNumber(value);

      if (!filled) return undefined;

      if (birthDate && !checkBirthDay(birthDate)) {
        return document.getElementById("auth-birthdate")?.focus();
      }

      return document.getElementById("auth-phone")!.blur();
    },
    [autoAuthToken, birthDate],
  );

  const birthDayHandler = useCallback(
    (value: string) => {
      const fieldBirthDay = document.getElementById("auth-birthdate")!;

      setBirthday(value);

      if (!checkBirthDay(value)) return undefined;

      if (!checkPhoneNumber(phone)) {
        return fieldBirthDay.blur();
      }

      return sendSms(type, phone, value);
    },
    [phone, type],
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
    [type, birthDate, autoAuthToken],
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

  useEffect(() => {
    setUserType(authType);
  }, []);

  return opened ? (
    <>
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
          <div
            className={`${styles.authBlock} ${styles[`authBlock__${theme}`]}`}
          >
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
          <div
            className={`${styles.authBlock} ${styles[`authBlock__${theme}`]}`}
          >
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
              inputClass={`${styles.codeInput} ${
                styles[`codeInput__${theme}`]
              }`}
              mask="9999"
              autoComplete="one-time-code"
              disabled={disabledCode}
              formKey="auth-code"
              checker={checkSmsCode}
              errorMessage="Вы ввели неверной код!"
            />

            {showChangeCode &&
              (timer > 0 && timer < 60 ? (
                <div className={`${styles.code} ${styles[`code__${theme}`]}`}>
                  Не пришёл код? Запросите повторно через{" "}
                  <span>{getTextForTimer(timer)}</span>
                </div>
              ) : (
                <div className={`${styles.code} ${styles[`code__${theme}`]}`}>
                  <button
                    className={`${styles.btn} ${styles[`btn__${theme}`]}`}
                    onClick={getNewCode}
                    type="button"
                  >
                    Отправить код повторно
                  </button>
                </div>
              ))}
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
          openPdf={pdfOpen}
        />

        {!!autoAuthToken && (
          <CustomButton
            theme={theme}
            onClick={confirmAutoLogin}
            additionalClassName={`${styles.autologinBtn} ${
              styles[`autologinBtn__${theme}`]
            }`}
          >
            Войти
          </CustomButton>
        )}
      </div>

      {loaderState.showed && <Loader theme={theme} text={loaderState.text} />}
    </>
  ) : null;
};

export default AuthWindow;
