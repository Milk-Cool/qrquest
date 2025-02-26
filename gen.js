import QRCode from "qrcode";
import fs from "fs";
import { join } from "path";
import { getSettings } from "./index.js";

const { BASE } = process.env;
const settings = getSettings();
if(!fs.existsSync("out"))
    fs.mkdirSync("out");
(async () => {
    for(const uuid of settings.uuids) {
        const url = await QRCode.toDataURL(new URL("/" + uuid, BASE).href);
        fs.writeFileSync(join("out", uuid + ".png"), Buffer.from(url.split(",").at(-1), "base64"));
    }
})();