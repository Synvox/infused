# Infused Stylesheets

A CSS-in-JS library similar to `styled-components` & others with the following benefits:

1. `infused` does not require changes to the compiler like `linaria` or a babel plugin like `styled-components`.
2. `infused` classnames are deterministic and doesn't have [this issue](https://github.com/styled-components/styled-components/issues/3660) from `styled-components`.
3. `infused` does not rewrite stylesheets based on component props like `styled-components`.
4. Most notably, `infused` works in `remix`.

Which comes with the following trade-offs:

1. `infused` styles are embedded in the JavaScript.
2. `infused` has a small runtime.
3. `infused` does not support static extraction
4. `infused` uses inline `<style>` tags and may require a `style-src: unsafe-eval` content-security directive.

I'd love to solve these in the future with a build step that output static css files.

## Install

```
npm i infused
```

## Usage & Examples

`infused`'s api is inspired by `styled-components`:

```tsx
import { StyleSheet, ThemeProvider, useTheme } from "infused";
const { styled, css, keyframes, createGlobalStyle } = StyleSheet();
```

Create a styled component using `styled`:

```tsx
import { StyleSheet } from "infused";
import { Link as RRLink } from "@remix-run/react";
const { styled } = StyleSheet();

const H1 = styled.h1`
  font-size: 2rem;
`;

const Link = styled(Link)`
  text-decoration: none;
`;
```

Create reusable styles using `css`:

```tsx
import { StyleSheet } from "infused";
import { Link as RRLink } from "@remix-run/react";
const { styled, css } = StyleSheet();

const linkStyles = css`
  text-decoration: none;
`;

const Link = styled(Link)`
  ${linkStyles};
`;

const Anchor = styled.a`
  ${linkStyles};
`;
```

Create animation keyframes with `keyframes`:

```tsx
import { StyleSheet } from "infused";
const { styled, keyframes } = StyleSheet();

const spinnerKeyframes = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  animation: 0.5s ${spinnerKeyframes} linear infinite;
  width: 1em;
  height: 1em;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-left-color: currentColor;
  border-radius: 2em;
`;
```

Create global styles with `createGlobalStyle`:

```tsx
import { StyleSheet } from "infused";
const { createGlobalStyle } = StyleSheet();

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;
```

Create global styles with `createGlobalStyle`:

```tsx
import { StyleSheet } from "infused";
const { createGlobalStyle } = StyleSheet();

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;
```

## Interpolation

For the most part, interpolation works as expected:

```tsx
import { StyleSheet } from "infused";
const { styled } = StyleSheet();

const Link = styled.a<{ big?: boolean }>`
  font-size: ${(p) => (p.big ? "3em" : "1em")};
`;
```

Under the hood, `infused` uses css variables to make this work, but css variables fall over if you assign something that cannot be stored in a css variable, like what the `css` tag does:

```tsx
import { StyleSheet } from "infused";
const { styled } = StyleSheet();

// this will not work
const Link = styled.a<{ big?: boolean }>`
  ${(p) =>
    p.big
      ? css`
          font-size: 3em;
        `
      : css`
          font-size: 1em;
        `}
`;
```

Luckily for us, CSS has classes:

```tsx
import { StyleSheet } from "infused";
const { styled } = StyleSheet();

// Do this instead
const Link = styled.a<{ big?: boolean }>`
  font-size: 1em;
  &.big {
    font-size: 3em;
  }
`.classes({ big: (p) => p.big });
```

## Themes

Using `<ThemeProvider>` works the same as in `styled-components`

```tsx
import { StyleSheet, ThemeProvider, useTheme } from "infused";
const { styled } = StyleSheet();

interface Theme {
  color: string;
}

declare module "infused" {
  export interface DefaultTheme extends Theme {}
}

export function Provider({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={{ color: "#0000ff" }}>{children}</ThemeProvider>;
}

export function useThemeColor() {
  const theme = useTheme();
  return theme.color;
}

export const H1 = styled.div`
  color: ${(p) => p.theme.color};
`;
```
