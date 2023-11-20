import { Server } from "http";
import { AddressInfo } from "net";
import { Client } from "pg";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { afterAll, beforeAll, test } from "vitest";
import sqitch from "../db/sqitch";
import startServer from "./startServer";
import {
  thenTheServerRespondsWithStatus,
  thenTheUserExistsInTheDatabase,
  whenAUserAttemptsToRegister,
} from "./test-steps";

let pgContainer: StartedPostgreSqlContainer;
export let pgClient: Client;
let server: Server;
export let address: string;

beforeAll(async () => {
  pgContainer = await new PostgreSqlContainer().withExposedPorts().start();
  await sqitch(["deploy", `db:${pgContainer.getConnectionUri()}`], {
    attachStdout: false,
  });
  pgClient = new Client({ connectionString: pgContainer.getConnectionUri() });
  await pgClient.connect();
  server = startServer({ postgresUri: pgContainer.getConnectionUri() });
  address = `http://[::]:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
  await pgClient.end();
  await pgContainer.stop();
});

test("new users can sign up", async () => {
  await whenAUserAttemptsToRegister("username", "password");
  thenTheServerRespondsWithStatus(201);
  await thenTheUserExistsInTheDatabase("username");
});
