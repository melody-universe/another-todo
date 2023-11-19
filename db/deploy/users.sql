-- Deploy todo:users to pg
-- requires: schema
BEGIN;

CREATE TABLE todo.users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    hashed_password BYTEA,
    salt BYTEA
);

COMMIT;