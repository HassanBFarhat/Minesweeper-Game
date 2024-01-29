let width = 9;
let height = 9;
let bombs = 10;
let cellSize = 50;

let canvas = document.getElementById("canvas");
canvas.width = width * cellSize;
canvas.height = height * cellSize;
let ctx = canvas.getContext("2d");

// Loads the spritesheet
let spritesheet = document.getElementById("spritesheet");

// sprite positions (assume top left corner for coordinates)
let spritePositions = {
  closed: {x: 1, y: 50},
  open: {x: 18, y: 50},
  flagged: {x: 35, y: 50},
  bomb: {x: 86, y: 50},
  userHitBomb: {x: 103, y: 50},
  one: {x: 1, y: 67},
  two: {x: 18, y: 67},
  three: {x: 35, y: 67},
  four: {x: 52, y: 67},
  five: {x: 69, y: 67},
  six: {x: 86, y: 67},
  seven: {x: 103, y: 67},
  eight: {x: 120, y: 67}
}; 

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

  // Getting correct sprite for its state
  let spritePosition = this.open ? spritePositions.open : (this.flagged ? spritePositions.flagged : spritePositions.closed);
  ctx.drawImage(spritesheet, 1, 50, cellSize, cellSize, 0, 0, cellSize, cellSize);


  // ctx.fillStyle = this.open ? "#e8e8e8" : "#a6a6a6";
  // ctx.fillRect(1, 1, cellSize - 2, cellSize - 2);
  ctx.fillStyle = "#000000"
  ctx.strokeRect(0, 0, cellSize, cellSize)
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
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    processUserAction(mouseX, mouseY, (cell) => cell.click(gameField));
});

canvas.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    processUserAction(mouseX, mouseY, (cell) => cell.flag());
});