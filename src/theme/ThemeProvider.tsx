import React, { createContext, FC, useMemo } from "react";

import { ThemeType } from "@/theme/types";

export interface ContextType {
  theme: ThemeType;
  authType: "BASIC_SMS" | "MTS_ID";
  backUrl: string;
}

interface ThemeProviderProps extends ContextType {
  children: React.ReactNode;
}

export const ThemeContext = createContext<ContextType>({
  theme: "sobank",
  authType: "BASIC_SMS",
  backUrl: "https://develop.onbank.online",
});

const ThemeProvider: FC<ThemeProviderProps> = ({
  children,
  theme,
  authType,
  backUrl,
}) => {
  const value = useMemo(
    () => ({ theme, backUrl, authType }),
    [theme, backUrl, authType],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
