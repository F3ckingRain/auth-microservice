import React, { FC } from "react";

import AuthWindow from "@/components/AuthWindow/AuthWindow";
import ThemeProvider, { ContextType } from "@/theme/ThemeProvider";
import { AuthWindowProps } from "@/types/types";

type AuthWindowContainerProps = ContextType & AuthWindowProps;
const AuthWindowContainer: FC<AuthWindowContainerProps> = ({
  theme,
  instance,
  authType,
  ...props
}) => (
  <ThemeProvider theme={theme} instance={instance} authType={authType}>
    <AuthWindow {...props} />
  </ThemeProvider>
);

export default AuthWindowContainer;
