-- Revert todo:users from pg
BEGIN;

DROP TABLE todo.users;

COMMIT;