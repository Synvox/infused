import { mdiClose } from "@mdi/js";
import { Form, FormProps } from "@remix-run/react";
import { createElement, forwardRef } from "react";
import { StyleSheet } from "infused";
import { iconOf } from "./Icons";

const { styled, css } = StyleSheet("button");

export const Button = styled.button<{ primary?: boolean; size?: "small" }>`
  white-space: nowrap;
  padding: 10px 16px;
  border: 0;
  color: white;
  border-radius: 1000px;
  font-size: 16px;
  background: #444;
  font-weight: bold;
  &.primary {
    background: var(--theme-color);
  }
  &.size-small {
    font-size: 12px;
    padding: 4px 8px;
  }
  &:active {
    opacity: 0.8;
  }
`
  .attrs({ type: "button" })
  .classes({
    primary: (p) => Boolean(p.primary),
    "size-small": (p) => p.size === "small",
  });

export const FormButton = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"] &
    Pick<
      FormProps,
      | "action"
      | "method"
      | "encType"
      | "reloadDocument"
      | "replace"
      | "onSubmit"
    >
>(function FormButton(
  {
    className,
    action,
    method,
    encType,
    reloadDocument,
    replace,
    onSubmit,
    ...others
  },
  ref
) {
  return (
    <Form
      {...{
        className,
        action,
        method,
        encType,
        reloadDocument,
        replace,
        onSubmit,
      }}
    >
      <button ref={ref} {...others} />
    </Form>
  );
});

const iconButton = css<{ red?: boolean }>`
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  width: 32px;
  aspect-ratio: 1;
  border-radius: 1000px;
  transition-duration: 250ms;
  padding: 0;
  margin: -4px;
  svg {
    width: 20px;
    height: 20px;
  }
  &:hover {
    background: #fff1;
  }
  &:active {
    background: #0008;
    transition-duration: 0ms;
  }
  &.red {
    svg {
      color: #f91880;
    }
  }
`;

export const CloseButton = styled(FormButton)`
  display: inline-block;
  button {
    ${iconButton}
  }
`.attrs({ children: createElement(iconOf(mdiClose)) });

export const IconButton = styled.button`
  ${iconButton}
`.classes({ red: (p) => Boolean(p.red) });
