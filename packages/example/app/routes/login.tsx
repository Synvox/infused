import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  Request,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { Button } from "app/components/Button";
import { Flex } from "app/components/Flex";
import { Input } from "app/components/Input";
import { Stack } from "app/components/Stack";
import { getUser, newToken } from "app/session";
import sql from "app/sql.server";
import { UserAuth } from "app/types";
import bcrypt from "bcryptjs";
import { StyleSheet } from "infused";

const { styled } = StyleSheet("login");

export const loader: LoaderFunction = async ({ params, request }) => {
  try {
    await getUser(request as Request);
    return redirect("/");
  } catch (e) {}
  return json({});
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  const [userAuth] = await sql<UserAuth[]>`
    select user_auths.* from user_auths
    join users on users.id = user_auths.user_id
    where users.username = ${username}
    limit 1
  `;

  if (!userAuth) throw json({}, { status: 400 });

  if (await bcrypt.compare(password, userAuth.hash)) {
    return redirect("/", {
      headers: {
        ...(await newToken(userAuth.userId)),
      },
    });
  } else {
    return json({}, { status: 403 });
  }
};

export default function Login() {
  return (
    <Page>
      <Box>
        <Form method="post" reloadDocument>
          <Stack>
            <Input name="username" label="Username" />
            <Input name="password" type="password" label="Password" />
            <Flex alignItems="flex-end">
              <Button primary type="submit">
                Sign In
              </Button>
            </Flex>
          </Stack>
        </Form>
      </Box>
    </Page>
  );
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Box = styled.div`
  padding: 20px;
  border: 0.5px solid var(--border-color);
  background-color: var(--surface-1);
  width: 100%;
  max-width: 400px;
  &.thing {
    color: blue;
  }
  color: red;
`;
