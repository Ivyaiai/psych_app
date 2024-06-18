document.addEventListener("DOMContentLoaded", () => {
    fetch('data/questionnaires.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Loaded questionnaires:', data); // 添加调试日志
            loadQuestionnaires(data);
        })
        .catch(error => console.error('Error loading questionnaires:', error));
});

function loadQuestionnaires(data) {
    const container = document.getElementById('questionnaire-container');
    container.innerHTML = ''; // 确保容器为空
    data.forEach((questionnaire, index) => {
        console.log('Loading questionnaire:', questionnaire); // 添加调试日志
        const section = document.createElement('section');
        section.classList.add('questionnaire');

        const title = document.createElement('h3');
        title.textContent = questionnaire.title;
        section.appendChild(title);

        questionnaire.questions.forEach((question, qIndex) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question');

            const label = document.createElement('label');
            label.textContent = question.text;
            questionDiv.appendChild(label);

            const select = document.createElement('select');
            select.dataset.questionnaireIndex = index;
            select.dataset.questionIndex = qIndex;

            question.options.forEach((option, oIndex) => {
                const optionElement = document.createElement('option');
                optionElement.value = oIndex + 1; // 计分从1开始
                optionElement.textContent = option;
                select.appendChild(optionElement);
            });

            questionDiv.appendChild(select);
            section.appendChild(questionDiv);
        });

        container.appendChild(section);
    });
}

function submitAnswers() {
    const answers = {};
    const selects = document.querySelectorAll('select');

    selects.forEach(select => {
        const qIndex = select.dataset.questionIndex;
        const qnIndex = select.dataset.questionnaireIndex;

        if (!answers[qnIndex]) {
            answers[qnIndex] = {};
        }

        answers[qnIndex][qIndex] = parseInt(select.value);
    });

    console.log('提交的答案:', answers);

    // 计算分数
    const scores = calculateScores(answers);
    displayResults(scores);
}

function calculateScores(answers) {
    const scores = {
        anxiety: 0,
        depression: 0
    };

    // 根据问卷的顺序进行分数计算
    for (let qnIndex in answers) {
        if (qnIndex == 0) { // 焦虑自评量表
            for (let qIndex in answers[qnIndex]) {
                scores.anxiety += answers[qnIndex][qIndex];
            }
        } else if (qnIndex == 1) { // 抑郁自评量表
            for (let qIndex in answers[qnIndex]) {
                scores.depression += answers[qnIndex][qIndex];
            }
        }
    }

    return scores;
}

function displayResults(scores) {
    let resultMessage = `
        <h3>测评结果</h3>
        <p>焦虑自评量表总分: ${scores.anxiety}</p>
        <p>抑郁自评量表总分: ${scores.depression}</p>
    `;

    // 根据分数进行评价
    if (scores.anxiety >= 20) {
        resultMessage += "<p>焦虑评分较高，建议咨询专业人士。</p>";
    } else {
        resultMessage += "<p>焦虑评分正常。</p>";
    }

    if (scores.depression >= 20) {
        resultMessage += "<p>抑郁评分较高，建议咨询专业人士。</p>";
    } else {
        resultMessage += "<p>抑郁评分正常。</p>";
    }

    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = resultMessage;
}
