const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const resetBtn = document.getElementById("reset-btn");
const scoreInput = document.getElementById("scoreInput");
let grid = [];
let revealed = []; // will be used to track what cells have been revealed so far
let gridSize = 10;
let cellSize = 400 / gridSize;
let mines = 10;
let firstMove = true;
let win = false;
let flagged = []; 
let min = 0;
let sec = 0;
let timer; 

let score = 1; // this will give the number of seconds it took to finish the game

drawGrid();
placeMines();
clickCell();
rightClickCell();

document.addEventListener("DOMContentLoaded", function () {
    const resultForm = document.getElementById("resultForm");
    const submitButton = document.getElementById("submitButton");

    
    submitButton.addEventListener("click", function (event) {
        event.preventDefault(); 
        let newScore = encodeURIComponent(score); 
        resultForm.action = `/catsweeper/result2?score=${newScore}`; 
        
        resultForm.submit(); // submit data to form 
    });
});
/**
 * Initialize the grid and "revealed" grid arrays to be empty and draw the grid on the canvas
 */
function drawGrid() {
    for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        revealed[i] = [];
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = 0;
            revealed[i][j] = false;
            ctx.fillStyle = "white";
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            ctx.strokeStyle = 'rgb(0,0,0)';
            ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
}


function clickCell() {
    canvas.addEventListener("click", function (event) {
        const x = Math.floor(event.offsetX / cellSize);
        const y = Math.floor(event.offsetY / cellSize);

        if (firstMove) {
            start();
            firstMove = false; 
        }

        if (x >= 0 && x < gridSize && y >= 0 && y < gridSize && !revealed[x][y]) {
            if (isMine(x, y)) {
                revealCells();
                clearInterval(timer);
                outcome = 'lose';
                score = 0;
                document.getElementById("outcome").innerText = "You Lose!";
                document.getElementById("submitButton").style.display = "inline";
                document.getElementById("score").style.display = "inline";
                document.getElementById("score").innerText = "Your score is: "+ score;
                
            } else {
                revealCell(x, y);
                if (checkWinCondition()) {
                    clearInterval(timer);
                    outcome = 'win';
                    score = min * 60 + sec;
                    document.getElementById("outcome").innerText = "You Win!";
                    document.getElementById("submitButton").style.display = "inline";
                    document.getElementById("score").style.display = "inline";
                    document.getElementById("score").innerText = "Your score is: "+ score;
                }
            }
        }
    });
}

function checkWinCondition() {
    let revealedCells = 0;    
    let possiblePlaying = gridSize * gridSize - mines;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (!isMine(i, j) && revealed[i][j]) {
                revealedCells++; 
            }
        }
    }
    return revealedCells === possiblePlaying;
}

for (let i = 0; i < gridSize; i++) {
    flagged[i] = [];
    for (let j = 0; j < gridSize; j++) {
        flagged[i][j] = false;
    }
}

function rightClickCell() {
    canvas.addEventListener("contextmenu", function (event) {
        event.preventDefault();
        const x = Math.floor(event.offsetX / cellSize);
        const y = Math.floor(event.offsetY / cellSize);
        
        if (x >= 0 && x < gridSize && y >= 0 && y < gridSize && !revealed[x][y]) {
            flagged[x][y] = !flagged[x][y]; // Toggle flag
            if (flagged[x][y]) {
                ctx.fillStyle = "red";
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            } else {
                ctx.fillStyle = "white";
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
            ctx.strokeStyle = "black";
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    });
}

/**
 * Checks whether the selected cell is a mine or not. 
 * @param {*} x is the row index
 * @param {*} y is the column index
 * @returns 
 */
function isMine(x, y) {
    return grid[x][y] === 1;
}

/**
 * Randomly places mines on the grid. 
 */
function placeMines() {
    let placedMines = 0;
    while (placedMines < mines) {
        let x = Math.floor(Math.random() * gridSize);
        let y = Math.floor(Math.random() * gridSize);
        if (grid[x][y] === 0) {
            grid[x][y] = 1;
            placedMines++;
        }
    }
}

/**
 * Reveals all the cells on the grid. 
 */
function revealCells() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            revealed[i][j] = true;
            if (grid[i][j] == 1) { // cell is a mine
                ctx.fillStyle = "red";
            } else { // cell is not a mine : have to write the adjacent mines count on the cell
                let count = adjacentMines(i, j);
                ctx.fillStyle = "lightgray";
                ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
                ctx.strokeStyle = "black";
                ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);

                if (count > 0) { // show count of adjacent mines
                    ctx.fillStyle = "black";
                    ctx.font = "20px Arial";
                    ctx.fillText(count, i * cellSize + 10, j * cellSize + 30);
                }
                continue;
            }
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            ctx.strokeStyle = "black";
            ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
}

/**
 * Reset the game when hitting this reset button. 
 */
resetBtn.addEventListener("click", function () {
    clearInterval(timer); // Clear the existing timer
    grid = [];
    revealed = [];

    firstMove = true;

    min = 0;
    sec = 0;
    document.getElementById('timer').innerHTML = "00:00";

    drawGrid();
    placeMines();
    start(); 
})

/**
 * Reveal a cell when clicked on if it is not a mine. This will show how many adjacent cells are mines
 * @param {*} x is the row index
 * @param {*} y is the column index
 */
function revealCell(x, y) {
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize && !revealed[x][y]) {
        revealed[x][y] = true; //cell has been revealed
        let count = adjacentMines(x, y);

        ctx.fillStyle = "lightgray";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

        if (count > 0) {
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText(count, x * cellSize + 10, y * cellSize + 30);
        } else {
            //reveals recursively adjacent cells
            revealAdjacent(x, y);
        }
    }
}

/**
 * Recursively reveal adjacent cells if the cell is not a mine.
 * @param {*} x is the row index
 * @param {*} y is the column index
 * @returns 
 */
function revealAdjacent(x, y) {
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return;
    if (grid[x][y] === 2) return;
    grid[x][y] = 2; //revealed cell 
    revealed[x][y] = true;

    let count = adjacentMines(x, y);
    ctx.fillStyle = "lightgray";
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    ctx.strokeStyle = "black";
    ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

    if (count > 0) {
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(count, x * cellSize + 10, y * cellSize + 30);
    } else { // recursively reveal adjacent cells
        revealAdjacent(x - 1, y - 1);
        revealAdjacent(x, y - 1);
        revealAdjacent(x + 1, y - 1);
        revealAdjacent(x - 1, y);
        revealAdjacent(x + 1, y);
        revealAdjacent(x - 1, y + 1);
        revealAdjacent(x, y + 1);
        revealAdjacent(x + 1, y + 1);
    }
}

/**
 * Finds and returns the number of adjacent mines to a cell.
 * @param {*} x is the row index
 * @param {*} y is the column index
 * @returns the number of adjacent mines
 */
function adjacentMines(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let num_x = x + i;
            let num_y = y + j;
            if (num_x >= 0 && num_x < gridSize && num_y >= 0 && num_y < gridSize && grid[num_x][num_y] === 1) {
                count++;
            }
        }
    }
    return count;
}

function start() {
    if(firstMove){
        timer = setInterval(function () {
            sec++;
            if (sec >= 60) {
                sec = 0;
                min++;
            }
            document.getElementById('timer').innerHTML = (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
        }, 1000);
    } 
}

