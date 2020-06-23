var canvas = document.getElementById('Snake');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;
var countLimit = 6;

var snake = {
    x: 160,
    y: 160,
    speedX: grid,
    speedY: 0,
    cells: [],
    maxCells: 3,
    turning: false,
    turnTimer: 1
};
var apple = {
    x: 320,
    y: 320
};
var environment = {
    score: 0,
    play: false,
    hasPaused: false,
    timesPaused: 0,
    difficulty: 1
};

// Used to place a new apple
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Play the game
function loop() {
    // Display different things when not playing depending on when in the game it is
    // Press P to Start before the game has been started
    if (environment.play === false && environment.timesPaused >= 1) {
        context.fillStyle = 'white';
        context.fillRect((grid*23)/2, (grid*21)/2, grid-6, grid*4);
        context.fillRect((grid*27)/2, (grid*21)/2, grid-6, grid*4);
    }
    // Pause symbol while the game is in play
    else if (environment.play === false && environment.timesPaused === 0) {
        context.fillStyle = 'white';
        context.font = "25px Arial";
        context.fillText("Press P to Start", (grid*15)/2, (grid*25)/2)
    }
    // X when the player looses
    else if (environment.play === false && environment.timesPaused === -1) {
        context.fillStyle = 'white';
        context.font = "80px Arial";
        context.fillText("X", (grid*23)/2, (grid*28)/2)
        context.font = "25px Arial";
        context.fillText("Press P to Reset", (grid*15)/2, (grid*33)/2)
    }
    // Game body
    else if (environment.play === true) {
        requestAnimationFrame(loop);
    
        // Control frame rate
        if (environment.hasPaused === false) {
            // Change the speed of the snake (the smaller the number the faster the snake is)
            if (environment.difficulty === 0) {
                countLimit = 10;
            }
            else if (environment.difficulty === 1) {
                countLimit = 6;
            }
            else if (environment.difficulty === 2) {
                countLimit = 4;
            }
        }
        // Adjust frame rate to control for pausing and unpausing
        else if (environment.hasPaused === true) {
            if (environment.difficulty === 0) {
                countLimit = 5;
            }
            else if (environment.difficulty === 1) {
                countLimit = 3;
            }
            else if (environment.difficulty === 2) {
                countLimit = 2;
            }
        }
        // Loop the game at the set frame rate
        if (count++ < countLimit) {
            return;
        }
        count = 0;

        // Delay turning to prevent the player from running into themselves after doing a 180
        if (snake.turning === true) {
            snake.turnTimer--;
        }
        if (snake.turnTimer <= 0) {
            snake.turning = false;
            snake.turnTimer = 1;
        }

        // Display score and canvas
        document.getElementById("snakeScore").innerHTML = environment.score;
        if (environment.difficulty === 0) {
            document.getElementById("snakeDifficulty").innerHTML = "Easy";
        }
        else if (environment.difficulty === 1) {
            document.getElementById("snakeDifficulty").innerHTML = "Normal";
        }
        else if (environment.difficulty === 2) {
            document.getElementById("snakeDifficulty").innerHTML = "Hard";
        }
        context.clearRect(0,0,canvas.width,canvas.height);

        // Move the snake
        snake.x += snake.speedX;
        snake.y += snake.speedY;

        snake.cells.unshift({x: snake.x, y: snake.y});
        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
        }

        // Draw apple as red and snake as green
        context.fillStyle = 'red';
        context.fillRect(apple.x, apple.y, grid-1, grid-1);

        context.fillStyle = 'lightgreen';
        snake.cells.forEach(function(cell, index) {
            context.fillRect(cell.x, cell.y, grid-1, grid-1);  

            // Eat the apple
            if (cell.x === apple.x && cell.y === apple.y) {
                environment.score++;
                snake.maxCells++;
                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 25) * grid;
            }

            for (var i = index + 1; i < snake.cells.length; i++) {
                // Hit tail or walls
                if ((cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) || (snake.x < 0 || snake.x >= canvas.width) || (snake.y < 0 || snake.y >= canvas.height)) {
                    // Reset the snake
                    snake.x = 160;
                    snake.y = 160;
                    snake.cells = [];
                    snake.maxCells = 3;
                    snake.speedX = grid;
                    snake.speedY = 0;
                    environment.score = 0;
                    // Reset the apple
                    apple.x = getRandomInt(0, 25) * grid;
                    apple.y = getRandomInt(0, 25) * grid; 
                    // Stop playing the game
                    environment.play = false;
                    environment.timesPaused = -1;
                    context.fillStyle = 'red';
                    context.fillRect(cell.x, cell.y, grid-1, grid-1);  
                }
            }
        });
    }  
}


// Snake movement controls (arrow keys)
document.addEventListener('keydown', function(e) {
    e.preventDefault()
    // Arrow keys - movement
    if (e.which === 37 && snake.speedX === 0 && snake.turning === false) {
        snake.turning = true;
        snake.speedX = -grid;
        snake.speedY = 0;
    }
    else if (e.which === 38 && snake.speedY === 0 && snake.turning === false) {
        snake.turning = true;
        snake.speedY = -grid;
        snake.speedX = 0;
    }
    else if (e.which === 39 && snake.speedX === 0 && snake.turning === false) {
        snake.turning = true;
        snake.speedX = grid;
        snake.speedY = 0;
    }
    else if (e.which === 40 && snake.speedY === 0 && snake.turning === false) {
        snake.turning = true;
        snake.speedY = grid;
        snake.speedX = 0;
        }
    // P - pause control
    else if (e.which === 80 && environment.play === true) {
        // Control what message desplays while the game is not playing (depending on the number of times paused)
        if (environment.timesPaused === -1) {
            environment.timesPaused = 1;
        }
        else {
            environment.timesPaused++;
        }
        // Pause the game
        environment.play = false;
    }
    else if (e.which === 80 && environment.play === false) {
        environment.play = true;
        requestAnimationFrame(loop);
        // Change the speed of the snake when the game unpauses (the lower the number the faster the speed)
        environment.hasPaused = true;
        if (environment.difficulty === 0) {
            countLimit = 5;
        }
        else if (environment.difficulty === 1) {
            countLimit = 3;
        }
        else if (environment.difficulty === 2) {
            countLimit = 2;
        }
    }
});

// Loop the game (if the game is not paused)
if (environment.play === true) {
    requestAnimationFrame(loop);
}
