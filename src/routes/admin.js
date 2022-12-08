const express = require("express");
const router = express.Router();

/*

    Messages:
        case t = 'sync':
            d: None
        case t = 'set_answer_visibility':
            d: { answer_id: int, visible: bool}
        case t = 'set_team_score':
            d: { team_id: int, value: int}
        case t = 'next_question':
            d: {  }
        case t = 'set_active_team':
            d: { team_id }

*/

const MessageTypes = {
    Sync: 'sync',
    SetAnswerVisibility: 'set_answer_visibility',
    SetTeamScore: 'set_team_score',
    NextQuestion: 'next_question',
    PrevQuestion: 'prev_question',
    SetActiveTeam: 'set_active_team'
}
module.exports = function(game) {
    router.get("/", (req, res) => {
        res.render("admin", { game });
    });

    router.post("/", (req, res) => {
        console.log(req.body)
        const messageType = req.body.t;
        const messageData = req.body.d;

        switch (messageType) {
            case MessageTypes.SetActiveTeam:
                game.setActiveTeam(messageData.team_id);
                break;
            case MessageTypes.NextQuestion:
                game.nextQuestion();
                break;
            case MessageTypes.PrevQuestion:
                game.prevQuestion();
                break;
            case MessageTypes.SetAnswerVisibility:
                if (messageData.visible)
                    game.revealAnswer(messageData.answer_id);
                else
                    game.hideAnswer(messageData.answer_id);
                break;
        }
        res.send("Ok");
    });
    return router;
}