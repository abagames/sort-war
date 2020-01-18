import * as code from "./code";
import * as screen from "./screen";
declare const mdc: any;

const quickCode = `// quick
function sort(l, h) {
  if (l < h) {
    i = l; j = h;
    p = med(get(i),
      get(Math.floor(i + (j - i) / 2)),
      get(j));
    while(true) {
      while (get(i) < p) i++;
      while (p < get(j)) j--;
      if (i >= j) break;
      swap(i, j);
      i++; j--;
    }
    sort(l, i - 1);
    sort(j + 1, h);
  }
}
function med(x, y, z) {
  if (x < y) {
    if (y < z) return y;
    else if (z < x) return x;
    else return z;
  } else {
    if (z < y) return y;
    else if (x < z) return x;
    else return z;
  }
}
sort(0, length - 1);
`;
const insertionCode = `// insertion
for (i = 1; i < length; i++) {
  j = i;
  while (j > 0 && get(j - 1) > get(j)) {
    swap(j, j - 1);
    j--;
  }
}
`;

window.addEventListener("load", onLoad);

type Swapping = {
  ticks: number;
  from: number;
  to: number;
};

let ascendingTextArea: HTMLTextAreaElement;
let descendingTextArea: HTMLTextAreaElement;
let startButton: HTMLButtonElement;
let ascendingSwapping: Swapping;
let descendingSwapping: Swapping;
let isStarting = false;

function onLoad() {
  new mdc.textField.MDCTextField(
    document.querySelectorAll(".mdc-text-field")[0]
  ).value = quickCode;
  new mdc.textField.MDCTextField(
    document.querySelectorAll(".mdc-text-field")[1]
  ).value = insertionCode;
  ascendingTextArea = document.querySelector("#ascending-side-code");
  descendingTextArea = document.querySelector("#descending-side-code");
  new mdc.ripple.MDCRipple(document.querySelector(".mdc-button"));
  startButton = document.querySelector("#start");
  startButton.addEventListener("click", onClickStart);
  screen.init();
  update();
  onClickStart();
}

function onClickStart() {
  start();
}

let ascendingCode: code.Code;
let descendingCode: code.Code;
let swappingInterval: number;

function start() {
  code.initData();
  ascendingSwapping = { ticks: 0, from: -1, to: -1 };
  descendingSwapping = { ticks: 0, from: -1, to: -1 };
  ascendingCode = code.getCode(ascendingTextArea.value);
  descendingCode = code.getCode(descendingTextArea.value, true);
  isStarting = true;
  swappingInterval = 10;
}

function update() {
  requestAnimationFrame(update);
  if (!isStarting) {
    return;
  }
  if (ascendingSwapping.ticks > 0) {
    screen.swapData(
      ascendingSwapping.from,
      ascendingSwapping.to,
      ascendingSwapping.ticks / swappingInterval,
      false
    );
    screen.update();
    ascendingSwapping.ticks--;
    return;
  }
  if (descendingSwapping.ticks > 0) {
    screen.swapData(
      descendingSwapping.from,
      descendingSwapping.to,
      descendingSwapping.ticks / swappingInterval,
      true
    );
    screen.update();
    descendingSwapping.ticks--;
    return;
  }
  for (let i = 0; i < 256; i++) {
    code.step(ascendingCode);
    code.step(descendingCode);
    if (ascendingCode.isSwapCalled || descendingCode.isSwapCalled) {
      break;
    }
  }
  if (ascendingCode.isSwapCalled) {
    ascendingSwapping = {
      ticks: swappingInterval,
      from: ascendingCode.swappingFrom,
      to: ascendingCode.swappingTo
    };
  }
  if (descendingCode.isSwapCalled) {
    descendingSwapping = {
      ticks: swappingInterval,
      from: descendingCode.swappingFrom,
      to: descendingCode.swappingTo
    };
  }
  if (ascendingCode.isTerminated) {
    code.reset(ascendingCode);
  }
  if (descendingCode.isTerminated) {
    code.reset(descendingCode);
  }
  const asc = code.countDataAscending();
  const dec = code.countDataAscending(true);
  if (asc === 0 || dec === 0) {
    isStarting = false;
  }
  if (asc + dec > 1) {
    swappingInterval += (1 - swappingInterval) * 0.05;
  } else {
    swappingInterval += (10 - swappingInterval) * 0.05;
  }
  screen.setData();
  screen.update();
}
