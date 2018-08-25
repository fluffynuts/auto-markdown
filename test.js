/*
* Largely borrowed from https://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http#answer-47771710
*/
const 
    os = require("os"),
    child_process = require("child_process"),
    fs = require("fs"),
    express = require("express"),
    path = require("path"),
    port = process.env.PORT || 5000,
    app = express();

app.get("*", (req, res) => {
    const fullPath = path.resolve(__dirname, defaultIfRequired(req.url));
    fs.exists(fullPath, (exists) => {
        if (exists) {
            console.log(`[200] ${req.url}`);
            res.sendFile(fullPath);
        } else {
            console.error(`[404] ${req.url}`);
            res.status(404)
                .send("Nope, that's a 404, son.");
        }
    });
});

function defaultIfRequired(p) {
    return p === "" || p === "/"
        ? "index.html"
        : p.replace(/^\//, "");
}

function spawn(proc, args) {
    child_process.spawn(proc, args);
}

app.listen(port);
console.log("server started on port " + port);

if (os.platform() === "linux") {
    spawn("xdg-open", [ `http://localhost:${port}` ] );
} else if (os.platform().toLowerCase().indexOf("win") > -1) {
    spawn("cmd", [ "-e", "start", `http://localhost:${port}` ] );
}