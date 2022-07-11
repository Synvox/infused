import { createContext, ReactNode, useContext } from "react";
import { InfusedStyleSheet } from "./stylesheet";

const REPLACED_STRING = "🎨_INTERNAL_STYLES_DO_NOT_USE_🎨";

const context = createContext<{
  register(sheet: InfusedStyleSheet): void;
  sheets: Set<InfusedStyleSheet>;
  replacedString: string;
}>({ register: () => {}, sheets: new Set(), replacedString: REPLACED_STRING });

export function useRegisterInfusedStyleSheet(stylesheet: InfusedStyleSheet) {
  useContext(context).register(stylesheet);
}

export function CSSExtractionProvider({
  sheets,
  children,
  replacedString = REPLACED_STRING,
}: {
  sheets: Set<InfusedStyleSheet>;
  children: ReactNode;
  replacedString?: string;
}) {
  function register(sheet: InfusedStyleSheet) {
    sheets.add(sheet);
  }

  return (
    <context.Provider value={{ register, sheets, replacedString }}>
      {children}
    </context.Provider>
  );
}

export function Styles() {
  if (typeof document !== "undefined") return null;
  return <>{useContext(context).replacedString}</>;
}
