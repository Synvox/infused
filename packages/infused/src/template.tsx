import { CSSFragment } from "./css";
import { CSSKeyframes } from "./keyframes";
import { getHashProcessor, process, Processor } from "./processor";
import { StyledMeta } from "./styled";
import { InfusedStyleSheet, WithInfusedStyleSheet } from "./stylesheet";

export const FUNCTION_TAG = `__FN__`;

export function parseTemplateString(
  stylesheet: InfusedStyleSheet,
  strings: TemplateStringsArray,
  ...args: any[]
) {
  const argsClone = [...args];
  const dependsOn: Set<InfusedStyleSheet> = new Set();

  const fns: ((p: any) => any)[] = [];

  const string = (
    strings[0] +
    strings
      .slice(1)
      .map((x) => {
        let interpolated = argsClone.shift();

        if (
          interpolated === undefined ||
          interpolated === null ||
          interpolated === false
        )
          return "var(--noop)" + x;

        if (interpolated.__styled instanceof WithInfusedStyleSheet)
          interpolated = interpolated.__styled;

        if (
          interpolated instanceof WithInfusedStyleSheet &&
          interpolated.stylesheet !== stylesheet
        )
          dependsOn.add(interpolated.stylesheet);

        if (interpolated instanceof CSSKeyframes) {
          interpolated = interpolated.id;
        } else if (interpolated instanceof StyledMeta) {
          interpolated = `.${interpolated.className}`;
        } else if (interpolated instanceof CSSFragment) {
          for (let stylesheet of interpolated.dependsOn)
            dependsOn.add(stylesheet);
          for (let fn of interpolated.fns) fns.push(fn);
          interpolated = interpolated.string;
        } else if (typeof interpolated === "function") {
          fns.push(interpolated);
          interpolated = FUNCTION_TAG;
        } else {
          interpolated = String(interpolated);
        }

        return interpolated + x;
      })
      .join("")
  ).replace(/\s+/g, " ");

  return {
    string,
    dependsOn,
    fns,
  };
}

export type TemplateCallback<Props, T> = (
  id: string,
  useStyle: () => void,
  parseProps: (p: Props) => any
) => T;

export function template<Props, T>(
  stylesheet: InfusedStyleSheet,
  callback: TemplateCallback<Props, T>,
  getProcessor: () => Processor<(id: string) => string>
) {
  return function (strings: TemplateStringsArray, ...args: any[]) {
    const { string, dependsOn, fns } = parseTemplateString(
      stylesheet,
      strings,
      ...args
    );

    let { id, cssStr } = process(string, () => {
      const hashProcessor = getHashProcessor();
      const processor = getProcessor();
      return {
        next(str, ch) {
          hashProcessor.next(str, ch);
          if (processor.next) processor.next(str, ch);
        },
        end(str) {
          let id = hashProcessor.end();
          id = `${stylesheet.prefix}${id}`;
          const cssStr = processor.end(str)(id);
          return { id, cssStr };
        },
      };
    });

    let index = 0;
    cssStr = cssStr.replace(
      new RegExp(FUNCTION_TAG, "g"),
      () => `var(--${id}-${index++})`
    );

    stylesheet.append(id, cssStr, dependsOn);

    function parseProps(props: any): Record<string, string> {
      return Object.fromEntries(
        fns.map((fn, index) => {
          let value = fn(props);
          if (value === undefined || value === null || value === false)
            value = "var(--noop)";
          return [`--${id}-${index}`, value];
        })
      );
    }

    return callback(id, stylesheet.useStyle.bind(stylesheet), parseProps);
  };
}
