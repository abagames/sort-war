import * as code from "./code";
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

let ascendingTextArea: HTMLTextAreaElement;
let descendingTextArea: HTMLTextAreaElement;
let startButton: HTMLButtonElement;

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
}

function onClickStart() {
  start();
}

let ascendingCode: code.Code;
let descendingCode: code.Code;

function start() {
  code.initData();
  ascendingCode = code.getCode(ascendingTextArea.value);
  descendingCode = code.getCode(descendingTextArea.value, true);
  for (let i = 0; i <= 1000000; i++) {
    if (!code.step(ascendingCode)) {
      code.reset(ascendingCode);
    }
    if (!code.step(descendingCode)) {
      code.reset(descendingCode);
    }
    const asc = code.countDataAscending();
    const dec = code.countDataAscending(true);
    if (asc === 0 || dec === 0) {
      console.log(`${asc} ${dec} ${i}`);
      console.log(code.data);
      break;
    }
    if (i % 100000 === 0) {
      console.log(`${asc} ${dec} ${i}`);
      console.log(code.data);
    }
  }
}
