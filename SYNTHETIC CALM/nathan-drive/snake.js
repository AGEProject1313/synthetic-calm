const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const message = document.getElementById("message");
const startButton = document.getElementById("startButton");
const unlockPanel = document.getElementById("unlockPanel");

const cell = 12;
const cells = canvas.width / cell;
const unlockScore = 10;

let snake;
let food;
let dir;
let nextDir;
let score;
let best = Number(localStorage.getItem("retroChallengeBest") || 0);
let timer = null;
let speed = 150;
let running = false;
let unlocked = localStorage.getItem("retroChallengeUnlocked") === "true";

bestEl.textContent = best;
if (unlocked) unlockPanel.classList.remove("hidden");

function resetGame() {
    snake = [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    speed = 150;
    scoreEl.textContent = score;
    placeFood();
    draw();
}

function placeFood() {
    do {
        food = {
            x: Math.floor(Math.random() * cells),
            y: Math.floor(Math.random() * cells)
        };
    } while (snake.some(part => part.x === food.x && part.y === food.y));
}

function drawSnakeCell(x, y) {
    ctx.fillStyle = "#17301d";
    ctx.fillRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2);
}

function drawFoodCell(x, y) {
    ctx.strokeStyle = "#17301d";
    ctx.lineWidth = 2;
    ctx.strokeRect(x * cell + 3, y * cell + 3, cell - 6, cell - 6);
    ctx.fillStyle = "#17301d";
    ctx.fillRect(x * cell + 5, y * cell + 5, cell - 10, cell - 10);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(23,48,29,0.12)";
    ctx.lineWidth = 1;

    for (let i = 0; i <= cells; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cell, 0);
        ctx.lineTo(i * cell, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cell);
        ctx.lineTo(canvas.width, i * cell);
        ctx.stroke();
    }

    snake.forEach(part => drawSnakeCell(part.x, part.y));
    drawFoodCell(food.x, food.y);
}

function tick() {
    dir = nextDir;

    const head = {
        x: snake[0].x + dir.x,
        y: snake[0].y + dir.y
    };

    if (
        head.x < 0 || head.x >= cells ||
        head.y < 0 || head.y >= cells ||
        snake.some(part => part.x === head.x && part.y === head.y)
    ) {
        endGame("GAME OVER");
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 1;
        scoreEl.textContent = score;
        placeFood();

        if (score > best) {
            best = score;
            localStorage.setItem("retroChallengeBest", best);
            bestEl.textContent = best;
        }

        if (score >= unlockScore) {
            unlockCredentials();
            return;
        }

        if (speed > 82 && score % 3 === 0) {
            speed -= 12;
            restartTimer();
        }
    } else {
        snake.pop();
    }

    draw();
}

function restartTimer() {
    clearInterval(timer);
    timer = setInterval(tick, speed);
}

function startGame() {
    resetGame();
    running = true;
    message.classList.add("hidden");
    restartTimer();

    if (typeof setProgress === "function") {
        setProgress("retro_challenge_started");
    }
}

function endGame(text) {
    clearInterval(timer);
    running = false;
    message.textContent = text;
    message.classList.remove("hidden");
}

function unlockCredentials() {
    clearInterval(timer);
    running = false;
    unlocked = true;
    localStorage.setItem("retroChallengeUnlocked", "true");
    unlockPanel.classList.remove("hidden");
    message.textContent = "ACCESS UNLOCKED";
    message.classList.remove("hidden");
    draw();

    if (typeof setProgress === "function") {
        setProgress("giulia_credentials_unlocked");
    }
}

function setDirection(direction) {
    const map = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 }
    };

    const selected = map[direction];
    if (!selected) return;

    if (selected.x + dir.x === 0 && selected.y + dir.y === 0) return;
    nextDir = selected;
}

startButton.addEventListener("click", startGame);

function bindDirectionButton(button) {
    const direction = button.dataset.dir;
    button.addEventListener("click", event => {
        event.preventDefault();
        setDirection(direction);
    });
    button.addEventListener("touchstart", event => {
        event.preventDefault();
        setDirection(direction);
    }, { passive: false });
}

document.querySelectorAll("[data-dir]").forEach(bindDirectionButton);

document.addEventListener("keydown", event => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", " "].includes(event.key)) {
        event.preventDefault();
    }

    if (event.key === "ArrowUp") setDirection("up");
    if (event.key === "ArrowDown") setDirection("down");
    if (event.key === "ArrowLeft") setDirection("left");
    if (event.key === "ArrowRight") setDirection("right");
    if ((event.key === "Enter" || event.key === " ") && !running) startGame();
});

let touchStartX = null;
let touchStartY = null;

canvas.addEventListener("touchstart", event => {
    event.preventDefault();
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, { passive: false });

canvas.addEventListener("touchend", event => {
    event.preventDefault();
    if (touchStartX === null || touchStartY === null) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;

    if (Math.abs(dx) > Math.abs(dy)) {
        setDirection(dx > 0 ? "right" : "left");
    } else {
        setDirection(dy > 0 ? "down" : "up");
    }

    touchStartX = null;
    touchStartY = null;
}, { passive: false });

resetGame();
