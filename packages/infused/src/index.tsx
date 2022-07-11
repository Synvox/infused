import {
  _createGlobalStyle as createGlobalStyle,
  GlobalStyle,
} from "./createGlobalStyle";
import { _css as css, CSSFragment } from "./css";
import { _keyframes as keyframes, CSSKeyframes } from "./keyframes";
import { _styled as styled, StyledComponent } from "./styled";
import { InfusedStyleSheet } from "./stylesheet";
export { CSSExtractionProvider, Styles } from "./context";
export { ThemeProvider, useTheme } from "./theme";
export { InfusedStyleSheet };

export function StyleSheet(prefix?: string) {
  const s = new InfusedStyleSheet(prefix);

  return {
    styled: styled(s),
    createGlobalStyle: createGlobalStyle(s),
    keyframes: keyframes(s),
    css: css(s),
  };
}

export interface DefaultTheme {}

export type { GlobalStyle, CSSFragment, CSSKeyframes, StyledComponent };
