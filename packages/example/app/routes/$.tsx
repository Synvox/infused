import { json, LoaderFunction, Request } from "@remix-run/node";
import { Main } from "app/components/Main";
import { Nav } from "app/components/Nav";
import { getUser } from "app/session";

export const loader: LoaderFunction = async ({ request }) => {
  await getUser(request as Request);
  return json({});
};

export default function Index() {
  return (
    <Main>
      <Nav></Nav>
    </Main>
  );
}
