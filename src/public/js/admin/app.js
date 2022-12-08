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

async function post(messageType, messageData) {
    return await fetch(location.href, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({t: messageType, d: messageData})
    });
}

async function setActiveTeam(team_id) {
    const res = await post(MessageTypes.SetActiveTeam, { team_id });
}

async function setAnswerVisibility(answer_id, visible) {
    const res = await post(MessageTypes.SetAnswerVisibility, {answer_id, visible});
}

async function nextQuestion() {
    const res = await post(MessageTypes.NextQuestion, {});
}
async function prevQuestion() {
    const res = await post(MessageTypes.PrevQuestion, {});
}


const Elements = {
    NextQuestion: document.getElementById('next-question-button'),
    PrevQuestion: document.getElementById('prev-question-button'),
    ToggleAnswerVisibility: document.getElementsByName('toggle-answer'),
    SetActiveTeam: document.getElementsByName('set-active-team')
}

Elements.NextQuestion.addEventListener('click', async (e) => {
    await nextQuestion();
    location.reload();
});

Elements.PrevQuestion.addEventListener('click', async (e) => {
    await prevQuestion();
    location.reload();
});

Array.from(Elements.ToggleAnswerVisibility).forEach((elem, i) => elem.addEventListener('click', async (e) => {
    await setAnswerVisibility(i, elem.dataset.visible == "true" ? false : true);
    location.reload();
}));

Array.from(Elements.SetActiveTeam).forEach((elem, i) => elem.addEventListener('click', async (e) => {
    await setActiveTeam(i);
    location.reload();
}));