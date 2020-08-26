const path = require("path");
const fs = require("fs");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(getFileData("index"));
});

app.get("/notes", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(getFileData("notes"));    
});

function getFileData(viewTitle) {
    return fs.readFileSync(__dirname + "/public/" + viewTitle + ".html", "utf8");
}

app.listen(PORT, () => {
    if (!process.env.PORT) require('child_process').exec(`start http://localhost:${PORT}/`);
});