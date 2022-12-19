import process from "node:process";
import { commands, runCommand } from "./commands.js";
import { normalizedProcessArguments, writeCurrentWorkingDirectory, goToUserHomedir } from "./utils.js";

const startFileManager = () => {
    const userArguments = normalizedProcessArguments(process.argv);
    const userName = userArguments["--username"];

    console.log(`Welcome to the File Manager, ${userName}!`);

    goToUserHomedir();
    writeCurrentWorkingDirectory();

    process.stdin.on("data", async (userInput) => {
        const userCommand = userInput.toString().trim().split(" ");
        const [command, ...args] = userCommand;
        await runCommand(command, args, commands, userName);
        writeCurrentWorkingDirectory();
    });

    process.on("SIGINT", () => runCommand(".exit", [], commands, userName));
};

startFileManager();
