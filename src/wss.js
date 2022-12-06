const WebSocketServer = require("ws").Server;

/*

    Messages:
        case t = 'sync':
            d: None
        case t = 'set_answer_visibility':
            d: { ans_id: int, visible: bool}
        case t = 'set_team_score':
            d: { team_id: int, value: int}
        case t = 'set_question':
            d: { question: Question }

*/

module.exports = function(server, game) {
    const wss = new WebSocketServer({ server });
    
    wss.on('connection', (ws) => {
    });    
    module.exports = wss;
}
