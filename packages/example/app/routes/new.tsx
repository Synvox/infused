import { ActionFunction, redirect } from "@remix-run/node";
import { getUser } from "app/session";
import sql from "app/sql.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const user = await getUser(request);

  const parentTweetId = formData.has("parentTweetId")
    ? String(formData.get("parentTweetId"))
    : null;

  const [tweet] = await sql`
    insert into tweets ${sql({
      body: String(formData.get("body")),
      userId: user.id,
      parentTweetId,
    })}
    returning *
  `;

  return redirect(`/tweets/${tweet.id}#tweet-${tweet.id}`);
};
