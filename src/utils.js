import os from "node:os";
import process from "node:process";
import path from "node:path";

export const normalizedProcessArguments = (args) => {
    return args.slice(2).reduce((acc, argumentPair) => {
        const [key, value] = argumentPair.split("=");
        acc[key] = value;
        return acc;
    }, {});
};

export const writeCurrentWorkingDirectory = () => {
    console.log(`You are currently in ${process.cwd()}`);
};

export const isRootDirectory = () => {
    const isWindows = process.platform === "win32";

    if (!isWindows) {
        return process.cwd() === "/";
    }
    return path.split(process.cwd()).length === 1;
};

export const goToUserHomedir = () => {
    process.chdir(os.homedir());
};

export const writeCommandError = () => {
    process.stdin.write("invalid command\n");
};
