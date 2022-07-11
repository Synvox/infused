import { FunctionComponent } from "react";
import { getUnnestProcessor } from "./processor";
import { ValidInterpolation } from "./styled";
import { InfusedStyleSheet } from "./stylesheet";
import { template } from "./template";
import { useTheme } from "./theme";

export interface GlobalStyle {
  <Props>(
    s: TemplateStringsArray,
    ...p: ValidInterpolation<Props>[]
  ): FunctionComponent<Props>;
}

export function _createGlobalStyle(stylesheet: InfusedStyleSheet): GlobalStyle {
  return template(
    stylesheet,
    (_id, useStyle, parseProps) => {
      return function (props: any) {
        useStyle();
        const theme = useTheme();
        const parsed = Object.entries(parseProps({ ...props, theme }))
          .map(([k, v]) => `${k}:${v}`)
          .join(";");

        if (!parsed) return null;
        return (
          <style dangerouslySetInnerHTML={{ __html: `:root{${parsed}}` }} />
        );
      };
    },
    () => {
      const p = getUnnestProcessor();
      return {
        next: p.next,
        end() {
          return () => p.end()("");
        },
      };
    }
  );
}
