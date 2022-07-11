import {
  createCookie,
  DataFunctionArgs,
  HeadersInit,
  redirect,
} from "@remix-run/node";
import sql from "app/sql.server";
import { User, UserToken } from "app/types";

type Request = DataFunctionArgs["request"];

const tokenCookie = createCookie("token", {
  secrets: ["secret"],
  httpOnly: true,
  secure: true,
});

export async function newToken(userId: number): Promise<HeadersInit> {
  const [c]: UserToken[] = await sql`
    insert into user_tokens ${sql({ userId })}
    returning *
  `;

  return {
    "Set-Cookie": await tokenCookie.serialize(c.id),
  };
}

export async function getToken(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const tokenId: string | null =
    (await tokenCookie.parse(cookieHeader)) || null;

  if (!tokenId) return null;

  const [userToken] = await sql<UserToken[]>`
    select * from user_tokens where id = ${tokenId}
  `;

  return userToken;
}

export async function getUser(request: Request) {
  const userToken = await getToken(request);

  if (!userToken) throw redirect("/login");

  const [user] = await sql<User[]>`
    select * from users where id = ${userToken.userId}
  `;

  if (!user) throw redirect("/login");

  return user;
}
