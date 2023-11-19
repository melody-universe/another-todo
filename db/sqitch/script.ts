import { argv } from "process";
import sqitch from ".";

const args = argv.slice(3);
await sqitch(args);
