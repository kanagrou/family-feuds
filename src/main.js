// import * as express from "express";
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
app.use(express.json());
app.use(express.urlencoded({extended: false}));


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
        if (this.currentQuestion > 0) {
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
        this.teams[team_id].score = value;
        wss.sendAll(wss.MessageTypes.SetTeamScore, {team_id, value});
    }

    getActiveTeam() {
        return this.activeTeam;
    }
    setActiveTeam(team_id) {
        this.activeTeam = team_id;
        wss.sendAll(wss.MessageTypes.SetActiveTeam, {team_id});
    }

    revealAnswer(answer_id) {
        let answer = this.getCurrentQuestion().answers[answer_id]
        const hasChanged = !answer.revealed;
        answer.revealed = true;

        if (this.getActiveTeam() == 0 || this.getActiveTeam() == 1 && hasChanged) {
            this.setTeamScore(this.getActiveTeam(), this.getTeamScore(this.getActiveTeam()) + this.getCurrentQuestion().answers[answer_id].value);
        }

        wss.sendAll(wss.MessageTypes.SetAnswerVisibility, {answer_id, visible: true});
    }
    hideAnswer(answer_id) {
        let answer = this.getCurrentQuestion().answers[answer_id]
        const hasChanged = answer.revealed;
        answer.revealed = false;
        if (this.getActiveTeam() == 0 || this.getActiveTeam() == 1 && hasChanged) {
            this.setTeamScore(this.getActiveTeam(), this.getTeamScore(this.getActiveTeam()) - this.getCurrentQuestion().answers[answer_id].value);
        }
        wss.sendAll(wss.MessageTypes.SetAnswerVisibility, {answer_id, visible: false});
    }

}

// Load game settings
const gameSettings = JSON.parse(fs.readFileSync(path.join(__dirname + "/game-settings.json"))).game;
const game = new Game(gameSettings.teams, gameSettings.questions);

// Routes

const play_route = require("./routes/play.js")(game);
const admin_route = require("./routes/admin.js")(game);
app.use("/play", play_route);
app.use("/admin", admin_route);

app.get("/", (req, res) => {
    res.send("Hello!");
});