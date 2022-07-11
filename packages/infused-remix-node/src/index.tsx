import { EntryContext, Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToPipeableStream, renderToString } from "react-dom/server";
import { PassThrough } from "node:stream";
import { CSSExtractionProvider, InfusedStyleSheet } from "infused";
//@ts-expect-error
import replace from "stream-replace";

export function renderWithStyles(
  callback?: (
    markup: string,
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext
  ) => Response
) {
  return function (
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext
  ) {
    const REPLACED_STRING = "🎨_INTERNAL_STYLES_DO_NOT_USE_🎨";

    const sheets: Set<InfusedStyleSheet> = new Set();
    const str = renderToString(
      <CSSExtractionProvider sheets={sheets} replacedString={REPLACED_STRING}>
        <RemixServer context={remixContext} url={request.url} />
      </CSSExtractionProvider>
    );

    const styleTags = Array.from(sheets)
      .sort((a, b) => a.index - b.index)
      .map(({ id, css }) => `<style id="${id}">${css}</style>`)
      .join("");

    const markup = str.replace(REPLACED_STRING, styleTags);

    if (callback) {
      return callback(
        markup,
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      );
    } else {
      responseHeaders.set("Content-Type", "text/html");
      return new Response("<!DOCTYPE html>" + markup, {
        status: responseStatusCode,
        headers: responseHeaders,
      });
    }
  };
}

export function streamRenderWithStyles(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const REPLACED_STRING = "🎨_INTERNAL_STYLES_DO_NOT_USE_🎨";
  const ABORT_DELAY = 5000;

  const sheets: Set<InfusedStyleSheet> = new Set();

  const callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <CSSExtractionProvider sheets={sheets}>
        <RemixServer context={remixContext} url={request.url} />
      </CSSExtractionProvider>,
      {
        [callbackName]() {
          let body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          const styleTags = Array.from(sheets)
            .sort((a, b) => a.index - b.index)
            .map(({ id, css }) => `<style id="${id}">${css}</style>`)
            .join("");

          resolve(
            new Response(body, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            })
          );
          pipe(replace(REPLACED_STRING, styleTags)).pipe(body);
        },
        onShellError(err) {
          reject(err);
        },
        onError(error) {
          didError = true;
          console.error(error);
        },
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
