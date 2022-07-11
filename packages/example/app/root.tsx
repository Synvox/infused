import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Styles } from "infused";
import { Provider } from "./components/Provider";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <link
          rel="shortcut icon"
          href="data:image/x-icon;,"
          type="image/x-icon"
        />
        <Meta />
        <Links />
        <Styles />
      </head>
      <body>
        <Provider>
          <Outlet />
        </Provider>

        {/* <ScrollRestoration />
        <Scripts />
        <LiveReload /> */}
      </body>
    </html>
  );
}
