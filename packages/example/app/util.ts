import { DataFunctionArgs } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import sql from "./sql.server";
import { User } from "./types";

export async function getFormData(request: DataFunctionArgs["request"]) {
  const formData = await request.formData();
  const data = Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [key, String(value)])
  );
  return data;
}

export function getQuery(request: DataFunctionArgs["request"]) {
  const { searchParams } = new URL(request.url);
  const data = Object.fromEntries(
    Array.from(searchParams.entries()).map(([key, value]) => [
      key,
      String(value),
    ])
  );
  return data;
}

export function useQuery() {
  const [sp] = useSearchParams();
  const data = Object.fromEntries(
    Array.from(sp.entries()).map(([key, value]) => [key, String(value)])
  );
  return data;
}

export function selectTweetWithExtras(user: User) {
  return sql`
    tweets.id,
    tweets.user_id,
    tweets.body,
    tweets.parent_tweet_id,
    (select row_to_json(users.*) from users where users.id = tweets.user_id)
      as user,
    (select count(*) from likes where likes.tweet_id = tweets.id) as likes_count,
    (select count(*) from tweets t2 where t2.parent_tweet_id = tweets.id) as tweets_count,
    exists (
      select 1 from likes where likes.tweet_id = tweets.id and likes.user_id = ${user.id}
    ) as liked_by_user
  `;
}
