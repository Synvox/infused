import isPropValid from "@emotion/is-prop-valid";
import {
  ComponentType,
  createElement,
  forwardRef,
  FunctionComponent,
  PropsWithoutRef,
  RefAttributes,
} from "react";
import { DefaultTheme } from ".";
import { CSSFragment } from "./css";
import { CSSKeyframes } from "./keyframes";
import { getUnnestProcessor } from "./processor";
import { InfusedStyleSheet, WithInfusedStyleSheet } from "./stylesheet";
import { template } from "./template";
import { useTheme } from "./theme";

type HTMLTagName = keyof JSX.IntrinsicElements;

export class StyledMeta extends WithInfusedStyleSheet {
  className: string;
  type: string;
  constructor(p: {
    className: typeof StyledMeta.prototype.className;
    type: typeof StyledMeta.prototype.type;
    stylesheet: typeof StyledMeta.prototype.stylesheet;
  }) {
    super(p.stylesheet);
    this.className = p.className;
    this.type = p.type;
  }
}

interface StyledBuilder<BaseProps> {
  <Props>(
    s: TemplateStringsArray,
    ...p: ValidInterpolation<BaseProps & Props>[]
  ): StyledComponent<BaseProps & Props>;
  classes: <Props>(
    classes: Record<string, (p: BaseProps & Props) => any>
  ) => StyledBuilder<Props>;
  attrs: <Props>(
    attributes: Record<string, any>
  ) => StyledBuilder<BaseProps & Props>;
}

export interface StyledComponent<Props>
  extends FunctionComponent<Props & { as?: string | ComponentType }> {
  __styled: StyledMeta;
  classes: (
    classes: Record<string, (p: Props) => any>
  ) => StyledComponent<Props>;
  attrs: (attributes: Record<string, any>) => StyledComponent<Props>;
}

export interface FunctionInterpolation<P> {}

export type ValidInterpolation<P> =
  | { __styled: StyledMeta }
  | CSSKeyframes
  | CSSFragment<P & ThemeProp>
  | (<Props extends P = P>(
      p: Props & ThemeProp
    ) => string | number | undefined | null | false)
  | string
  | number
  | undefined
  | null
  | false;

export type ThemeProp = {
  theme: DefaultTheme;
};

type StyledProxy = {
  [Tag in HTMLTagName]: StyledBuilder<JSX.IntrinsicElements[Tag]>;
};

export interface Styled extends StyledProxy {
  <P, T extends HTMLTagName>(tag: T): StyledBuilder<
    JSX.IntrinsicElements[T] & P
  >;
  <P, T = P extends RefAttributes<infer X> ? X : never>(
    tag: FunctionComponent<P>
  ): StyledBuilder<PropsWithoutRef<P> & RefAttributes<T>>;
  <P>(tag: ComponentType<P>): StyledBuilder<P>;
  <P>(tag: StyledComponent<P>): StyledBuilder<P>;
}

export function _styled(stylesheet: InfusedStyleSheet): Styled {
  function makeStyledComponent(givenType: any) {
    const metaData: StyledMeta =
      givenType.styled instanceof StyledMeta ? givenType.styled : undefined;
    const type = metaData ? metaData.type : givenType;

    function buildFunctionComponent(
      className: string,
      useStyle: () => void,
      parseProps: (p: any) => any,
      {
        classes = {},
        attrs = {},
      }: {
        classes?: Record<string, (p: any) => any>;
        attrs?: Record<string, any>;
      } = {}
    ) {
      return Object.assign(
        forwardRef(function Component(props: any, ref) {
          useStyle();
          const theme = useTheme();

          const classNames = [];
          for (let className of Object.keys(classes)) {
            if (classes[className]({ ...props, theme }))
              classNames.push(className);
          }

          classNames.unshift(className);
          if (metaData) classNames.unshift(metaData.className);
          if (props.className) classNames.unshift(props.className);

          const cleanedProps =
            typeof type === "string"
              ? Object.fromEntries(
                  Object.entries(props).filter(([attr]) => isPropValid(attr))
                )
              : props;

          return createElement(props.as ? props.as : type, {
            ...attrs,
            ...cleanedProps,
            style: {
              ...parseProps({ ...props, theme }),
              ...props.style,
            },
            className: classNames.join(" "),
            ref,
          });
        }),
        {
          classes(c: Record<string, (props: object) => boolean>) {
            return buildFunctionComponent(className, useStyle, parseProps, {
              attrs,
              classes: {
                ...classes,
                ...c,
              },
            });
          },
          attrs(a: Record<string, (props: object) => boolean>) {
            return buildFunctionComponent(className, useStyle, parseProps, {
              classes,
              attrs: {
                ...attrs,
                ...a,
              },
            });
          },
          __styled: new StyledMeta({
            className: metaData
              ? [metaData.className, className].join(" ")
              : className,
            type: givenType,
            stylesheet,
          }),
        }
      );
    }

    function makeTemplate({
      classes = {},
      attrs = {},
    }: {
      classes?: Record<string, (p: any) => any>;
      attrs?: Record<string, any>;
    } = {}) {
      return Object.assign(
        template(
          stylesheet,
          (className, useStyle, parseProps) => {
            return buildFunctionComponent(className, useStyle, parseProps, {
              classes,
              attrs,
            });
          },
          () => {
            const p = getUnnestProcessor();
            return {
              next: p.next,
              end() {
                return (id) => p.end()(`.${id}`);
              },
            };
          }
        ),
        {
          classes(c: Record<string, (props: object) => boolean>) {
            return makeTemplate({ attrs, classes: { ...classes, ...c } });
          },
          attrs(a: Record<string, (props: object) => boolean>) {
            return makeTemplate({ classes, attrs: { ...attrs, ...a } });
          },
        }
      );
    }

    return makeTemplate();
  }

  //@ts-expect-error
  return new Proxy(makeStyledComponent, {
    get(_, tagName, fn) {
      return fn(tagName);
    },
  });
}
