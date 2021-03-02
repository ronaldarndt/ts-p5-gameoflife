import P5 from 'p5';

const WIDTH = 800;
const ROWS = 10;
const SCALE = WIDTH / ROWS;

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const s = (p: P5) => {
  let pix: number[][];

  let button = p.createButton('ADVANCE');

  const updatePixel = (x: number, y: number, bw: number) => {
    var posX = x * SCALE + 1;
    var posY = y * SCALE + 1;

    p.rect(posX, posY, SCALE, SCALE);
    p.fill(bw);

    p.textSize(12);
    p.textAlign('right', 'bottom');
    p.text(`${y},${x}`, (x + 1) * SCALE + 1, (y + 1) * SCALE + 1);
  };

  const fillPixels = () => {
    pix.forEach((row, y) => {
      row.forEach((val, x) => {
        updatePixel(x, y, val ? 0 : 255);
      });
    });
  };

  const grid = () => {
    p.stroke(0);
    p.strokeWeight(1);

    for (let x = 1; x < WIDTH; x += SCALE) {
      p.line(x, 0, x, WIDTH);
      p.line(0, x, WIDTH, x);
    }

    var pos = WIDTH + 1;

    p.line(pos, 0, pos, pos);
    p.line(0, pos, pos, pos);
  };

  p.setup = function () {
    p.createCanvas(WIDTH + 2, WIDTH + 2);

    button.position(WIDTH + 25, WIDTH + 25);

    button.mousePressed(() => {
      p.redraw();
    });

    pix = [];

    for (let x = 0; x < ROWS; x++) {
      pix[x] = [];

      for (let y = 0; y < ROWS; y++) {
        pix[x][y] = 0;
      }
    }

    for (let i = 0; i < 15; i++) {
      pix[random(0, ROWS - 1)][random(0, ROWS - 1)] = 1;
    }

    p.noLoop();
  };

  p.draw = function () {
    grid();

    fillPixels();

    let newPix = [];

    for (let y = 0; y < ROWS; y++) {
      newPix[y] = [];

      for (let x = 0; x < ROWS; x++) {
        const cell = pix[y][x];

        const right = pix[y][x + 1] ?? 0;
        const left = pix[y][x - 1] ?? 0;

        const top = y == 0 ? 0 : getTotal(pix[y - 1].slice(x - 1, x + 1));
        const bottom = y >= ROWS - 1 ? 0 : getTotal(pix[y + 1].slice(x - 1, x + 1));

        const total = right + left + top + bottom;

        const alive = (cell && (total == 2 || total == 3)) || total == 2;

        newPix[y][x] = alive ? 1 : 0;
      }
    }

    pix = newPix;
  };
};

const getTotal = (arr: number[]) => arr.reduce((acc, curr) => acc + curr, 0);

let p5 = new P5(s, document.querySelector('body'));

export default p5;
