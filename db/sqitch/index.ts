import Docker from "dockerode";
import { execa } from "execa";
import { join } from "path";
import { env, stdout } from "process";
import { PassThrough } from "stream";

export async function pullSqitch() {
  const docker = new Docker();

  const images = await docker.listImages();
  if (
    !images.some(
      (image) =>
        image.RepoTags && image.RepoTags.indexOf("sqitch/sqitch:latest") > -1
    )
  ) {
    // if not, pull the Docker image
    const stream = await docker.pull("sqitch/sqitch:latest");
    await new Promise<void>((resolve, reject) =>
      docker.modem.followProgress(stream, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      })
    );
  }
}

export default async function sqitch(
  input: string[],
  options?: { attachStdout: boolean }
) {
  // make sure Docker image exists locally
  await pullSqitch();

  // set up stream to capture output before passing it to stdout
  const receiver = new PassThrough();
  const output: string[] = [];
  receiver.on("data", (chunk: unknown) => output.push(`${chunk}`));
  if (options?.attachStdout ?? true) {
    receiver.pipe(stdout);
  }

  // run the Docker image
  await new Docker().run("sqitch/sqitch", input, receiver, {
    Env:
      env["CI"] === "true"
        ? ["SQITCH_FULLNAME=CI", "SQITCH_EMAIL=admin@melody-universe.com"]
        : [
            await gitToSqitch("FULLNAME", "name"),
            await gitToSqitch("EMAIL", "email"),
          ],
    HostConfig: {
      AutoRemove: true,
      Mounts: [
        { Type: "bind", Source: join(__dirname, ".."), Target: "/repo" },
      ],
      NetworkMode: "host",
    },
    User: "1000:1000",
    Tty: false,
  });

  return output.join("");
}

async function gitToSqitch(
  sqitchName: string,
  gitVariable: string
): Promise<string> {
  return `SQITCH_${sqitchName}=${
    (await execa("git", ["config", `user.${gitVariable}`])).stdout
  }`;
}
