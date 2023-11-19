import { argv } from "process";
import sqitch from ".";

await sqitch(argv.slice(3));
