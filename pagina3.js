function toggleConteudo(id) {
    const conteudo = document.getElementById(id);
    const seta = document.getElementById('seta-' + id);
   
    conteudo.classList.toggle('aberto');
    seta.classList.toggle('rotacionada');
}
 
const questions = [
    {
        question: "Por que a carne estraga mais rapidamente do que outros alimentos?",
        answers: [
            { text: "Porque tem pouca água e não atrai bactérias.", correct: false },
            { text: "Porque é armazenada em locais quentes.", correct: false },
            { text: "Porque é rica em água e nutrientes, o que favorece a proliferação de microrganismos.", correct: true },
            { text: "Porque não pode ser congelada.", correct: false }
        ]
    },
    {
        question: "Qual método de conservação é mais indicado para armazenar carne por longos períodos?",
        answers: [
            { text: "Congelar a carne bem embalada.", correct: true },
            { text: "Refrigerar por até 3 dias.", correct: false },
            { text: "Cozinhar e deixar em temperatura ambiente.", correct: false },
            { text: "Armazenar com outros alimentos secos.", correct: false }
        ]
    },
    {
        question: "O que deve ser feito para manter os ovos frescos por mais tempo?",
        answers: [
            { text: "Guardá-los na porta da geladeira", correct: false },
            { text: "Mantê-los na embalagem original na parte mais fria da geladeira", correct: true },
            { text: "Lavar os ovos com sabão e deixá-los ao sol.", correct: false },
            { text: "Armazená-los fora da embalagem", correct: false }
        ]
    },
    {
        question: "Qual método citado no texto utiliza sal ou salmoura para preservar a carne?",
        answers: [
            { text: "Sous-vide.", correct: false },
            { text: "Desidratação.", correct: false },
            { text: "Marinado.", correct: false },
            { text: "Cura com sal.", correct: true }
        ]
    },
    {
        question: "Além dos ovos, as práticas de conservação mencionadas também ajudam na conservação de:",
        answers: [
            { text: "Frutas.", correct: false },
            { text: "Verduras.", correct: false },
            { text: "Laticínios.", correct: true },
            { text: "Carnes vermelhas.", correct: false }
        ]
    },
    {
        question: "Qual dos métodos abaixo ajuda a conservar frutas por mais tempo sem alterar muito seu sabor?",
        answers: [
            { text: "Deixar as frutas em temperatura ambiente.", correct: false },
            { text: "Guardar em sacos plásticos fechados.", correct: false },
            { text: "Desidratar ou congelar as frutas, utilizando limão para evitar escurecimento", correct: true },
            { text: "Misturar as frutas com outros alimentos crus.", correct: false }
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
    nextButton.removeEventListener("click", handleNext);
    nextButton.addEventListener("click", handleNext);
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
 
function handleNext() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}
 
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
    nextButton.removeEventListener("click", handleNext);
    nextButton.addEventListener("click", startQuiz);
}
 
startQuiz();