const canvasAStar = document.getElementById("gameCanvasAStar");
const ctxAStar = canvasAStar.getContext("2d");

const snakeAStar = [{ x: GRID_WIDTH / 2, y: GRID_HEIGHT / 2 }];
let snakeDirAStar = RIGHT;
let appleAStar = initAppleAStar();

let scoreAStar = 0;
let ticksWithoutPathAStar = 0;

let gridAStar = new Array(GRID_WIDTH).fill(null).map(() => new Array(GRID_HEIGHT).fill(null));

function initAppleAStar() {
    let newApple = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT)
    };

    while (snakeAStar.some(segment => segment.x === newApple.x && segment.y === newApple.y)) {
        newApple = {
            x: Math.floor(Math.random() * GRID_WIDTH),
            y: Math.floor(Math.random() * GRID_HEIGHT)
        };
    }

    return newApple;
}

function drawAStar() {
    ctxAStar.clearRect(0, 0, canvasAStar.width, canvasAStar.height);

    // Draw snake
    snakeAStar.forEach((segment, index) => {
        ctxAStar.fillStyle = index === 0 ? "blue" : "green";
        ctxAStar.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    });

    // Draw apple
    ctxAStar.fillStyle = "red";
    ctxAStar.fillRect(appleAStar.x * GRID_SIZE, appleAStar.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);

    // Draw score
    ctxAStar.fillStyle = "black";
    ctxAStar.font = "20px Arial";
    ctxAStar.fillText("Score: " + scoreAStar, 10, 20);
}

function mainAStar() {
    const interval = 1000 / gameSpeed;

    const intervalId = setInterval(() => {
        drawAStar();

        let path = aStar(snakeAStar[0], appleAStar, snakeAStar);

        if (path.length !== 0) {
            ticksWithoutPathAStar = 0;
            snakeDirAStar = [path[0].x - snakeAStar[0].x, path[0].y - snakeAStar[0].y];
        } else {
            ticksWithoutPathAStar++;
            if (ticksWithoutPathAStar >= MAX_TICKS_WITHOUT_PATH) {
                let nextCell = findBestEmptyCellAStar(snakeAStar[0]);
                snakeDirAStar = [nextCell.x - snakeAStar[0].x, nextCell.y - snakeAStar[0].y];
            }
        }

        let head = {
            x: snakeAStar[0].x + snakeDirAStar[0],
            y: snakeAStar[0].y + snakeDirAStar[1]
        };

        snakeAStar.unshift(head);

        // Check collision
        if (
            head.x < 0 || head.x >= GRID_WIDTH ||
            head.y < 0 || head.y >= GRID_HEIGHT ||
            snakeAStar.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
        ) {
            clearInterval(intervalId);
            gameOverAStar();
            return; // Stop game loop
        }

        // Check if apple is eaten
        if (head.x === appleAStar.x && head.y === appleAStar.y) {
            scoreAStar++;
            appleAStar = initAppleAStar();
        } else {
            snakeAStar.pop();
        }
    }, interval);
}

function gameOverAStar() {
    clearInterval(timerAStarInterval);
    document.getElementById('gameOverAStar').style.display = 'block';
    document.getElementById('scoreAStar').innerText = scoreAStar;
}

