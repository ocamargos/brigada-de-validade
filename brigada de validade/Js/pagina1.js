const BASE_WIDTH = 1200;
const BASE_HEIGHT = 400;

let gameSpeed = 5;
const maxGameSpeed = 15;
const speedIncrement = 1;

let gravity = 1;
let isJumping = false;
let velocityY = 0;
const dinoY = 220;
let gameOver = false;
let gameWon = false;
let gameStarted = false;

let currentQuestionIndex = 0;
let perguntaRespondida = false;
let showSucessMessage = false;
const sucessMessage = "RESPOSTA CORRETA";

let score = 0;
let scoreAcertos = 0;
let scoreErros = 0;

const DISTANCE_TO_DINO = 1100;
let distanceTraveled = 0;

let lastTime = 0;
let shakeTime = 0;

let canvas, ctx;

const dino = { x: 50, y: dinoY, width: 50, height: 60, color: "#4CAF50" };
const spike = {
    x: BASE_WIDTH + 100,
    y: 250,
    width: 30,
    height: 50,
    color: "#b33a3a",
};

const perguntas = [
    {
        texto: "Arroz integral dura mais que arroz branco? (V/F)",
        resposta: false,
    },
    { texto: "O mel nunca estraga? (V/F)", resposta: true },
    { texto: "Todos os óleos vegetais duram até 1 ano. (V/F)", resposta: true },
    { texto: "Feijão cru dura no máximo 1 ano. (V/F)", resposta: false },
    {
        texto: "Vinagre precisa ser refrigerado após aberto?(V/F)",
        resposta: false,
    },
    { texto: "Sal não tem data de validade.", resposta: true },
];

let bagImage = new Image();
let imagesLoaded = false;
const BAG_IMAGE_SRC = "../img/sacola.jpg";

let timelineItems;
let lineBackground;
let timeline;
let lineProgress;

function loadImagesAndStartGame() {
    bagImage.onload = () => {
        imagesLoaded = true;
        requestAnimationFrame(gameLoop);
    };
    bagImage.onerror = () => {
        imagesLoaded = false;
        requestAnimationFrame(gameLoop);
    };

    bagImage.src = BAG_IMAGE_SRC;

    if (bagImage.complete) {
        imagesLoaded = true;
        requestAnimationFrame(gameLoop);
    }
}

function setTimelineHeight() {
    if (timelineItems && lineBackground && timelineItems.length > 0) {
        const lastItem = timelineItems[timelineItems.length - 1];
        const lastItemTop = lastItem.offsetTop;
        const finalHeight = lastItemTop + lastItem.offsetHeight - 40;
        lineBackground.style.height = `${finalHeight}px`;
    }
}

function updateTimelineProgress() {
    if (timeline && lineProgress && lineBackground) {
        const timelineHeight = lineBackground.offsetHeight;
        const timelineTop = timeline.offsetTop;

        const scrollY = window.scrollY + window.innerHeight / 2;

        let progress = ((scrollY - timelineTop) / timelineHeight) * 100;
        progress = Math.max(0, Math.min(progress, 100));

        lineProgress.style.height = progress + "%";
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= perguntas.length) {
        return finalizeGame();
    }

    spike.x = BASE_WIDTH + 100;
    distanceTraveled = 0;
    perguntaRespondida = false;
    showSucessMessage = false;
}

function finalizeGame() {
    gameWon = scoreAcertos > scoreErros;
    gameOver = true;
}

function handleAnswer(isJump) {
    if (perguntaRespondida || gameOver || !gameStarted) return;
    perguntaRespondida = true;

    const correta = perguntas[currentQuestionIndex].resposta;
    const acertou = (isJump && correta) || (!isJump && !correta);

    if (acertou) {
        scoreAcertos++;
        score += 10;
        showSucessMessage = true;

        if (gameSpeed < maxGameSpeed) {
            gameSpeed = Math.min(maxGameSpeed, gameSpeed + speedIncrement);
        }

        spike.x = BASE_WIDTH + 300;

        setTimeout(() => {
            showSucessMessage = false;
            nextQuestion();
        }, 800);
    } else {
        scoreErros++;
        shakeTime = 500;

        setTimeout(() => {
            finalizeGame();
        }, 500);
    }
}

function restartGame() {
    gameSpeed = 5;
    score = 0;
    scoreAcertos = 0;
    scoreErros = 0;
    currentQuestionIndex = 0;
    perguntaRespondida = false;
    showSucessMessage = false;
    gameOver = false;
    gameWon = false;
    gameStarted = false;

    spike.x = BASE_WIDTH + 100;

    const startButton = document.getElementById("startButton");
    if (startButton) startButton.style.display = "inline-block";
}

function resizeCanvas() {
    const container = document.getElementById("#quiz-jogo");
    if (!container || !canvas) return;

    const containerWidth = container.clientWidth;
    const containerHeight = (BASE_HEIGHT / BASE_WIDTH) * containerWidth;

    canvas.width = containerWidth;
    canvas.height = containerHeight;

    const scaleX = containerWidth / BASE_WIDTH;
    const scaleY = containerHeight / BASE_HEIGHT;

    ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
}

