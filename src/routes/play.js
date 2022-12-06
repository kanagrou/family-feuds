const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    const game = {
        teams: [
            {name: "Team 1", score: 300},
            {name: "Team 2", score: 250}
        ],
        question: {
            name: "Question 1",
            answers: [
                {name: "Answer 1", value: 90},
                {name: "Answer 2", value: 60},
                {name: "Answer 3", value: 30},
                {name: "Answer 4", value: 15},
                {name: "Answer 5", value: 5}
            ]
        }
    }

    res.render("play", {game});
});

module.exports = router;