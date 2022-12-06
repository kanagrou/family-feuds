const express = require("express");
const path = require("path");

// Routes
const play = require("./routes/play.js");

const PORT = 3000;
const app = express();
const server = app.listen(PORT, () => console.log("Listening on port", PORT));

const wss = require("./wss.js")(server);

// Settings
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middlewares
app.use(express.static(__dirname + "/public/"));

// Routes
app.use("/play", play);

app.get("/", (req, res) => {
    res.send("Hello!");
});