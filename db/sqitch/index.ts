import Docker from "dockerode";
import { join } from "path";
import { stdout } from "process";

export default async function sqitch(input: string[]) {
  const docker = new Docker();

  // make sure Docker image exists locally
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

  // run the Docker image
  await docker.run("sqitch/sqitch", input, stdout, {
    HostConfig: {
      AutoRemove: true,
      Mounts: [
        { Type: "bind", Source: join(__dirname, ".."), Target: "/repo" },
      ],
    },
    User: "1000:1000",
  });
}
