import { ThemeProp, ValidInterpolation } from "./styled";
import { InfusedStyleSheet } from "./stylesheet";
import { parseTemplateString } from "./template";

export class CSSFragment<P> {
  string: string;
  dependsOn: Set<InfusedStyleSheet>;
  fns: ((props: P & ThemeProp) => string | CSSFragment<P>)[];
  constructor(p: {
    string: typeof CSSFragment.prototype.string;
    dependsOn: typeof CSSFragment.prototype.dependsOn;
    fns: typeof CSSFragment.prototype.fns;
  }) {
    this.string = p.string;
    this.dependsOn = p.dependsOn;
    this.fns = p.fns;
  }
}

export function _css(stylesheet: InfusedStyleSheet) {
  return function css<P>(
    strings: TemplateStringsArray,
    ...args: ValidInterpolation<P>[]
  ): CSSFragment<P> {
    const { string, dependsOn, fns } = parseTemplateString(
      stylesheet,
      strings,
      ...args
    );

    return new CSSFragment({ string, dependsOn, fns });
  };
}
