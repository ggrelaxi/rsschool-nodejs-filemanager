import fs from "node:fs/promises";
import path from "node:path";

export const list = async (userPath) => {
    const destinationFolder = path.resolve(process.cwd(), userPath);
    try {
        const files = await fs.readdir(destinationFolder);
        return files;
    } catch (e) {}
};
