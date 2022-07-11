import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Main } from "app/components/Main";
import { Nav } from "app/components/Nav";
import { Panel } from "app/components/Panel";
import { TweetView } from "app/components/TweetView";
import { getUser } from "app/session";
import sql from "app/sql.server";
import { TweetWithUser } from "app/types";
import { selectTweetWithExtras } from "app/util";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  const tweets = await sql<TweetWithUser[]>`
    select ${selectTweetWithExtras(user)}
    from tweets
    where (
      tweets.user_id = ${user.id}
      or exists (
        select 1
        from followers
        where tweets.user_id = followers.follows_user_id
        and followers.user_id = ${user.id}
      )
    )
    order by tweets.created_at desc
  `;

  return json({ tweets });
};

export default function Index() {
  const { tweets } = useLoaderData<{ tweets: TweetWithUser[] }>();

  return (
    <Main>
      <Nav></Nav>
      <Panel>
        {tweets.map((tweet) => (
          <TweetView key={tweet.id} tweet={tweet} link borderBelow />
        ))}
      </Panel>
    </Main>
  );
}
