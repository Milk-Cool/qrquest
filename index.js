import fs from "fs";
export const getSettings = () => {
    const text = fs.readFileSync("settings.json", "utf-8");
    return JSON.parse(text);
}