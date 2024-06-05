const GRID_SIZE = 20;
const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
const MAX_TICKS_WITHOUT_PATH = 1;

const UP = [0, -1];
const DOWN = [0, 1];
const LEFT = [-1, 0];
const RIGHT = [1, 0];

const canvasDijkstra = document.getElementById("gameCanvasDijkstra");
const ctxDijkstra = canvasDijkstra.getContext("2d");

const snakeDijkstra = [{ x: GRID_WIDTH / 2, y: GRID_HEIGHT / 2 }];
let snakeDirDijkstra = RIGHT;
let appleDijkstra = initAppleDijkstra();

let scoreDijkstra = 0;
let ticksWithoutPathDijkstra = 0;

let gridDijkstra = new Array(GRID_WIDTH).fill(null).map(() => new Array(GRID_HEIGHT).fill(null));

function initAppleDijkstra() {
    let newApple = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT)
    };

    while (snakeDijkstra.some(segment => segment.x === newApple.x && segment.y === newApple.y)) {
        newApple = {
            x: Math.floor(Math.random() * GRID_WIDTH),
            y: Math.floor(Math.random() * GRID_HEIGHT)
        };
    }

    return newApple;
}

function updateGridDijkstra(x, y, value) {
    gridDijkstra[y][x] = value;
}

function drawDijkstra() {
    ctxDijkstra.clearRect(0, 0, canvasDijkstra.width, canvasDijkstra.height);

    // Draw snake
    snakeDijkstra.forEach((segment, index) => {
        ctxDijkstra.fillStyle = index === 0 ? "blue" : "green";
        ctxDijkstra.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    });

    // Draw apple
    ctxDijkstra.fillStyle = "red";
    ctxDijkstra.fillRect(appleDijkstra.x * GRID_SIZE, appleDijkstra.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);

    // Draw score
    ctxDijkstra.fillStyle = "black";
    ctxDijkstra.font = "20px Arial";
    ctxDijkstra.fillText("Score: " + scoreDijkstra, 10, 20);
}

function mainDijkstra() {
    const interval = 1000 / gameSpeed;

    const intervalId = setInterval(() => {
        drawDijkstra();

        let path = dijkstra(snakeDijkstra[0], appleDijkstra, snakeDijkstra);

        if (path.length !== 0) {
            ticksWithoutPathDijkstra = 0;
            snakeDirDijkstra = [path[0].x - snakeDijkstra[0].x, path[0].y - snakeDijkstra[0].y];
        } else {
            ticksWithoutPathDijkstra++;
            if (ticksWithoutPathDijkstra >= MAX_TICKS_WITHOUT_PATH) {
                let nextCell = findBestEmptyCellDijkstra(snakeDijkstra[0]);
                snakeDirDijkstra = [nextCell.x - snakeDijkstra[0].x, nextCell.y - snakeDijkstra[0].y];
            }
        }

        let head = {
            x: snakeDijkstra[0].x + snakeDirDijkstra[0],
            y: snakeDijkstra[0].y + snakeDirDijkstra[1]
        };

        snakeDijkstra.unshift(head);

        // Nabrak
        if (
            head.x < 0 || head.x >= GRID_WIDTH ||
            head.y < 0 || head.y >= GRID_HEIGHT ||
            snakeDijkstra.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
        ) {
            clearInterval(intervalId);
            gameOverDijkstra();
            return; // Stop game loop
        }

        // Makan
        if (head.x === appleDijkstra.x && head.y === appleDijkstra.y) {
            scoreDijkstra++;
            appleDijkstra = initAppleDijkstra();
        } else {
            snakeDijkstra.pop();
        }
    }, interval);
}

function gameOverDijkstra() {
    clearInterval(timerDijkstraInterval);
    document.getElementById('gameOverDijkstra').style.display = 'block';
    document.getElementById('scoreDijkstra').innerText = scoreDijkstra;
}

function dijkstra(start, goal, snake) {
    let fringeSet = [{ cost: 0, node: start }];
    let cameFrom = {};
    let cost = {};

    for (let x = 0; x < GRID_WIDTH; x++) {
        for (let y = 0; y < GRID_HEIGHT; y++) {
            cost[`${x},${y}`] = Infinity;
        }
    }

    cost[`${start.x},${start.y}`] = 0;

    while (fringeSet.length !== 0) {
        let current = fringeSet.shift().node;

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
                let tentativeCost = cost[`${current.x},${current.y}`] + 1;

                if (tentativeCost < cost[`${neighbor.x},${neighbor.y}`]) {
                    cameFrom[`${neighbor.x},${neighbor.y}`] = current;
                    cost[`${neighbor.x},${neighbor.y}`] = tentativeCost;
                    fringeSet.push({ cost: tentativeCost, node: neighbor });
                    fringeSet.sort((a, b) => a.cost - b.cost);
                }
            }
        });
    }

    return [];
}

function findBestEmptyCellDijkstra(head) {
    let longestPath = -1;
    let bestMove = { x: head.x + snakeDirDijkstra[0], y: head.y + snakeDirDijkstra[1] };

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
            !snakeDijkstra.some(segment => segment.x === neighbor.x && segment.y === neighbor.y)
        ) {
            let pathLength = calculatePotentialPathLengthDijkstra(neighbor);
            if (pathLength > longestPath) {
                longestPath = pathLength;
                bestMove = neighbor;
            }
        }
    });

    return bestMove;
}

function calculatePotentialPathLengthDijkstra(start) {
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
                !snakeDijkstra.some(segment => segment.x === neighbor.x && segment.y === neighbor.y)
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
