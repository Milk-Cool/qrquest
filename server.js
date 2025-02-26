import sqlite from "better-sqlite3";
import session from "express-session";
import storeConstructor from "better-sqlite3-session-store";
const SqliteStore = storeConstructor(session);
const db = new sqlite("sessions.db"/*, { verbose: console.log }*/);

import express from "express";
import loadEjs from "./loadejs.js";
import { getSettings } from "./index.js";

const { SECRET } = process.env;

const app = express();
app.use(session({
    store: new SqliteStore({
        client: db,
        expired: {
            clear: false
        }
    }),
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}));

app.get("/", (_req, res) => {
    res.send(loadEjs({}, "index.ejs"));
});

app.get("/:id", (req, res) => {
    const settings = getSettings();
    if(!settings.uuids.includes(req.params.id))
        return res.redirect("/");
    if(!("uuids" in req.session))
        req.session.uuids = [req.params.id];
    else if(!req.session.uuids.includes(req.params.id))
        req.session.uuids.push(req.params.id);
    res.send(loadEjs({
        left: settings.uuids.length - req.session.uuids.length,
        no: settings.uuids.indexOf(req.params.id) + 1,
        contact: settings.contact
    }, "qrcode.ejs"));
});

app.listen(1989);