function drawDino(time) {
    const isFalling = velocityY > 0 && dino.y < dinoY;

    ctx.save();
    ctx.translate(dino.x, dino.y);

    if (isJumping && !isFalling) {
        ctx.fillStyle = "#9C27B0";
    } else if (isFalling) {
        ctx.fillStyle = "#FF9800";
    } else {
        ctx.fillStyle = dino.color;
    }

    ctx.fillRect(0, 0, dino.width * 0.6, dino.height * 0.8);

    ctx.beginPath();
    ctx.arc(dino.width * 0.3, -10, 10, 0, Math.PI * 2);
    ctx.fill();

    const sway = Math.sin(time / 200) * 5;
    const bagRectWidth = 20;
    const bagRectHeight = 30;
    const bagRectY = 25;

    ctx.fillStyle = "#ffdd66";
    const leftBagX = -5 + sway;
    ctx.fillRect(leftBagX, bagRectY, bagRectWidth, bagRectHeight);

    if (imagesLoaded) {
        const imageWidth = 12;
        const imageHeight = 18;
        const imageOffsetX = (bagRectWidth - imageWidth) / 2;
        const imageOffsetY = (bagRectHeight - imageHeight) / 2;
        ctx.drawImage(
            bagImage,
            leftBagX + imageOffsetX,
            bagRectY + imageOffsetY,
            imageWidth,
            imageHeight
        );
    }

    ctx.fillStyle = "#ffdd66";
    const rightBagX = dino.width * 0.6 - 3 - sway;
    ctx.fillRect(rightBagX, bagRectY, bagRectWidth, bagRectHeight);

    if (imagesLoaded) {
        const imageWidth = 12;
        const imageHeight = 18;
        const imageOffsetX = (bagRectWidth - imageWidth) / 2;
        const imageOffsetY = (bagRectHeight - imageHeight) / 2;
        ctx.drawImage(
            bagImage,
            rightBagX + imageOffsetX,
            bagRectY + imageOffsetY,
            imageWidth,
            imageHeight
        );
    }

    // Pernas
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 4;
    ctx.beginPath();
    const legMove = isJumping ? 0 : Math.sin(time / 100) * 5;
    ctx.moveTo(5, dino.height * 0.8);
    ctx.lineTo(5 + legMove, dino.height);
    ctx.moveTo(20, dino.height * 0.8);
    ctx.lineTo(20 - legMove, dino.height);
    ctx.stroke();

    ctx.restore();
}

