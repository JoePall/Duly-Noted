const path = require("path");
const fs = require("fs");
const express = require("express");
const dataPath = __dirname + "/db/db.json";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

console.log("Server Loaded...");

// API
app.get("/api/notes", (req, res) => res.json(getData()));

app.post("/api/notes", (req, res) => {
    let result = getData();

    if (result === undefined) result = [];
    result.push(req.body);

    setData(result);

    res.json(req.body);
});

app.delete("/api/notes/:id", (req, res) => {
    let { id } = req.params;
    
    let data = getData();

    if (data === "") {
        return res.end("Could not find note with id of " + id + ".");
    }

    let result = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].id != id) result.push(data[i]);
    }

    setData(result);

    res.end("Removed note with id of " + id + ".");
});

// Routing
app.get("/notes", (req, res) => sendView(res, "notes"));
app.get("*", (req, res) => sendView(res, "index"));

// View Response Handler
const sendView = (res, viewTitle) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(fs.readFileSync(__dirname + "/public/" + viewTitle + ".html", "utf8"));
};

const getData = () => {
    var contents = fs.readFileSync(dataPath, "utf8");
    if (contents === "") return;
    return JSON.parse(contents);
};

const setData = (contents) => {
    fs.writeFileSync(dataPath, JSON.stringify(contents), "utf8");
}

app.listen(PORT, () => {
    if (!process.env.PORT) require('child_process').exec(`start http://localhost:${PORT}/`);
});