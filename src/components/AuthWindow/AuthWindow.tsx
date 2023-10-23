import React, { FC, useCallback, useContext, useEffect } from "react";

import {
  CheckboxInput,
  DatePickerContainer,
  FormInput,
} from "@ca-actual-projects/sobankui";

import styles from "./AuthWindow.module.scss";

import { MAX_DATE, MIN_DATE } from "@/constants/constants";
import { signIn } from "@/features/AuthFeatures";
import useCodeTimer from "@/hooks/useCodeTimer";
import ModalModel from "@/models/ModalModel/ModalModel";
import UserModel from "@/models/UserModel/UserModel";
import autoAuthWatcher from "@/modules/AutoAuthWatcher/AutoAuthWatcher";
import { ThemeContext } from "@/theme/ThemeProvider";
import { AuthWindowProps } from "@/types/types";
import { validatePhone } from "@/utils/validation";

const AuthWindow: FC<AuthWindowProps> = ({ changeAuthType }) => {
  const { theme, backUrl, authType } = useContext(ThemeContext);

  const { userState, setUserType } = UserModel();
  const { modalState, setOpenedModal } = ModalModel();

  const { type, birthDate, code, phone } = userState;
  const { opened, showChangePhone, showCode } = modalState;

  const closeHandler = useCallback(() => {
    setOpenedModal(false);
  }, [setOpenedModal]);

  useEffect(() => {
    if (type === authType) return;

    setUserType(authType);
  }, [authType, type]);

  useEffect(() => {
    if (!changeAuthType) return;

    changeAuthType(type);
  }, [type]);

  useCodeTimer(showCode);

  autoAuthWatcher();

  return opened ? (
    <div className={`${styles.authWindow} ${styles[`authWindow__${theme}`]}`}>
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
          onChange={(value) => console.log(value)}
          label="Введите номер телефона"
          mask="+7-(999)-999-99-99"
          formKey="auth-phone"
          validator={validatePhone}
        />

        {showChangePhone && (
          <button className={`${styles.btn} ${styles[`btn__${theme}`]}`}>
            Изменить номер телефона
          </button>
        )}
      </div>

      {authType === "MTS_ID" && (
        <div className={`${styles.authBlock} ${styles[`authBlock__${theme}`]}`}>
          <DatePickerContainer
            id="auth-birthdate"
            theme={theme}
            label="Введите вашу дату рождения"
            minDate={MIN_DATE}
            maxDate={MAX_DATE}
            onDateSelect={(val) => console.log(val)}
          />
        </div>
      )}

      {showCode && (
        <div className={`${styles.authBlock} ${styles[`authBlock__${theme}`]}`}>
          <div
            className={`${styles.authBlock__title} ${
              styles[`authBlock__${theme}__title`]
            }`}
          >
            Вам поступит СМС в формате «1234» - Ваш одноразовый код, не
            сообщайте его никому
          </div>

          <FormInput
            theme={theme}
            value={code}
            onChange={() => undefined}
            label="Введите код подтверждения из СМС"
            inputStyle={{
              textAlign: "center",
              letterSpacing: 8,
              padding: "10px 50px",
            }}
            mask="9999"
            formKey="auth-code"
            errorMessage="Вы ввели неверной код!"
          />
        </div>
      )}

      <CheckboxInput
        theme={theme}
        text="Я даю согласие на обработку моих персональных данных, получение информационных и рекламных сообщений, а также согашаюсь с условиями оферты"
        errorText="Вы не можете авторизоваться без принятия условий"
        checked
        documents={[
          { title: "согласие", path: "politics" },
          { title: "оферты", path: "offer" },
        ]}
      />
    </div>
  ) : null;
};

export default AuthWindow;
