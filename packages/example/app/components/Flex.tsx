import { StyleSheet } from "infused";

const { styled } = StyleSheet("flex");

type FlexJustification =
  | "center"
  | "flex-start"
  | "flex-end"
  | "space-around"
  | "space-evenly"
  | "space-between"
  | "stretch";

type Direction = "row" | "column" | "row-reverse" | "column-reverse";

export const Flex = styled.div<{
  direction?: Direction;
  alignItems?: FlexJustification;
  justifyContent?: FlexJustification;
  grow?: boolean;
}>`
  display: flex;
  flex-direction: ${(p) => p.direction ?? "column"};
  align-items: ${(p) => p.alignItems ?? "flex-start"};
  justify-content: ${(p) => p.justifyContent ?? "flex-start"};
  &.grow {
    flex: 1;
  }
`.classes({ grow: (p) => p.grow });
