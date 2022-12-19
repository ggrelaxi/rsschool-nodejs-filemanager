import path, { resolve } from "node:path";
import os from "node:os";
import { isRootDirectory, writeCommandError } from "./utils.js";
import { list as getDirectoryContent } from "./functions/list.js";
import { dir } from "node:console";
import fs from "node:fs/promises";
import { rejects } from "node:assert";
import { read } from "./functions/read.js";

export const commands = {
    ".exit": function (args, username) {
        process.stdin.write(`\nThank you for using File Manager, ${username}, goodbye!\n`);
        process.exit();
    },
    up: function (args, userName) {
        const pathParts = process.cwd().split(path.sep);
        const isRoot = isRootDirectory();

        if (isRoot) {
            return;
        }
        const upDirName = [...pathParts.slice(0, pathParts.length - 1)].join(path.sep);

        process.chdir(upDirName ? upDirName : path.parse(process.cwd()).root);
    },
    cd: function (args, userName) {
        if (args.length > 2 || args.length === 0) {
            writeCommandError();
            return;
        }
        const [userPath] = args;
        const correctPath = path.resolve(process.cwd(), userPath);
        process.chdir(correctPath);
    },
    ls: async function (args, userName) {
        if (args.length > 2 || args.length === 0) {
            writeCommandError();
            return;
        }
        const [userPath = "./"] = args;
        const correctPath = path.resolve(process.cwd(), userPath);
        const directoryContent = await getDirectoryContent(correctPath);
        const statsPromises = directoryContent.map(async (item) => {
            try {
                await fs.readFile(path.resolve(process.cwd(), item), { encoding: "utf8" });
                return [item, "file"];
            } catch (e) {
                return [item, "directory"];
            }
        });
        await Promise.all(statsPromises).then((data) => {
            const tablePreview = [];
            data.forEach((item) => {
                const [name, type] = item;
                if (type === "directory") tablePreview.unshift(item);
                else {
                    tablePreview.push(item);
                }
            });
            console.table(tablePreview);
        });
    },
    cat: async function (args, userName) {
        if (args.length > 2 || args.length === 0) {
            writeCommandError();
            return;
        }
        const [userPath = "./"] = args;
        const correctPath = path.resolve(process.cwd(), userPath);
        const data = await read(correctPath);

        console.log(data);
    },
};

export const runCommand = async (command, args, commands, username) => {
    if (commands.hasOwnProperty(command)) await commands[command](args, username);
    else {
        writeCommandError();
    }
};
