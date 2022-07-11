import { Form } from "@remix-run/react";
import { Button } from "./Button";
import { Flex } from "./Flex";
import { Input, Textarea } from "./Input";
import { Stack } from "./Stack";

export function Composer({ parentTweetId }: { parentTweetId?: number }) {
  return (
    <Form reloadDocument action="/new" method="post">
      {parentTweetId && (
        <input type="hidden" name="parentTweetId" value={parentTweetId} />
      )}
      <Flex direction="row">
        <Stack>
          <Input autoFocus placeholder="What's happening?" name="body" />
          <Button primary type="submit">
            New Tweet
          </Button>
        </Stack>
      </Flex>
    </Form>
  );
}
