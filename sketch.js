let BoardInfo = new Object;
BoardInfo.boardPos = [];
BoardInfo.radius = 0;
BoardInfo.xArray = [];
//BoardInfo.boardSpace = 20;

let turn = 1;

let startingPieces = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
];

let Pieces = [
  [0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
];

console.log(isWin());

let nextPiece = 0;


//7 Long and 6 High board

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateBoardPos();
}

function reset() {
  turn = 1;
  for (let i = 0; i < Pieces.length; i++) {
    for (let j = 0; j < Pieces[i].length; j++) {
      Pieces[i][j] = startingPieces[i][j];
    }
  }
}

function getColor(a, b) {
  let sBit = false;
  let piece = Pieces[a][b];
  for (let i = 0; i < b; i++) {
    if (Pieces[a][i] == 1) {
      sBit = true;
    }
  }
  if (!sBit)
    return 0;
  if (sBit && piece == 1)
    return 1;
  if (sBit && piece == 0)
    return 2;
  console.log("Something awful happened in getColor()");
}

function draw() {
  background(220);
  noFill();
  strokeWeight(5);
  rect(10, 10, windowWidth - 20, windowHeight - 20, );
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
      let x = BoardInfo.boardPos[i][j].x;
      let y = BoardInfo.boardPos[i][j].y;

      nextPiece = getColor(i, j + 1);

      if (nextPiece == 0) {
        fill(255,255,255);
      }
      else if (nextPiece == 1) {
        fill(255,0,0);
      }
      else {
        fill(255,255,0);
      }

      circle(x, y, BoardInfo.radius * 2);
      //fill(0,0,0);
      //text("(" + i.toString() + ", " + j.toString() + ")",x-15, y);
    }
  }

  if (turn == 1) {
    fill(255,255,0);
  }
  else {
    fill(255,0,0);
  }
  circle(mouseX, mouseY, BoardInfo.radius*2);
}

function isWin() {
  for (let i = 0; i < Pieces.length; i++) {
    let last = -1;
    let count = 1;
    let start = false;
    for (let j = 1; j < Pieces[i].length; j++) {
      let piece = Pieces[i][j]
      if (piece == 0 && !start) {
        start = true;
        continue;
      }
      if (piece == last) {
        count++;
      }
      else {
        last = piece;
        count = 1;
      }
      if ((count == 4 && last == 0) || (count == 5 && last == 1)) {
        return true;
      }
    }
  }
  return false;
}

function calculateBoardPos() {
  //let xSpace = (windowWidth / BoardInfo.boardSpace) * 8;
  //let ySpace = (windowHeight / BoardInfo.boardSpace) * 7;

  let xSpace = windowWidth / 5;
  let ySpace = windowHeight / 5;
  BoardInfo.xArray = [];

  let Space = 0;
  if (windowHeight * 1.2 > windowWidth) {
    BoardInfo.radius = (windowWidth - xSpace) / 8 / 2;
    Space = xSpace / 8;
  } else {
    BoardInfo.radius = (windowHeight - ySpace) / 7  / 2;
    Space = ySpace / 7;
  }
  for (let i = 0; i < 7; i++) {
    let column = [];
    for (let j = 0; j < 6; j++) {
      column[j] = new Vector(((i + 1) * Space) + ((i + 1) * 2 * BoardInfo.radius) - (Space / 2), ((j + 1) * Space) + ((j + 1) * 2 * BoardInfo.radius))
    }
    BoardInfo.xArray.push(column[0].x);
    BoardInfo.boardPos[i] = column;
  }

}

function addPiece(player, col) {
  //console.log("Adding a piece...")
  if (Pieces[col][0] == 1) {
    return -1;
  }
  for (let i = 0; i < Pieces[col].length; i++) {
    if (Pieces[col][i] == 1) {
      Pieces[col][i] = player;
      Pieces[col][i - 1] = 1;
      return 1;
    }
  }
  //console.log("Adding bottom Piece");
  Pieces[col][6] = player;
  Pieces[col][5] = 1;
  return 1;
}

/*
* This functions takes
* an array of X values
* and finds which one the
* given value is closest to
*/
function findClosestCol(xArray) {
  let dist = 1000;
  let col = 0;
  //print(xArray);
  for (let i = 0; i < xArray.length; i++) {
    if (abs(mouseX - xArray[i]) < dist) {
      dist = abs(mouseX - xArray[i]);
      col = i;
    }
  }
  print("clicked column " + col)
  return col;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateBoardPos();
}

function mouseClicked() {
  if (turn == 1) {
    if (addPiece(0, findClosestCol(BoardInfo.xArray)) == 1) {
      turn = 0;
    }
  }
  else {
    if (addPiece(1, findClosestCol(BoardInfo.xArray)) == 1) {
      turn = 1;
    }
  }
}

function keyPressed() {
  if (keyCode == ESCAPE) {
    reset();
  }

  if (keyCode == SHIFT) {
    console.log(Pieces);
  }
}