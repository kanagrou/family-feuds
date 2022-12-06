const ws = new WebSocket("wss://" + location.hostname);

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
        case t = 'set_active_team':
            d: { team_id: int}

*/

const MessageTypes = {
    SetAnswerVisibility: 'set_answer_visibility',
    SetTeamScore: 'set_team_score',
    SetQuestion: 'set_question',
    SetActiveTeam: 'set_active_team',
    Sync: 'sync'
}

ws.onmessage = (data) => {
    const parsed_data = JSON.parse(data.data);
    const MessageType = parsed_data.t;
    const MessageData = parsed_data.d;

    console.log(MessageType, MessageData);

    switch (MessageType) {
        case MessageTypes.SetAnswerVisibility:
            setAnswerVisibility(MessageData.ans_id, MessageData.visible)
            break;
        case MessageTypes.SetTeamScore:
            setTeamScore(MessageData.team_id, MessageData.value);
            break;
        case MessageTypes.SetQuestion:
            setQuestion(MessageData.question);
            break;
        case MessageTypes.SetActiveTeam:
            setActiveTeam(MessageData.team_id);
            break;
        case MessageTypes.Sync:
            reloadPage();
            break;
        
    }
}


function setAnswerVisibility(answer_id, visible) {
    const answers_list = document.querySelector('ul.answers-list');
    const answer = answers_list.children[answer_id];

    if (visible == true && !answer.classList.contains("locked"))
        answer.classList.add('revealed');
    else
        answer.classList.remove('revealed');
}

function setTeamScore(team_id, value) {
    const team_score_elem = document.querySelectorAll("span.team-card__score")[team_id];
    team_score_elem.textContent = value;
}

function setQuestion(question) {
    const question_title_elem = document.querySelector("#question-title");
    const answers_list = document.querySelector('ul.answers-list');

    question_title_elem.textContent = question.name;
    for (let i=0;i<8;i++) {
        const answer = answers_list.children[i];
        answer.classList.remove("revealed");
        if (question.answers[i]) {
            answer.querySelector(".answer-card__answer").textContent = question.answers[i].name;
            answer.querySelector(".answer-card__value").textContent = question.answers[i].value;  
            answer.classList.remove("locked");
        } else {
            answer.querySelector(".answer-card__answer").textContent = "None";
            answer.querySelector(".answer-card__value").textContent = 0;  
            answer.classList.add("locked");
        }
    };
}

function setActiveTeam(team_id) {
    const team_cards = document.querySelectorAll('.team-card');
    
    for (let i=0; i<2; i++) {
        if (i == team_id) {
            team_cards[i].classList.add('active');
        } else {
            team_cards[i].classList.remove('active');
        }
    }
}

function reloadPage() {
    location.reload();
}