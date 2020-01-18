import * as code from "./code";

type NumberBox = {
  value: number;
  y: number;
  oy: number;
  color: string;
  sx: number;
  sy: number;
};

let numberBoxes: NumberBox[];
let context: CanvasRenderingContext2D;
const size = { x: 280, y: 500 };
const boxSize = { x: 27, y: 27 };
export const ascendingColor = "#e91e63";
export const descendingColor = "#3f51b5";

export function init() {
  const canvas: HTMLCanvasElement = document.querySelector("#canvas");
  canvas.width = size.x;
  canvas.height = size.y;
  context = canvas.getContext("2d");
}

export function setData() {
  numberBoxes = code.data.map((d, i) => {
    return {
      value: d,
      y: 64 + i * boxSize.y,
      oy: 0,
      color: "#a1a1a1",
      sx: 0,
      sy: 0
    };
  });
}

export function swapData(
  from: number,
  to: number,
  ratio: number,
  isDescending: boolean
) {
  const nf = numberBoxes[from];
  const nt = numberBoxes[to];
  nf.oy = (to - from) * boxSize.y * ratio;
  nt.oy = (from - to) * boxSize.y * ratio;
  const color = isDescending ? descendingColor : ascendingColor;
  nf.color = color;
  nt.color = color;
  nf.sx = (Math.random() * 5 - 2) * ratio;
  nf.sy = (Math.random() * 5 - 2) * ratio;
  nt.sx = (Math.random() * 5 - 2) * ratio;
  nt.sy = (Math.random() * 5 - 2) * ratio;
}

export function clear() {
  context.clearRect(0, 0, size.x, size.y);
}

export function drawInstructions(x: number, instructions: string[]) {
  setFontSize(10);
  context.fillStyle = "#616161";
  let y = 80;
  instructions.forEach(inst => {
    context.fillText(inst.substr(0, 16), x, y);
    y += 15;
  });
}

export function drawNumberBoxes() {
  setFontSize(20);
  let lps = [];
  let lc: string;
  numberBoxes.forEach(nb => {
    context.fillStyle = nb.color;
    context.fillRect(
      size.x / 2 - boxSize.x / 2 + nb.sx,
      nb.y + nb.sy,
      boxSize.x,
      boxSize.y
    );
    if (nb.color === ascendingColor) {
      lc = ascendingColor;
      lps.push({ x: size.x / 2 - boxSize.x * 1.5, y: nb.y + boxSize.y / 2 });
      context.fillRect(
        size.x / 2 - boxSize.x * 1.5,
        nb.y + boxSize.y / 2 - 1,
        boxSize.x,
        3
      );
    }
    if (nb.color === descendingColor) {
      lc = descendingColor;
      lps.push({ x: size.x / 2 + boxSize.x * 1.5, y: nb.y + boxSize.y / 2 });
      context.fillRect(
        size.x / 2 + boxSize.x * 0.5,
        nb.y + boxSize.y / 2 - 1,
        boxSize.x,
        3
      );
    }
    context.fillStyle = "#ffffff";
    context.fillRect(
      size.x / 2 - boxSize.x / 2 + 3 + nb.sx,
      nb.y + 3 + nb.sy,
      boxSize.x - 6,
      boxSize.y - 6
    );
    const v = nb.value.toString();
    context.fillStyle = "#616161";
    context.fillText(v, size.x / 2 - (v.length - 1) * 10, nb.y + nb.oy + 20);
  });
  if (lps.length > 0) {
    context.fillStyle = lc;
    context.fillRect(lps[0].x - 1, lps[0].y - 1, 3, lps[1].y - lps[0].y + 3);
  }
}

export function drawText(
  str: string,
  x: number,
  y: number,
  color: string,
  size: number
) {
  context.fillStyle = color;
  setFontSize(size);
  context.fillText(str, x, y);
}

export function drawGauge(ratio: number) {
  context.fillStyle = ascendingColor;
  context.fillRect(5, 30, ratio * 270, 10);
  context.fillStyle = descendingColor;
  context.fillRect(ratio * 270, 30, 270 - ratio * 270, 10);
}

function setFontSize(v: number) {
  context.font = `${v}px Inconsolata`;
}
