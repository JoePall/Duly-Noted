const path = require("path");
const fs = require("fs");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(getFileData("index"));
});

app.get("/notes", function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(getFileData("notes"));    
});

function getFileData(viewTitle) {
    let path = __dirname + "/public/" + viewTitle + ".html";
    console.log(path);
    var result = fs.readFileSync(path, "utf8");
    console.log(result);
    return result;
}

app.listen(PORT, function () {
    if (!process.env.PORT) require('child_process').exec(`start http://localhost:${PORT}/`);
});