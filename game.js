document.getElementById('start-button').addEventListener('click', startGame);

let score = 0;
let gameSpeed = 5;
let isJumping = false;
let gameInterval;
let obstacles = [];
let player = document.getElementById('player');
let scoreDisplay = document.getElementById('score');
let gameContainer = document.getElementById('game-container');
let homeScreen = document.getElementById('home-screen');

function startGame() {
    homeScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    score = 0;
    gameSpeed = 5;
    scoreDisplay.textContent = `Score: ${score}`;
    player.style.bottom = '0';
    obstacles.forEach(obstacle => obstacle.remove());
    obstacles = [];
    gameInterval = setInterval(updateGame, 20);
    document.addEventListener('keydown', jump);
}

function jump(event) {
    if (event.code === 'Space' && !isJumping) {
        isJumping = true;
        let jumpHeight = 0;
        let jumpInterval = setInterval(() => {
            jumpHeight += 5;
            player.style.bottom = jumpHeight + 'px';
            if (jumpHeight >= 100) {
                clearInterval(jumpInterval);
                let fallInterval = setInterval(() => {
                    jumpHeight -= 5;
                    player.style.bottom = jumpHeight + 'px';
                    if (jumpHeight <= 0) {
                        clearInterval(fallInterval);
                        isJumping = false;
                    }
                }, 20);
            }
        }, 20);
    }
}

function updateGame() {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;

    if (score % 100 === 0) {
        gameSpeed += 0.5;
    }

    if (Math.random() < 0.02) {
        createObstacle();
    }

    obstacles.forEach(obstacle => {
        let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
        obstacle.style.left = (obstacleLeft - gameSpeed) + 'px';

        if (obstacleLeft < -20) {
            obstacle.remove();
            obstacles = obstacles.filter(obs => obs !== obstacle);
        } else if (
            obstacleLeft < 100 &&
            obstacleLeft > 50 &&
            parseInt(window.getComputedStyle(player).getPropertyValue('bottom')) < 50
        ) {
            endGame();
        }
    });
}

function createObstacle() {
    let obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    obstacle.style.left = '800px';
    obstacle.style.bottom = '0';
    obstacle.style.width = '20px';
    obstacle.style.height = '50px';
    obstacle.style.backgroundColor = '#e74c3c';
    obstacle.style.position = 'absolute';
    gameContainer.appendChild(obstacle);
    obstacles.push(obstacle);
}

function endGame() {
    clearInterval(gameInterval);
    document.removeEventListener('keydown', jump);
    alert(`Game Over! Votre score est ${score}`);
    homeScreen.style.display = 'block';
    gameContainer.style.display = 'none';
}
