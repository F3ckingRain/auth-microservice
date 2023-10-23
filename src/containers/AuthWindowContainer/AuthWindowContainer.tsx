import React, { FC } from "react";

import AuthWindow from "@/components/AuthWindow/AuthWindow";
import ThemeProvider, { ContextType } from "@/theme/ThemeProvider";
import { AuthWindowProps } from "@/types/types";

type AuthWindowContainerProps = ContextType & AuthWindowProps;
const AuthWindowContainer: FC<AuthWindowContainerProps> = ({
  theme,
  backUrl,
  authType,
  ...props
}) => (
  <ThemeProvider theme={theme} backUrl={backUrl} authType={authType}>
    <AuthWindow {...props} />
  </ThemeProvider>
);

export default AuthWindowContainer;
