let width = 12;
let height = 12;
let bombs = 10;
let cellSize = 50;

let canvas = document.getElementById("canvas");
canvas.width = width * cellSize;
canvas.height = height * cellSize;
let ctx = canvas.getContext("2d");

function Cell(x, y) {
  this.x = x;
  this.y = y;
  this.bomb = false;
  this.flagged = false;
  this.open = false;
}

Cell.prototype.draw = function (ctx, minefield) {
  ctx.save();
  ctx.translate(this.x * cellSize, this.y * cellSize);
  ctx.fillStyle = this.open ? "#eee" : "#bbb";
  ctx.fillRect(1, 1, cellSize - 2, cellSize - 2);
  let str = "";
  if (this.flagged) {
    ctx.fillStyle = "#00f";
    str = String.fromCharCode(9873);
  } else if (this.open) {
    let bombsInArea = this.cellsAroundBomb(minefield).filter(
      (c) => c.bomb
    ).length;
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
  ctx.fillText(str, cellSize / 2, cellSize / 2 + 10);
  ctx.restore();
};

Cell.prototype.cellsAroundBomb = function (minefield) {
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
      arr.push(minefield[arrY][arrX]);
    }
  }
  return arr;
};

Cell.prototype.flag = function () {
  if (!this.open) {
    this.flagged = !this.flagged;
    return true;
  }
};

Cell.prototype.click = function (minefield) {
  if (this.open) {
    return true;
  }
  if (this.bomb) {
    return false;
  }
  this.open = true;
  let cells = this.cellsAroundBomb(minefield);
  if (cells.filter((c) => c.bomb).length == 0) {
    cells.forEach((c) => c.click(minefield));
  }
  return true;
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
}

function draw() {
  eachCell((cell) => cell.draw(ctx, gameField));
}

function openAll() {
  eachCell((cell) => (cell.open = true));
}

// openAll();
function eachCell(fxn) {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      fxn(gameField[i][j]);
    }
  }
}

function gameWin () {
    let bombsFound = 0;
    eachCell(cell => {
        if (cell.bomb && cell.flagged) {
            bombsFound++;
        }
    });
    return bombs == bombsFound;
};

function endGame (txt) {
    openAll();
    draw();
    setTimeout(function () {
        alert(txt);
        window.location.reload();
    }, 50);
};

function processUserAction (x, y, fxn) {
    let cell = gameField[Math.floor(y/cellSize)][Math.floor(x/cellSize)];
    let ok = fxn(cell);
    draw();
    if (!ok) {
        endGame("Game over. YOU LOSE");
    }
    if (gameWin()) {
        endGame("YOU WIN");   
    }
};

draw();

canvas.addEventListener("click", function (e) {
    processUserAction(e.clientX, e.clientY, (cell) => cell.click(gameField));
});

canvas.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    processUserAction(e.clientX, e.clientY, (cell) => cell.flag());
});