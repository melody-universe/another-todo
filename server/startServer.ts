import express from "express";
import { Client } from "pg";

const startServer = ({ postgresUri }: { postgresUri: string }) => {
  const pgClient = new Client({ connectionString: postgresUri });
  const app = express();
  app.use(express.json());
  app.post("/signup", async (request, response) => {
    await pgClient.connect();
    response.sendStatus(201);
    await pgClient.query(
      "INSERT INTO todo.users \
      (username, hashed_password, salt) \
      VALUES ($1, '\\000'::bytea, '\\000'::bytea)",
      [request.body.username]
    );
    await pgClient.end();
  });
  return app.listen();
};
export default startServer;