function aStar(start, goal, snake) {
    let openSet = [{ f: 0, g: 0, h: 0, node: start }];
    let cameFrom = {};
    let gScore = {};

    for (let x = 0; x < GRID_WIDTH; x++) {
        for (let y = 0; y < GRID_HEIGHT; y++) {
            gScore[`${x},${y}`] = Infinity;
        }
    }

    gScore[`${start.x},${start.y}`] = 0;

    while (openSet.length !== 0) {
        openSet.sort((a, b) => a.f - b.f);
        let current = openSet.shift().node;

        if (current.x === goal.x && current.y === goal.y) {
            let path = [];
            while (current.x !== start.x || current.y !== start.y) {
                path.unshift(current);
                current = cameFrom[`${current.x},${current.y}`];
            }
            return path;
        }

        const neighbors = [
            { x: current.x + UP[0], y: current.y + UP[1] },
            { x: current.x + DOWN[0], y: current.y + DOWN[1] },
            { x: current.x + LEFT[0], y: current.y + LEFT[1] },
            { x: current.x + RIGHT[0], y: current.y + RIGHT[1] }
        ];

        neighbors.forEach(neighbor => {
            if (
                neighbor.x >= 0 && neighbor.x < GRID_WIDTH &&
                neighbor.y >= 0 && neighbor.y < GRID_HEIGHT &&
                !snake.some(segment => segment.x === neighbor.x && segment.y === neighbor.y)
            ) {
                let tentativeGScore = gScore[`${current.x},${current.y}`] + 1;
                let hScore = Math.abs(neighbor.x - goal.x) + Math.abs(neighbor.y - goal.y);
                let fScore = tentativeGScore + hScore;

                if (tentativeGScore < gScore[`${neighbor.x},${neighbor.y}`]) {
                    cameFrom[`${neighbor.x},${neighbor.y}`] = current;
                    gScore[`${neighbor.x},${neighbor.y}`] = tentativeGScore;
                    openSet.push({ f: fScore, g: tentativeGScore, h: hScore, node: neighbor });
                }
            }
        });
    }

    return [];
}

function findBestEmptyCellAStar(head) {
    let longestPath = -1;
    let bestMove = { x: head.x + snakeDirAStar[0], y: head.y + snakeDirAStar[1] };

    const neighbors = [
        { x: head.x + UP[0], y: head.y + UP[1] },
        { x: head.x + DOWN[0], y: head.y + DOWN[1] },
        { x: head.x + LEFT[0], y: head.y + LEFT[1] },
        { x: head.x + RIGHT[0], y: head.y + RIGHT[1] }
    ];

    neighbors.forEach(neighbor => {
        if (
            neighbor.x >= 0 && neighbor.x < GRID_WIDTH &&
            neighbor.y >= 0 && neighbor.y < GRID_HEIGHT &&
            !snakeAStar.some(segment => segment.x === neighbor.x && segment.y === neighbor.y)
        ) {
            let pathLength = calculatePotentialPathLengthAStar(neighbor);
            if (pathLength > longestPath) {
                longestPath = pathLength;
                bestMove = neighbor;
            }
        }
    });

    return bestMove;
}

function calculatePotentialPathLengthAStar(start) {
    let fringeSet = [{ cost: 0, node: start }];
    let cost = {};
    let potentialPathLength = 0;

    for (let x = 0; x < GRID_WIDTH; x++) {
        for (let y = 0; y < GRID_HEIGHT; y++) {
            cost[`${x},${y}`] = Infinity;
        }
    }

    cost[`${start.x},${start.y}`] = 0;

    while (fringeSet.length !== 0) {
        let current = fringeSet.shift().node;

        const neighbors = [
            { x: current.x + UP[0], y: current.y + UP[1] },
            { x: current.x + DOWN[0], y: current.y + DOWN[1] },
            { x: current.x + LEFT[0], y: current.y + LEFT[1] },
            { x: current.x + RIGHT[0], y: current.y + RIGHT[1] }
        ];

        neighbors.forEach(neighbor => {
            if (
                neighbor.x >= 0 && neighbor.x < GRID_WIDTH &&
                neighbor.y >= 0 && neighbor.y < GRID_HEIGHT &&
                !snakeAStar.some(segment => segment.x === neighbor.x && segment.y === neighbor.y)
            ) {
                let tentativeCost = cost[`${current.x},${current.y}`] + 1;

                if (tentativeCost < cost[`${neighbor.x},${neighbor.y}`]) {
                    cost[`${neighbor.x},${neighbor.y}`] = tentativeCost;
                    fringeSet.push({ cost: tentativeCost, node: neighbor });
                }
            }
        });

        if (cost[`${current.x},${current.y}`] > potentialPathLength) {
            potentialPathLength = cost[`${current.x},${current.y}`];
        }
    }

    return potentialPathLength;
}
