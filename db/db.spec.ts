import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { afterAll, beforeAll, expect, test } from "vitest";
import sqitch, { pullSqitch } from "./sqitch";
import { EOL } from "os";

let pgContainer: StartedPostgreSqlContainer;

beforeAll(async () => {
  const container = new PostgreSqlContainer();
  pgContainer = await container.start();
});
beforeAll(pullSqitch);

afterAll(async () => {
  await pgContainer.stop();
});

test("apply database schema migrations", async () => {
  const output = await sqitch(
    ["deploy", "--verify", `db:${pgContainer.getConnectionUri()}`],
    { attachStdout: false }
  );
  expect(
    output.indexOf("\x02"),
    `Error deploying schema changes:${EOL}${output}`
  ).toBe(-1);
});
