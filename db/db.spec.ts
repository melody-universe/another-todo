import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { afterAll, beforeAll, expect, test } from "vitest";
import sqitch, { pullSqitch } from "./sqitch";
import { EOL } from "os";

let pgContainer: StartedPostgreSqlContainer;

beforeAll(async () => {
  pgContainer = await new PostgreSqlContainer().start();
});
beforeAll(pullSqitch);

afterAll(async () => {
  await pgContainer.stop();
});

test("apply sqitch migrations", async () => {
  const output = await sqitch([
    "deploy",
    "--verify",
    `db:${pgContainer.getConnectionUri()}`,
  ]);
  expect(
    output.indexOf("\x02"),
    `Error deploying schema changes:${EOL}${output}`
  ).toBe(-1);
});
