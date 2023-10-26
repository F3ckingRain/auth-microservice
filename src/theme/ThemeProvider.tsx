import React, { createContext, FC, useMemo } from "react";

import { AxiosInstance } from "axios";

import { instance as defaultInstance } from "@/api/instance";
import { ThemeType } from "@/theme/types";

export interface ContextType {
  theme: ThemeType;
  authType: "BASIC_SMS" | "MTS_ID";
  instance: AxiosInstance;
}

interface ThemeProviderProps extends ContextType {
  children: React.ReactNode;
}

export const ThemeContext = createContext<ContextType>({
  theme: "sobank",
  authType: "BASIC_SMS",
  instance: defaultInstance,
});

const ThemeProvider: FC<ThemeProviderProps> = ({
  children,
  theme,
  authType,
  instance,
}) => {
  const value = useMemo(
    () => ({ theme, instance, authType }),
    [theme, instance, authType],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
