const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');

const boardSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = randomFood();
let direction = { x: 0, y: 0 };
let score = 0;
let gameInterval = null;
let gameRunning = false;

function update() {
    moveSnake();
    if (isGameOver()) {
        alert(`Fim de jogo! Sua pontuação: ${score}`);
        clearInterval(gameInterval);
        location.reload();
    }
    draw();
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;
        food = randomFood();
    } else {
        snake.pop();
    }
}

function draw() {
    board.innerHTML = '';
    snake.forEach(segment => {
        const div = document.createElement('div');
        div.style.gridRowStart = segment.y;
        div.style.gridColumnStart = segment.x;
        div.classList.add('snake');
        board.appendChild(div);
    });

    const foodDiv = document.createElement('div');
    foodDiv.style.gridRowStart = food.y;
    foodDiv.style.gridColumnStart = food.x;
    foodDiv.classList.add('food');
    board.appendChild(foodDiv);
}

function randomFood() {
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * boardSize) + 1,
            y: Math.floor(Math.random() * boardSize) + 1
        };
        if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) break;
    }
    return newFood;
}

function isGameOver() {
    const head = snake[0];
    return (
        head.x < 1 || head.x > boardSize ||
        head.y < 1 || head.y > boardSize ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
}

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
        case ' ':
            e.preventDefault();
            togglePause();
            break;
    }
});

function startGame() {
    if (!gameRunning) {
        const difficulty = document.getElementById('difficulty').value;
        gameInterval = setInterval(update, parseInt(difficulty));
        gameRunning = true;
    }
}

const pauseBtn = document.getElementById('pause-btn');

function togglePause() {
    if (gameRunning) {
        clearInterval(gameInterval);
        gameRunning = false;
        pauseBtn.textContent = 'Continuar';
    } else {
        const difficulty = document.getElementById('difficulty').value;
        gameInterval = setInterval(update, parseInt(difficulty));
        gameRunning = true;
        pauseBtn.textContent = 'Pausar';
    }
}

function restartGame() {
    clearInterval(gameInterval);
    snake = [{ x: 10, y: 10 }];
    food = randomFood();
    direction = { x: 0, y: 0 };
    score = 0;
    scoreDisplay.textContent = score;
    draw();
    gameRunning = false;
}

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', restartGame);
pauseBtn.addEventListener('click', togglePause);