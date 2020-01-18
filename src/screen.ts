import * as code from "./code";

type NumberBox = {
  value: number;
  y: number;
  oy: number;
};

export const swappingInterval = 10;
let numberBoxes: NumberBox[];
let context: CanvasRenderingContext2D;
const size = { x: 280, y: 500 };
const boxSize = { x: 24, y: 24 };

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
      y: 100 + i * boxSize.y,
      oy: 0
    };
  });
}

export function swapData(
  from: number,
  to: number,
  ratio: number,
  isDescending: boolean
) {
  numberBoxes[from].oy = (to - from) * boxSize.y * ratio;
  numberBoxes[to].oy = (from - to) * boxSize.y * ratio;
}

export function update() {
  context.clearRect(0, 0, size.x, size.y);
  context.fillStyle = "#616161";
  setFontSize(20);
  numberBoxes.forEach(nb => {
    const v = nb.value.toString();
    context.fillText(v, size.x / 2 - (v.length - 1) * 10, nb.y + nb.oy);
  });
}

function setFontSize(v: number) {
  context.font = `${v}px Inconsolata`;
}
