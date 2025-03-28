// Board setup
var blockSize = 25;
var rows = 20;
var columns = 20;
var board;
var context;

// Snake head
var snakeX = blockSize * 6;
var snakeY = blockSize * 6;

// Snake food
var foodX;
var foodY;

// Velocity
var velocityX = 0;
var velocityY = 0;

var snakeBody = [];
var gameover = false;

window.onload = function () {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = columns * blockSize;
    context = board.getContext("2d");

    placeFood();
    document.addEventListener("keyup", changeDirection);
    setInterval(update, 1000 / 10);
};

function changeDirection(e) {
    if (gameover) return; // Stop changing direction after game over

    if (e.code == "ArrowUp" && velocityY == 0) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.code == "ArrowDown" && velocityY == 0) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.code == "ArrowLeft" && velocityX == 0) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.code == "ArrowRight" && velocityX == 0) {
        velocityX = 1;
        velocityY = 0;
    }
}

function update() {
    if (gameover) return; // Stop the game loop when game is over

    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    // Draw food
    context.fillStyle = "yellow";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    // Check if snake eats food
    if (snakeX === foodX && snakeY === foodY) {
        snakeBody.push([foodX, foodY]); // Grow snake
        placeFood();
    }

    // Move the snake body
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = [...snakeBody[i - 1]];
    }
    if (snakeBody.length > 0) {
        snakeBody[0] = [snakeX, snakeY];
    }

    // Move snake head
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    // Check for wall collision
    if (snakeX < 0 || snakeY < 0 || snakeX >= columns * blockSize || snakeY >= rows * blockSize) {
        gameOver();
    }

    // Check for self collision
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
            gameOver();
        }
    }

    // Draw snake body
    context.fillStyle = "purple";
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    // Draw snake head
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
}

function placeFood() {
    let validFoodPosition = false;
    while (!validFoodPosition) {
        foodX = Math.floor(Math.random() * columns) * blockSize;
        foodY = Math.floor(Math.random() * rows) * blockSize;

        // Ensure food does not spawn inside the snake
        validFoodPosition = !snakeBody.some(segment => segment[0] === foodX && segment[1] === foodY);
    }
}

function gameOver() {
    gameover = true;
    alert("Game Over! Refresh the page to play again.");
}
