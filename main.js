document.getElementById('startButton').addEventListener('click', startGames);

let gameSpeed = 10;

function startGames() {
    document.getElementById('gameOverDijkstra').style.display = 'none';
    document.getElementById('gameOverAStar').style.display = 'none';

    startDijkstra();
    startAStar();
}

function updateSpeed() {
    if (timerDijkstraInterval) clearInterval(timerDijkstraInterval);
    if (timerAStarInterval) clearInterval(timerAStarInterval);
    startTimers();
}

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

// Timer for Dijkstra
let timerDijkstraInterval;
let timeDijkstra = 0;

function startDijkstra() {
    timeDijkstra = 0;
    clearInterval(timerDijkstraInterval);
    timerDijkstraInterval = setInterval(() => {
        timeDijkstra++;
        document.getElementById('timerDijkstra').innerText = 'Time: ' + formatTime(timeDijkstra);
    }, 1000);
    mainDijkstra();
}

// Timer for A*
let timerAStarInterval;
let timeAStar = 0;

function startAStar() {
    timeAStar = 0;
    clearInterval(timerAStarInterval);
    timerAStarInterval = setInterval(() => {
        timeAStar++;
        document.getElementById('timerAStar').innerText = 'Time: ' + formatTime(timeAStar);
    }, 1000);
    mainAStar();
}

// Modified game over functions
function gameOverDijkstra() {
    clearInterval(timerDijkstraInterval);
    document.getElementById('gameOverDijkstra').style.display = 'block';
    document.getElementById('scoreDijkstra').innerText = scoreDijkstra;
}

function gameOverAStar() {
    clearInterval(timerAStarInterval);
    document.getElementById('gameOverAStar').style.display = 'block';
    document.getElementById('scoreAStar').innerText = scoreAStar;
}
