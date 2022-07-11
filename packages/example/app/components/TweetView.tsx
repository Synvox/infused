import { mdiHeart, mdiHeartOutline } from "@mdi/js";
import { Link, useFetcher } from "@remix-run/react";
import { TweetWithExtras, TweetWithUser } from "app/types";
import { StyleSheet } from "infused";
import { Button, IconButton } from "./Button";
import { Flex } from "./Flex";
import { iconOf } from "./Icons";
import { Stack } from "./Stack";

const { styled } = StyleSheet();

const HeartIcon = iconOf(mdiHeart);
const HeartOutlineIcon = iconOf(mdiHeartOutline);

export function TweetView({
  tweet,
  link = false,
  timelineBefore = false,
  timelineAfter = false,
  focused = false,
  borderBelow = false,
}: {
  tweet: TweetWithExtras;
  link?: boolean;
  timelineBefore?: boolean;
  timelineAfter?: boolean;
  focused?: boolean;
  borderBelow?: boolean;
}) {
  const fetcher = useFetcher();

  let view = (
    <Container
      id={`tweet-${tweet.id}`}
      focused={focused}
      borderBelow={borderBelow}
    >
      <Flex direction="row" alignItems="flex-start">
        <Stack>
          <Avatar
            timelineBefore={timelineBefore}
            timelineAfter={timelineAfter}
          />
          <Flex>
            <Stack space="xsmall">
              <Flex direction="row" alignItems="flex-end">
                <Stack space="small">
                  <Name>{tweet.user.name}</Name>
                  <UserName>@{tweet.user.username}</UserName>
                </Stack>
              </Flex>
              <Body>{tweet.body}</Body>
              <Flex direction="row" alignItems="center">
                <Stack>
                  <Meta>
                    {!link && (
                      <fetcher.Form
                        action={`/tweets/${tweet.id}`}
                        method="post"
                      >
                        {tweet.likedByUser ? (
                          <IconButton
                            value="unlike"
                            name="intent"
                            type="submit"
                            red
                          >
                            <HeartIcon />
                          </IconButton>
                        ) : (
                          <IconButton value="like" name="intent" type="submit">
                            <HeartOutlineIcon />
                          </IconButton>
                        )}
                      </fetcher.Form>
                    )}

                    {tweet.likesCount +
                      " Like" +
                      (Number(tweet.likesCount) === 1 ? "" : "s")}
                  </Meta>
                  <Meta>
                    {tweet.tweetsCount +
                      (Number(tweet.tweetsCount) === 1 ? " Reply" : " Replies")}
                  </Meta>
                </Stack>
              </Flex>
            </Stack>
          </Flex>
        </Stack>
      </Flex>
    </Container>
  );

  if (link)
    return (
      <TweetAnchor to={`/tweets/${tweet.id}#tweet-${tweet.id}`}>
        {view}
      </TweetAnchor>
    );
  else return view;
}

export const TweetAnchor = styled(Link)`
  display: block;
  text-decoration: none;
  transition: background 0.2s;
  &:hover {
    background: var(--surface-1);
  }
`;

const Container = styled.div<{ focused?: boolean; borderBelow?: boolean }>`
  padding: 20px;
  min-height: 100px;
  &.focused {
    background: var(--surface-1);
    border: 1px solid var(--border-color);
    border-left: 0;
    border-right: 0;
    a &:hover {
      background: var(--surface-0);
    }
  }
  &.border-below {
    border-bottom: 1px solid var(--border-color);
  }
`.classes({
  focused: (p) => p.focused,
  "border-below": (p) => p.borderBelow,
});

const Name = styled.div`
  font-weight: 500;
  color: var(--text-color);
`;

const UserName = styled.div`
  font-weight: 500;
  color: var(--text-color);
  opacity: 0.5;
  font-size: 0.85em;
`;

const Avatar = styled.div<{
  timelineBefore?: boolean;
  timelineAfter?: boolean;
}>`
  background-color: #0080ff;
  border-radius: 1000px;
  width: 40px;
  height: 40px;
  position: relative;
  &.timeline-after::after {
    content: "";
    display: block;
    position: absolute;
    left: calc(50% - 1px);
    top: 100%;
    width: 2px;
    height: 100%;
    background-color: var(--border-color);
  }
  &.timeline-before::before {
    content: "";
    display: block;
    position: absolute;
    left: calc(50% - 1px);
    bottom: 100%;
    width: 2px;
    height: 100%;
    background-color: var(--border-color);
  }
`.classes({
  "timeline-before": (p) => p.timelineBefore,
  "timeline-after": (p) => p.timelineAfter,
});

const Body = styled.div`
  font-size: 1rem;
  color: var(--text-color);
  line-height: 1.6em;
  ${Container}.focused & {
    font-size: 1.3em;
  }
`;

const Meta = styled.div`
  font-weight: 500;
  color: var(--text-color);
  opacity: 0.8;
  font-size: 0.85em;
  display: flex;
  align-items: center;
  button {
    margin-right: 8px;
  }
`;
