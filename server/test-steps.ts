import { expect } from "vitest";
import { address, pgClient } from "./server.spec";

let response: Response;

export const whenAUserAttemptsToRegister = async (
  username: string,
  password: string
) => {
  response = await fetch(`${address}/signup`, {
    body: JSON.stringify({ username, password }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
};

export const thenTheServerRespondsWithStatus = (status: number) => {
  expect(response.status).toBe(status);
};

export const thenTheUserExistsInTheDatabase = async (username: string) => {
  const results = await pgClient.query(
    "SELECT username \
    FROM todo.users \
    WHERE username = $1",
    [username]
  );
  expect(results.rowCount).toBe(1);
};
