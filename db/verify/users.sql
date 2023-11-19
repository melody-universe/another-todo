-- Verify todo:users on pg
BEGIN;

SELECT
    id,
    username,
    hashed_password,
    salt
FROM
    todo.users
WHERE
    FALSE;

ROLLBACK;