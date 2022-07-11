import { ReactNode } from "react";
import { StyleSheet, ThemeProvider } from "infused";

const { createGlobalStyle } = StyleSheet("provider");

export function Provider({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeProvider theme={{ color: "red" }}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </>
  );
}

const GlobalStyle = createGlobalStyle`
 *, ::before, ::after {box-sizing: border-box;}html {line-height: 1.15;-webkit-text-size-adjust: 100%;-moz-tab-size: 4;tab-size: 4;}body {margin: 0;font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';}hr {height: 0;color: inherit;}abbr[title] {text-decoration: underline dotted;}b, strong {font-weight: bolder;}code, kbd, samp, pre {font-family: ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;font-size: 1em;}small {font-size: 80%;}sub, sup {font-size: 75%;line-height: 0;position: relative;vertical-align: baseline;}sub {bottom: -0.25em;}sup {top: -0.5em;}table {text-indent: 0;border-color: inherit;}button, input, optgroup, select, textarea {font-family: inherit;font-size: 100%;line-height: 1.15;margin: 0;}button, select {text-transform: none;}button, [type='button'], [type='reset'], [type='submit'] {-webkit-appearance: button;}::-moz-focus-inner {border-style: none;padding: 0;}:-moz-focusring {outline: 1px dotted ButtonText;}:-moz-ui-invalid {box-shadow: none;}legend {padding: 0;}progress {vertical-align: baseline;}::-webkit-inner-spin-button, ::-webkit-outer-spin-button {height: auto;}[type='search'] {-webkit-appearance: textfield;outline-offset: -2px;}::-webkit-search-decoration {-webkit-appearance: none;}::-webkit-file-upload-button {-webkit-appearance: button;font: inherit;}summary {display: list-item;}

  :root {
    --surface-1: #0d1116;
    --surface-2: #080B10;
    --surface-3: #02040a;
    --border-color: #21262d;
    --text-color: #ffffffcc;
    --theme-color: #1d9bf0;
  }
  
  [id] {
    scroll-margin-top: 20vh;
  }

 body, html {
  height: 100%;
  background-color: var(--surface-3);
 }
 @media screen {
    html {
      height: 100%;
    }
  }
`;
