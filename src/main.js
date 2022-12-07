const express = require("express");
const path = require("path");
const fs = require("fs");



const PORT = 3000;
const app = express();
const server = app.listen(PORT, () => console.log("Listening on port", PORT));

const wss = require("./wss.js")(server);

// Settings
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middlewares
app.use(express.static(__dirname + "/public/"));

// Game
class Game {
    teams;
    questions;
    currentQuestion;
    
    constructor(teamNames, questions) {
        this.teams = [{name: teamNames[0], score: 0}, {name: teamNames[1], score: 0}];
        this.questions = questions;
        this.currentQuestion = 0;
        this.activeTeam = -1;
    }

    nextQuestion() {
        if (this.currentQuestion + 1 < this.questions.length) {
            this.currentQuestion++;
            wss.sendAll(wss.MessageTypes.SetQuestion, {question: this.getCurrentQuestion()});
        }
    }

    prevQuestion() {
        if (this.currentQuestion + 1 > 0) {
            this.currentQuestion--;
            wss.sendAll(wss.MessageTypes.SetQuestion, {question: this.getCurrentQuestion()});
        }
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestion];
    }

    getTeamName(team_id) {
        return this.teams[team_id].name;
    }
    setTeamName(team_id, name) {
        return this.teams[team_id].name = name;
    }

    getTeamScore(team_id) {
        return this.teams[team_id].score;
    }
    setTeamScore(team_id, value) {
        this.teams[team_id].score = score;
        wss.sendAll(wss.MessageTypes.SetTeamScore, {value});
    }

    getActiveTeam() {
        return this.activeTeam;
    }
    setActiveTeam(team_id) {
        this.activeTeam = team_id;
        wss.sendAll(wss.MessageTypes.SetActiveTeam, {team_id});
    }

    revealAnswer(answer_id) {
        this.getCurrentQuestion().answers[answer_id].revealed = true;
        wss.sendAll(wss.MessageTypes.SetAnswerVisibility, {answer_id, visible: true});
    }
    hideAnswer(answer_id) {
        this.getCurrentQuestion().answers[answer_id].revealed = false;
        wss.sendAll(wss.MessageTypes.SetAnswerVisibility, {answer_id, visible: false});
    }

}

// Load game settings
const gameSettings = JSON.parse(fs.readFileSync(path.join(__dirname + "/game-settings.json"))).game;
const game = new Game(gameSettings.teams, gameSettings.questions);

// Routes
const play = require("./routes/play.js")(game);
app.use("/play", play);

app.get("/", (req, res) => {
    res.send("Hello!");
});


setTimeout(() => game.revealAnswer(2),5000);
setTimeout(() => game.nextQuestion(),10000);
setTimeout(() => game.setActiveTeam(0), 12500);
setTimeout(() => game.revealAnswer(1), 15000);
setTimeout(() => game.setActiveTeam(1), 17500);
setTimeout(() => game.prevQuestion(), 20000);
setTimeout(() => game.setActiveTeam(-1), 22500);
