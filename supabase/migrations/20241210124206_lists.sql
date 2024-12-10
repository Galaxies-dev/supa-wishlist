-- Migrations will appear here as you chat with AI

create table users (
  id uuid references auth.users not null primary key,
  username text unique not null,
  email text unique not null,
  created_at timestamp with time zone default now() not null
);

create table wishlists (
  id bigint primary key generated always as identity,
  user_id uuid references users (id) not null,
  name text not null,
  created_at timestamp with time zone default now() not null
);

create table items (
  id bigint primary key generated always as identity,
  wishlist_id bigint references wishlists (id) not null,
  name text not null,
  description text,
  url text,
  created_at timestamp with time zone default now() not null
);