function drawSpike() {
    ctx.save();
    ctx.translate(spike.x, spike.y);

    ctx.fillStyle = spike.color;
    ctx.beginPath();
    ctx.moveTo(0, spike.height);
    ctx.lineTo(spike.width / 2, 0);
    ctx.lineTo(spike.width, spike.height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "10px Arial";
    ctx.textAlign = "left";
    ctx.fillText("FAKE", 4, spike.height - 8);
    ctx.restore();
}

function drawTensionBar() {
    const spikeStartPos = BASE_WIDTH + 100;

    let currentDistance = spikeStartPos - spike.x;

    let percent = currentDistance / DISTANCE_TO_DINO;
    percent = Math.min(1, Math.max(0, percent));

    const barWidth = BASE_WIDTH * percent;

    ctx.fillStyle = percent < 0.75 ? "#4caf50" : "#e74c3c";
    ctx.fillRect(0, 0, barWidth, 6);
}

function drawHUD() {
    ctx.fillStyle = "#000";
    ctx.font = "18px Arial";
    ctx.textAlign = "left";
    ctx.fillText(
        `Acertos: ${scoreAcertos} | Erros: ${scoreErros} | Velocidade: ${gameSpeed.toFixed(
            1
        )}`,
        10,
        30
    );
}

function drawGameOver() {
    const startButton = document.getElementById("startButton");
    if (startButton) {
        startButton.textContent = "Reiniciar 🔄";
        startButton.style.display = "block";
    }

    const message = gameWon ? "PARABÉNS! VOCÊ VENCEU!" : "FIM DE JOGO!";
    const finalScore = scoreAcertos * 10;

    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

    ctx.fillStyle = gameWon ? "#4CAF50" : "#fff";
    ctx.textAlign = "center";
    ctx.font = "bold 60px Arial";
    ctx.fillText(message, 460, 160);

    ctx.font = "30px Arial";
    ctx.fillText(`Pontuação Final: ${finalScore}`, 460, 250);

    ctx.font = "20px Arial";
    ctx.fillStyle = "#ccc";
    ctx.fillText("Pressione ENTER para jogar novamente", 460, 200);
}

function gameLoop(time) {
    if (!lastTime) lastTime = time;
    const delta = time - lastTime;
    lastTime = time;

    const normalizedSpeedFactor = delta / 16.66;

    if (shakeTime > 0) {
        const shakeIntensity = 5 * (shakeTime / 500);
        ctx.setTransform(
            ctx._scale || 1,
            0,
            0,
            ctx._scale || 1,
            Math.random() * shakeIntensity * (ctx._scale || 1),
            Math.random() * shakeIntensity * (ctx._scale || 1)
        );
        shakeTime -= delta;
    } else {
        ctx.setTransform(ctx._scale || 1, 0, 0, ctx._scale || 1, 0, 0);
    }

    ctx.setTransform(
        canvas.width / BASE_WIDTH,
        0,
        0,
        canvas.height / BASE_HEIGHT,
        0,
        0
    );

    ctx.clearRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

    if (gameOver) {
        drawGameOver();
        return requestAnimationFrame(gameLoop);
    }

    if (!gameStarted) {
        ctx.fillStyle = "#000";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Pressione INICIAR (ou ESPAÇO) para começar", 460, 160);
        return requestAnimationFrame(gameLoop);
    }

    spike.x -= gameSpeed * normalizedSpeedFactor;

    if (isJumping) {
        velocityY += gravity * normalizedSpeedFactor;
        dino.y += velocityY * normalizedSpeedFactor;
        if (dino.y >= dinoY) {
            dino.y = dinoY;
            velocityY = 0;
            isJumping = false;
        }
    }

    drawTensionBar();
    drawHUD();

    ctx.beginPath();
    ctx.moveTo(0, dinoY + dino.height);
    ctx.lineTo(BASE_WIDTH, dinoY + dino.height);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    drawDino(time);
    drawSpike();

    if (!perguntaRespondida) {
        ctx.fillStyle = "#000";
        ctx.font = "24px Arial";
        ctx.textAlign = "left";
        ctx.fillText(perguntas[currentQuestionIndex].texto, 80, 80);
    }

    const isColliding =
        !perguntaRespondida &&
        spike.x < dino.x + dino.width &&
        spike.x + spike.width > dino.x &&
        dino.y + dino.height >= spike.y;

    if (isColliding) {
        handleAnswer(false);
    }

    if (spike.x + spike.width < 0 && !perguntaRespondida) {
        handleAnswer(false);
    } else if (spike.x + spike.width < 0 && perguntaRespondida) {
        spike.x = BASE_WIDTH + 100;
    }

    if (showSucessMessage) {
        ctx.save();
        ctx.translate(BASE_WIDTH / 2, 120);
        const pulse = 1 + 0.08 * Math.sin(time / 100);
        ctx.scale(pulse, pulse);
        ctx.fillStyle = "#00FF00";
        ctx.font = "bold 30px Arial";
        ctx.textAlign = "center";
        ctx.fillText(sucessMessage, 0, 0);
        ctx.restore();
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("gameCanvas");
    if (!canvas) {
        console.error("Canvas não encontrado (#gameCanvas).");
        return;
    }
    ctx = canvas.getContext("2d");

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const startButton = document.getElementById("startButton");
    const trueBtn = document.getElementById("trueBtn");
    const falseBtn = document.getElementById("falseBtn");

    // 🔹 Função principal de iniciar ou reiniciar
    const startGameAction = () => {
        if (gameOver) {
            // Reiniciar o jogo
            restartGame();
            if (startButton) startButton.textContent = "Iniciar"; // volta ao texto original
            if (startButton) startButton.style.display = "none";
            return;
        }

        if (!gameStarted) {
            // Iniciar o jogo pela primeira vez
            if (startButton) startButton.style.display = "none";
            gameStarted = true;
            nextQuestion();
        }
    };

    timeline = document.getElementById("timeline");
    lineBackground = document.querySelector(".line-background");
    lineProgress = document.querySelector(".line-progress");
    timelineItems = document.querySelectorAll(".item");

    setTimelineHeight();
    window.addEventListener("scroll", updateTimelineProgress);
    loadImagesAndStartGame();

    // 🔹 Clique no botão principal
    if (startButton) startButton.addEventListener("click", startGameAction);

    // 🔹 Botão "Pular" (verdadeiro)
    if (trueBtn)
        trueBtn.addEventListener("click", () => {
            if (!gameStarted) return startGameAction();
            if (!isJumping && !gameOver) {
                isJumping = true;
                velocityY = -15;
                handleAnswer(true);
            }
        });

    // 🔹 Botão "Ficar" (falso)
    if (falseBtn)
        falseBtn.addEventListener("click", () => {
            if (!gameStarted) return startGameAction();
            if (!isJumping && !gameOver) {
                handleAnswer(false);
            }
        });

    // 🔹 Controles de teclado (PC)
    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            if (!gameStarted) {
                startGameAction();
            } else if (!isJumping && !gameOver) {
                isJumping = true;
                velocityY = -15;
                handleAnswer(true);
            }
        } else if (e.code === "Enter" && gameOver) {
            restartGame();
            if (startButton) startButton.textContent = "Iniciar";
            if (startButton) startButton.style.display = "none";
        }
    });
});