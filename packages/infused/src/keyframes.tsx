import { InfusedStyleSheet, WithInfusedStyleSheet } from "./stylesheet";
import { template } from "./template";

export class CSSKeyframes extends WithInfusedStyleSheet {
  id: string;
  constructor(p: {
    id: typeof CSSKeyframes.prototype.id;
    stylesheet: typeof CSSKeyframes.prototype.stylesheet;
  }) {
    super(p.stylesheet);
    this.id = p.id;
  }
}

export const _keyframes = (stylesheet: InfusedStyleSheet) =>
  template(
    stylesheet,
    (id) => new CSSKeyframes({ id, stylesheet }),
    () => ({
      end: (str) => (id: string) => `@keyframes ${id}{${str}}`,
    })
  );
