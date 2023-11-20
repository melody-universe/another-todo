-- Deploy todo:users to pg
-- requires: schema
BEGIN;

CREATE TABLE todo.users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    hashed_password BYTEA NOT NULL,
    salt BYTEA NOT NULL
);

COMMIT;