const express = require("express");
const router = express.Router();

module.exports = function(game) {
    router.get("/", (req, res) => {
        res.render("play", {game});
    });
    
    return router;
}