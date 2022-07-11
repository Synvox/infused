exports.up = async (sql) => {
  await sql`create extension if not exists citext`;

  await sql`
		create or replace function trigger_set_timestamp()
		returns trigger as $$
		begin
			new.updated_at = now();
			return new;
		end;
		$$ language plpgsql;
	`;

  await sql`
		create table users (
			id bigint generated always as identity primary key,
			created_at timestamp with time zone not null default now(),
			updated_at timestamp with time zone not null default now(),
			username citext unique not null check (username ~* '^(\\w){1,15}$'),
			name text not null default ''::text
		)
	`;

  await sql`
		create table user_auths (
			id bigint generated always as identity primary key,
			created_at timestamp with time zone not null default now(),
			user_id bigint unique not null references users(id) on delete cascade on update cascade,
			hash text not null
		)
	`;

  await sql`
		create table user_tokens (
			id uuid primary key default gen_random_uuid(),
			created_at timestamp with time zone not null default now(),
			last_used_at timestamp with time zone not null default now(),
			user_id bigint not null references users(id) on delete cascade on update cascade,
			expires_at timestamp with time zone not null default now() + '1 week'::interval,
			disabled_at timestamp with time zone
		)
	`;

  await sql`
		create table tweets (
			id bigint generated always as identity primary key,
			created_at timestamp with time zone not null default now(),
			user_id bigint not null references users(id) on delete cascade on update cascade,
			parent_tweet_id bigint,
			body text not null check (length(body) <= 140)
		)
	`;

  await sql`
		alter table tweets
		  add constraint tweets_parent_tweet_id_fkey foreign key (parent_tweet_id) references tweets(id) on delete set null on update cascade
	`;

  await sql`
		create table followers (
			id bigint generated always as identity primary key,
			created_at timestamp with time zone not null default now(),
			user_id bigint not null references users(id) on delete cascade on update cascade,
			follows_user_id bigint not null references users(id) on delete cascade on update cascade,
			constraint user_id_follows_user_id_unique unique (user_id, follows_user_id)
		)
	`;

  await sql`
		create table likes (
			id bigint generated always as identity primary key,
			created_at timestamp with time zone not null default now(),
			user_id bigint not null references users(id) on delete cascade on update cascade,
			tweet_id bigint not null references tweets(id) on delete cascade on update cascade,
			constraint tweet_id_user_id_unique unique (tweet_id, user_id)
		)
	`;

  await sql`
		create trigger set_timestamp
		before update on users
		for each row
		execute procedure trigger_set_timestamp();
	`;

  const [user] = await sql`
		insert into users ${sql({
      username: "Ryan",
      name: "Ryan Allred",
    })}
		returning *
	`;

  await sql`
		insert into user_auths ${sql({
      user_id: user.id,
      // password
      hash: "$2a$12$cephFaNDoIVoS9X.4XLELetQSIClP4vbk3KBLtTeRLAgpI/um5eGm",
    })}
		returning *
	`;
};

exports.down = async (sql) => {
  await sql`drop table followers`;
  await sql`drop table likes`;
  await sql`drop table tweets`;
  await sql`drop table user_tokens`;
  await sql`drop table user_auths`;
  await sql`drop table users`;
};
