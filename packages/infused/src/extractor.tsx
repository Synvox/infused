import { ReactNode } from "react";
import ReplaceStream from "replacestream";
import { Stream } from "stream";
import { CSSExtractionProvider } from "./context";
import { InfusedStyleSheet } from "./stylesheet";

export function getExtractor(
  replacedString: string = "🎨_INTERNAL_STYLES_DO_NOT_USE_🎨"
) {
  const sheets: Set<InfusedStyleSheet> = new Set();

  function Provider({ children }: { children: ReactNode }) {
    return (
      <CSSExtractionProvider
        children={children}
        sheets={sheets}
        replacedString={replacedString}
      />
    );
  }

  function addStyles(markup: string): string;
  function addStyles(markup: Stream): Stream;
  function addStyles(markup: string | Stream): string | Stream {
    const sortedSheets = Array.from(sheets).sort((a, b) => a.index - b.index);

    const styleTags = sortedSheets
      .map(({ id, css }) => `<style id="${id}">${css}</style>`)
      .join("");

    if (typeof markup === "string")
      return markup.replace(replacedString, styleTags);
    else return markup.pipe(ReplaceStream(replacedString, styleTags));
  }

  return { Provider, addStyles };
}
