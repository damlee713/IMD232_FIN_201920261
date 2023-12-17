const tiles = [];
const rowNum = 50,
  colNum = 50;

const ROCK = 'rock';
const PAPER = 'paper';
const SCISSORS = 'scissors';

function setup() {
  setCanvasContainer('canvas', 1, 1, true);

  const w = width / colNum;
  const h = w;
  for (let row = 0; row < rowNum; row++) {
    for (let col = 0; col < colNum; col++) {
      const x = w * col;
      const y = h * row;
      const initialStates = [ROCK, PAPER, SCISSORS];
      const initialState = random(initialStates);
      const newTile = new Cell(x, y, w, h, initialState);
      tiles.push(newTile);
    }
  }

  for (let row = 0; row < rowNum; row++) {
    for (let col = 0; col < colNum; col++) {
      const neighborsIdx = [
        getIdx(row - 1, col - 1),
        getIdx(row - 1, col),
        getIdx(row - 1, col + 1),
        getIdx(row, col + 1),
        getIdx(row + 1, col + 1),
        getIdx(row + 1, col),
        getIdx(row + 1, col - 1),
        getIdx(row, col - 1),
      ];

      if (col === 0) {
        neighborsIdx[0] = -1;
        neighborsIdx[6] = -1;
        neighborsIdx[7] = -1;
      } else if (col === colNum - 1) {
        neighborsIdx[2] = -1;
        neighborsIdx[3] = -1;
        neighborsIdx[4] = -1;
      }

      if (row === 0) {
        neighborsIdx[0] = -1;
        neighborsIdx[1] = -1;
        neighborsIdx[2] = -1;
      } else if (row === rowNum - 1) {
        neighborsIdx[4] = -1;
        neighborsIdx[5] = -1;
        neighborsIdx[6] = -1;
      }

      const neighbors = neighborsIdx.map((eachIdx) =>
        eachIdx >= 0 ? tiles[eachIdx] : null
      );

      const idx = getIdx(row, col);
      tiles[idx].setNeighbors(neighbors);
    }
  }

  frameRate(15);
  background(255);
  tiles.forEach((each) => {
    each.display();
  });
}

function draw() {
  background(255);

  tiles.forEach((each) => {
    each.calcNextState();
  });

  tiles.forEach((each) => {
    each.update();
  });

  tiles.forEach((each) => {
    each.display();
  });
}

class Cell {
  constructor(x, y, width, height, initialState) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.state = initialState;
    this.neighbors = [];
  }

  setNeighbors(neighbors) {
    this.neighbors = neighbors;
  }

  calcNextState() {
    const opponentStates = this.neighbors.map((neighbor) =>
      neighbor ? neighbor.state : null
    );

    const numDefeats = opponentStates.reduce((count, state) => {
      if (
        (this.state === ROCK && state === PAPER) ||
        (this.state === PAPER && state === SCISSORS) ||
        (this.state === SCISSORS && state === ROCK)
      ) {
        return count + 1;
      }
      return count;
    }, 0);

    if (numDefeats <= 2) {
      this.nextState = this.state;
    } else {
      const defeatingState = opponentStates.find(
        (state) =>
          (this.state === ROCK && state === PAPER) ||
          (this.state === PAPER && state === SCISSORS) ||
          (this.state === SCISSORS && state === ROCK)
      );
      this.nextState = defeatingState;
    }
  }

  update() {
    this.state = this.nextState;
  }

  display() {
    const colorMap = {
      [ROCK]: color(255, 255, 0),
      [PAPER]: color(0, 0, 255),
      [SCISSORS]: color(255, 0, 0),
    };

    fill(colorMap[this.state]);
    stroke(0);
    rect(this.x, this.y, this.width, this.height);
  }
}

function getIdx(row, col) {
  return row * colNum + col;
}
