let width = 9;
let height = 9;
let bombs = 5;
let cellSize = 50;

let canvas = document.getElementById("canvas");
canvas.width = width * cellSize;
canvas.height = height * cellSize;
let ctx = canvas.getContext("2d");


function Cell (x, y) {
    this.x = x;
    this.y = y;
    this.bomb = false;
    this.flagged = false;
    this.open = false;
};


Cell.prototype.draw = (ctx, minefield) => {
    ctx.save();
    ctx.translate(this.x * cellSize, this.y * cellSize);
    ctx.fillStyle = this.open ? "#eee" : "#bbb";
    ctx.fillRect(1, 1, cellSize - 2, cellSize - 2);
    let str = "";
    if (this.flagged) {
        ctx.fillStyle = "#00f";
        str = String.fromCharCode(9873);
    } else if (this.open) {
        let bombsInArea = this.cellsAroundBomb(minefield).filter(c => c.bomb).length;
        if (this.bomb) {
            ctx.fillStyle = "#f00";
            str = "*";
        } else if (bombsInArea > 0) {
            ctx.fillStyle = "#000";
            str = bombsInArea;
        }
    }
    ctx.textAlign = "center";
    ctx.font = "20px Verdana";
    ctx.fillText(s, cellSize/2, cellSize/2 + 10);
    ctx.restore();
};


Cell.prototype.cellsAroundBomb = (field) => {
    let arr = [];
    for (let yy = -1; yy <= 1; yy++) {
        let arrY = this.y + yy;
        if (arrY < 0 || arrY >= height) {
            continue;
        }
        for (let xx = -1; xx <= 1; xx++) {
            if (xx == 0 && yy == 0) {
                continue;
            }
            let arrX = this.x + xx;
            if (arrX < 0 || arrX >= width) {
                continue;
            }
            arr.push(field[arrY][arrX]);
        }
    }
    return arr;
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
    return gameArray;
};


function draw() {
    eachCell(cell => cell.draw(ctx, field));
};

function openAll() {
    eachCell(cell => cell.open = true);
};

openAll();

function eachCell(fxn) {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            fxn(field[i][j]);
        }
    }
};


draw();