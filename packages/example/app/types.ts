export type User = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  username: string;
};

export type UserToken = {
  id: string;
  userId: number;
};

export type UserAuth = {
  id: string;
  userId: number;
  hash: string;
};

export type Tweet = {
  id: number;
  userId: number;
  body: string;
  parentTweetId: number | null;
};

export type TweetWithUser = Tweet & { user: User };

export type TweetWithExtras = Tweet & {
  user: User;
  likesCount: number;
  tweetsCount: number;
  likedByUser: boolean;
};
