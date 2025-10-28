const questions = [
    {
        question: "Todos os produtos não alimentícios precisam ter validade indicada?",
        answers: [
            { text: "Sim, todos.", correct: false },
            { text: "Não, só importados.", correct: false },
            { text: "Sim, especialmente os que têm contato com o corpo.", correct: true },
            { text: "Não, nacionais não precisam.", correct: false }
        ]
    },
    {
        question: "O que pode acontecer ao usar cosméticos vencidos?",
        answers: [
            { text: "Podem causar alergias e irritações.", correct: true },
            { text: "Nada acontece.", correct: false },
            { text: "Perdem eficácia.Melhoram o efeito.", correct: false },
            { text: "Funcionam normalmente.", correct: false }
        ]
    },
    {
        question: "Onde geralmente está indicada a validade dos produtos não alimentícios?",
        answers: [
            { text: "Em panfletos.", correct: false },
            { text: "Na embalagem ou rótulo.", correct: true },
            { text: "Na nota fiscal.", correct: false },
            { text: "No código de barras.", correct: false }
        ]
    },
    {
        question: "Após abrir um cosmético, o prazo de validade continua o mesmo?",
        answers: [
            { text: "Sim.", correct: false },
            { text: "Deve usar em 24h.", correct: false },
            { text: "Só conta se usar todo dia.", correct: false },
            { text: "Depende: há um prazo após abertura.", correct: true }
        ]
    },
    {
        question: "Produtos de limpeza vencidos podem apresentar qual problema?",
        answers: [
            { text: "Explodem.", correct: false },
            { text: "Melhoram.", correct: false },
            { text: "Perdem eficácia e podem causar danos.", correct: true },
            { text: "Curam alergias.", correct: false }
        ]
    },
    {
        question: "Qual órgão no Brasil regulamenta a validade de cosméticos e produtos de higiene?",
        answers: [
            { text: "INSS.", correct: false },
            { text: "Receita Federal", correct: false },
            { text: "ANVISA", correct: true },
            { text: "IBGE", correct: false }
        ]
    }
];

const questionElement = document.getElementById("question");
const answersContainer = document.getElementById("answers");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Próxima";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answersContainer.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answersContainer.firstChild) {
        answersContainer.removeChild(answersContainer.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.style.backgroundColor = "#48bb78";
        score++;
    } else {
        selectedBtn.style.backgroundColor = "#e53e3e";
    }
    Array.from(answersContainer.children).forEach(button => {
        button.disabled = true;
        if (button.dataset.correct === "true") {
            button.style.backgroundColor = "#48bb78";
        }
    });
    nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
});

function showScore() {
    resetState();
    let message = "";
    if (score === 6) {
        message = "🎉 Parabéns! Você acertou tudo! Excelente trabalho!";
    } else if (score >= 4) {
        message = "👏 Muito bom! Você mandou bem!";
    } else if (score >= 2) {
        message = "💪 Continue praticando, você está quase lá!";
    } else {
        message = "😅 Não desanime! Estude um pouco mais e tente de novo!";
    }

    questionElement.innerHTML = `
        Você acertou <strong>${score}</strong> de <strong>${questions.length}</strong> perguntas!<br><br>
        ${message}
      `;

    nextButton.innerHTML = "Reiniciar";
    nextButton.style.display = "block";
    nextButton.addEventListener("click", startQuiz);
}

startQuiz();