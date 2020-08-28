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

// Returns all notes
app.get("/api/notes", (req, res) => res.json(getFileJSONData()));

// Adds a note
app.post("/api/notes", (req, res) => {
    let fileData = getFileJSONData();

    if (fileData === undefined) fileData = [req.body];
    else fileData.push(req.body);

    setFileJSONData(fileData);

    res.json(req.body);
});

// Returns the note with the matching id
app.get("/api/notes/:id", (req, res) => {
    const fileData = getFileJSONData();
    const result = fileData.find(x => x.id === req.params.id)

    res.json(result);
});

// Modifies the note with the matching id
app.post("/api/notes/:id", (req, res) => {
    const fileData = getFileJSONData();
    const result = fileData.map(item => item.id == req.params.id ? req.body : item);

    setFileJSONData(result);

    res.json(req.body);
});

// Deletes the note with the matching id
app.delete("/api/notes/:id", (req, res) => {
    const { id } = req.params;
    const fileData = getFileJSONData();

    if (fileData === "") return res.end("no data");

    let result = [];
    fileData.forEach(item => {
        if (item.id != id) result.push(item);
    });
    
    setFileJSONData(result);

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

// Returns the db file contents as JSON data
const getFileJSONData = () => {
    var contents = fs.readFileSync(dataPath, "utf8");
    if (contents === "") return;
    return JSON.parse(contents);
};

// Sets the db file contents as JSON stringified
const setFileJSONData = (contents) => {
    fs.writeFileSync(dataPath, JSON.stringify(contents), "utf8");
}

app.listen(PORT, () => {
    if (!process.env.PORT) require('child_process').exec(`start http://localhost:${PORT}/`);
});