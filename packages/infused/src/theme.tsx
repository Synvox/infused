import { createContext, ReactNode, useContext } from "react";
import { DefaultTheme } from ".";

const context = createContext<DefaultTheme>({});

export function ThemeProvider({
  theme,
  children,
}: {
  theme: DefaultTheme;
  children: ReactNode;
}) {
  return <context.Provider value={theme}>{children}</context.Provider>;
}

export function useTheme() {
  return useContext(context);
}
