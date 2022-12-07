const WebSocketServer = require("ws").Server;

/*

    Messages:
        case t = 'sync':
            d: None
        case t = 'set_answer_visibility':
            d: { answer_id: int, visible: bool}
        case t = 'set_team_score':
            d: { team_id: int, value: int}
        case t = 'set_question':
            d: { question: Question }
        case t = 'set_active_team':
            d: { team_id }

*/

const MessageTypes = {
    Sync: 'sync',
    SetAnswerVisibility: 'set_answer_visibility',
    SetTeamScore: 'set_team_score',
    SetQuestion: 'set_question',
    SetActiveTeam: 'set_active_team'
}

module.exports = function(server, game) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
    });    

    function sendAll(messageType, messageData) {
        wss.clients.forEach((ws) => {
            ws.send(JSON.stringify({
                t: messageType,
                d: messageData
            }));
        });
    }

    return {
        MessageTypes,
        sendAll,
        wss
    }
}
