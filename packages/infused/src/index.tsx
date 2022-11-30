import {
  GlobalStyle,
  _createGlobalStyle as createGlobalStyle,
} from "./createGlobalStyle";
import { CSSFragment, _css as css } from "./css";
import { CSSKeyframes, _keyframes as keyframes } from "./keyframes";
import { StyledComponent, _styled as styled } from "./styled";
import { InfusedStyleSheet } from "./stylesheet";
export { CSSExtractionProvider, Styles } from "./context";
export { getExtractor } from "./extractor";
export { ThemeProvider, useTheme } from "./theme";
export { InfusedStyleSheet };
export type { GlobalStyle, CSSFragment, CSSKeyframes, StyledComponent };

export function StyleSheet(prefix?: string) {
  const s = new InfusedStyleSheet(prefix);

  return {
    styled: styled(s),
    createGlobalStyle: createGlobalStyle(s),
    keyframes: keyframes(s),
    css: css(s),
    toString() {
      s.compile();
      return s.css;
    },
  };
}

export interface DefaultTheme {}
