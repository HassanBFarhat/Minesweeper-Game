let width = 9;
let height = 9;
let bombs = 5;
let cellSize = 50;

let canvas = document.getElementById("canvas");
canvas.width = width * cellSize;
canvas.height = height * cellSize;

function Cell (x, y) {
    this.x = x;
    this.y = y;
    this.bomb = false;
    this.flagged = false;
    this.open = false;
};

Cell.prototype.draw = (ctx, minefield) => {
    ctx.save();
    


    ctx.restore();
};








let gameField = init();

function init() {
    let gameArray = [];
    for (let i = 0; i < height; i++) {
        let row = [];
        for (let j = 0; j < width; j++) {
            row.push(new Cell(j, i));
        }
        gameArray.push(row);
    }
    for (let i = 0; i < bombs; i++) {
        while (true) {
            let x = Math.floor(width * Math.random());
            let y = Math.floor(height * Math.random());
            if (!gameArray[y][x].bomb) {
                gameArray[y][x].bomb = true;
                break;
            }
        }
    }
};