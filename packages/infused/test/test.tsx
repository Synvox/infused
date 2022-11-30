import { it } from "@jest/globals";
import { StyleSheet } from "../src";

it("compiles simple tags", () => {
  const { styled, toString } = StyleSheet();

  styled.div`
    background-color: blue;
  `;

  expect(toString()).toMatchSnapshot();
});

it("compiles interpolations", () => {
  const { styled, toString } = StyleSheet();

  styled.div`
    background-color: ${"blue"};
  `;

  expect(toString()).toMatchSnapshot();
});

it("compiles function interpolations", () => {
  const { styled, toString } = StyleSheet();

  styled.div`
    background-color: ${() => "blue"};
  `;

  expect(toString()).toMatchSnapshot();
});

it("compiles css interpolations", () => {
  const { styled, toString, css } = StyleSheet();

  const shared = css`
    margin: auto;
  `;

  styled.div`
    ${shared}
    background-color: ${() => "blue"};
  `;

  expect(toString()).toMatchSnapshot();
});

it("compiles keyframes interpolations", () => {
  const { styled, toString, keyframes } = StyleSheet();

  const anim = keyframes`
    0% {
      color:black;
    }
    100% {
      color:white;
    }
  `;

  styled.div`
    animation: 1s ${anim};
  `;

  expect(toString()).toMatchSnapshot();
});

it("compiles nested rules", () => {
  const { styled, toString } = StyleSheet();

  styled.div`
    color: black;
    &:hover {
      color: white;
      a {
        text-decoration: dashed;
        @media (max-width: 500px) {
          display: block;
        }
      }
    }
  `;

  expect(toString()).toMatchSnapshot();
});

it("compiles global styles", () => {
  const { createGlobalStyle, toString } = StyleSheet();

  createGlobalStyle`body {margin: 0;}`;

  expect(toString()).toMatchSnapshot();
});
