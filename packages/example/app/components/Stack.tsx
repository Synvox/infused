import { Children, Fragment, ReactNode } from "react";
import { StyleSheet } from "infused";

const { styled } = StyleSheet();

const sizes = {
  none: 0,
  xsmall: 5,
  small: 10,
  medium: 20,
  large: 40,
  xlarge: 80,
};

type Size = keyof typeof sizes;

export function Stack({
  children,
  space = "medium",
}: {
  children: ReactNode;
  space?: Size;
}) {
  return (
    <>
      {Children.map(children, (child: ReactNode, index) => {
        if (index === 0) return child;
        return (
          <Fragment key={index}>
            <Spacer space={space} />
            {child}
          </Fragment>
        );
      })}
    </>
  );
}

const Spacer = styled.div<{ space: Size }>`
  width: ${(p) => sizes[p.space] + "px"};
  height: ${(p) => sizes[p.space] + "px"};
`;
