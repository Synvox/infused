import { ReactNode } from "react";
import { StyleSheet } from "infused";
import { Flex } from "./Flex";

const { styled } = StyleSheet();

export function Panel({ children }: { children?: ReactNode }) {
  return (
    <Flex alignItems="center" grow>
      <Container>{children}</Container>
    </Flex>
  );
}

const Container = styled.div`
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  width: clamp(600px, 100%, 320px);
  flex: 1;
  padding-top: 20vh;
`;
