import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Composer } from "app/components/Composer";
import { Main } from "app/components/Main";
import { Nav } from "app/components/Nav";
import { Panel } from "app/components/Panel";
import { TweetView } from "app/components/TweetView";
import { getUser } from "app/session";
import sql from "app/sql.server";
import { TweetWithExtras } from "app/types";
import { getFormData, selectTweetWithExtras } from "app/util";
import { StyleSheet } from "infused";

const { styled } = StyleSheet();

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await getUser(request);

  const [tweet] = await sql<TweetWithExtras[]>`
    select
      ${selectTweetWithExtras(user)}
    from tweets
    where tweets.id = ${params.id!}
  `;

  const parentTweets =
    tweet.parentTweetId === null
      ? []
      : await sql<TweetWithExtras[]>`
        with recursive t(id, parent_tweet_id, depth) as (
            select id, parent_tweet_id, 0 as depth
            from tweets
            where tweets.id = ${tweet.parentTweetId}
          union all
            select x.id, x.parent_tweet_id, t.depth + 1 as depth
            from t
            join tweets x on t.parent_tweet_id = x.id
            and t.depth < 100
        )
        select ${selectTweetWithExtras(user)} from t
        join tweets on t.id = tweets.id
        order by depth desc
      `;

  const replies: TweetWithExtras[] = await sql`
    with recursive t(id, root_id, parent_tweet_id, depth) as (
        select id, id as root_id, parent_tweet_id, 0 as depth
        from tweets
        where tweets.parent_tweet_id = ${tweet.id}
      union all
        select x.id, t.root_id, x.parent_tweet_id, t.depth + 1 as depth
        from t
        join tweets x on t.id = x.parent_tweet_id
        and t.depth < 2
    )
    select ${selectTweetWithExtras(user)}, t.root_id, t.depth from t
    join tweets on t.id = tweets.id
    order by t.root_id, depth asc
  `;

  if (!tweet) throw json("Not found", { status: 404 });

  return json({ tweet, parentTweets, replies });
};

export const action: ActionFunction = async ({ request, params: { id } }) => {
  const { intent } = await getFormData(request);
  const user = await getUser(request);

  switch (intent) {
    case "like":
      await sql`
        insert into likes ${sql({ userId: user.id, tweetId: id! })}
        on conflict (tweet_id, user_id) do nothing
      `;
      return redirect(`/tweets/${id}#tweet-${id}`);
    case "unlike":
      await sql`
        delete from likes
        where user_id = ${user.id}
        and tweet_id = ${id!}
      `;
      return redirect(`/tweets/${id}#tweet-${id}`);
    default:
      throw json("not implemented", { status: 400 });
  }
};

export default function Index() {
  const { tweet, parentTweets, replies } = useLoaderData<{
    tweet: TweetWithExtras;
    parentTweets: TweetWithExtras[];
    replies: (TweetWithExtras & { rootId: number; depth: number })[];
  }>();

  return (
    <Main>
      <Nav></Nav>
      <Panel>
        {parentTweets.map((tweet, index) => (
          <TweetView
            key={tweet.id}
            tweet={tweet}
            link
            timelineAfter
            timelineBefore={index !== 0}
          />
        ))}
        <TweetView
          tweet={tweet}
          timelineBefore={parentTweets.length > 0}
          focused
        />
        <ComposerContainer>
          <Composer parentTweetId={tweet.id} />
        </ComposerContainer>
        {replies.map((tweet, index) => (
          <TweetView
            key={tweet.id}
            tweet={tweet}
            link
            timelineBefore={tweet.rootId !== tweet.id}
            timelineAfter={
              replies[index + 1]?.rootId !== replies[index + 1]?.id
            }
            borderBelow={
              replies[index + 1] && replies[index + 1]?.rootId !== tweet?.rootId
            }
          />
        ))}
      </Panel>
    </Main>
  );
}

const ComposerContainer = styled.div`
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
`;
