import path from "node:path";
import { createReadStream } from "node:fs";

export const read = async (pathname) => {
    const sourceFile = path.resolve(process.cwd(), pathname);
    const readableStream = createReadStream(sourceFile, "utf-8");
    let data = [];

    for await (let chunk of createReadStream(sourceFile)) {
        data.push(chunk.toString());
    }

    return data.join("\n");
};
