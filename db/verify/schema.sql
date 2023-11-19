-- Verify todo:schema on pg
BEGIN;

SELECT
    pg_catalog.has_schema_privilege('todo', 'usage');

ROLLBACK;